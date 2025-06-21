// src/components/planner/SelectOutfitDialog.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Loader2 } from "lucide-react"; // Import Loader2
import { toast } from "sonner";
import { getWardrobeItems, ClothingItem } from "@/services/wardrobeService"; //
import {
  InspirationPost,
  InspoItem,
} from "@/services/inspiration/inspiration.types"; // <-- IMPOR TIPE DARI .types
import { getAllInspirationPosts } from "@/services/inspiration/inspirationService"; // <-- IMPOR FUNGSI DARI .Service
import {
  planOutfit,
  PlanOutfitPayload,
} from "@/services/planner/plannerService";
import { Skeleton } from "@/components/ui/skeleton";

// Tipe data untuk item yang dapat dipilih (gabungan dari ClothingItem dan InspoItem)
export type SelectableItem = {
  _id: string;
  name: string;
  imageUrl: string;
  category: string; // Kategori bisa berbeda
  itemType: "WardrobeItem" | "InspoItem"; // Menandai asal item
};

interface SelectOutfitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onOutfitPlanned: () => void; // Callback baru setelah outfit berhasil direncanakan
}

export const SelectOutfitDialog: React.FC<SelectOutfitDialogProps> = ({
  open,
  onOpenChange,
  selectedDate,
  onOutfitPlanned,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<
    "WardrobeItem" | "InspoItem" | null
  >(null);
  const [activeTab, setActiveTab] = useState("wardrobe"); // Default ke 'lemari'
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [inspirationItems, setInspirationItems] = useState<InspoItem[]>([]); // InspoItem adalah sub-dokumen dari InspirationPost
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanning, setIsPlanning] = useState(false);

  // Ambil ID Wardrobe pertama pengguna untuk fetch items
  // Anda mungkin perlu logika yang lebih canggih jika user punya banyak wardrobe
  const [userWardrobeId, setUserWardrobeId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return; // Hanya fetch saat dialog terbuka

    const fetchItems = async () => {
      setIsLoading(true);
      try {
        // Fetch Wardrobe Items
        // Anda perlu mendapatkan wardrobeId yang relevan, misalnya yang pertama
        // Untuk demo, kita akan fetch semua item dari *semua* wardrobe user atau perluas getWardrobeItems
        // Untuk saat ini, asumsikan ada satu wardrobe utama atau modifikasi getWardrobeItems
        // Jika ada Wardrobe ID spesifik yang perlu diambil, Anda harus memuatnya dulu.
        // Untuk demo ini, kita akan melewati id wardrobe, yang berarti endpoint di backend perlu menerima null/undefined
        // atau kita harus ambil daftar wardrobe dulu.
        // Contoh: Ambil wardrobe pertama jika ada
        const { getWardrobes } = await import("@/services/wardrobeService"); //
        const wardrobesResponse = await getWardrobes({}); //
        if (wardrobesResponse.data.length > 0) {
          const firstWardrobeId = wardrobesResponse.data[0]._id; //
          setUserWardrobeId(firstWardrobeId);

          const wardrobeItemsRes = await getWardrobeItems(firstWardrobeId, {
            search: searchTerm,
          }); //
          setWardrobeItems(wardrobeItemsRes.data); //
        } else {
          setWardrobeItems([]);
        }

        // Fetch Inspiration Items from all posts
        // Ini akan sedikit berbeda karena InspoItem ada di dalam InspirationPost
        // Kita perlu fetch InspirationPosts, lalu ekstrak InspoItem-nya.
        const inspirationPostsRes = await getAllInspirationPosts({
          search: searchTerm,
        }); //

        // Ekstrak semua InspoItem dari semua postingan inspirasi
        const allInspoItems: InspoItem[] = []; //
        inspirationPostsRes.forEach((post) => {
          //
          post.items.forEach((item) => {
            //
            allInspoItems.push(item); //
          });
        });
        setInspirationItems(allInspoItems); //
      } catch (error) {
        toast.error("Gagal memuat item pakaian atau inspirasi.");
        console.error("Fetch items error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [open, searchTerm]); // Re-fetch when dialog opens or search term changes

  // Gabungkan dan filter item berdasarkan tab aktif dan pencarian
  const selectableItems: SelectableItem[] = useMemo(() => {
    let combinedItems: SelectableItem[] = [];

    if (activeTab === "wardrobe" || activeTab === "semua") {
      const filteredWardrobe = wardrobeItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      combinedItems = combinedItems.concat(
        filteredWardrobe.map((item) => ({ ...item, itemType: "WardrobeItem" }))
      );
    }

    if (activeTab === "inspiration" || activeTab === "semua") {
      const filteredInspiration = inspirationItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      combinedItems = combinedItems.concat(
        filteredInspiration.map((item) => ({ ...item, itemType: "InspoItem" }))
      );
    }

    return combinedItems;
  }, [searchTerm, activeTab, wardrobeItems, inspirationItems]); //

  const handleSelect = async () => {
    if (!selectedItemId || !selectedItemType || !selectedDate) {
      toast.warning("Pilih setidaknya satu item dan tanggal.");
      return;
    }

    setIsPlanning(true);
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // getMonth() 0-indexed
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const payload: PlanOutfitPayload = {
        date: dateString, // Kirim sebagai '2025-06-17'
        items: [{ itemType: selectedItemType, item: selectedItemId }],
        outfitName: "Outfit Terencana",
        occasion: "",
      };

      await planOutfit(payload);
      toast.success("Outfit berhasil direncanakan!");
      onOutfitPlanned(); // Beri tahu parent untuk refresh data
      onOpenChange(false);
      // Reset state lokal
      setSelectedItemId(null);
      setSelectedItemType(null);
      setSearchTerm("");
      setActiveTab("wardrobe");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal merencanakan outfit."
      );
      console.error("Error planning outfit:", error);
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Pilih Outfit untuk{" "}
            <span className="text-sky-600">
              {selectedDate?.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </DialogTitle>
          <DialogDescription>
            Pilih item dari lemari Anda atau dari inspirasi untuk merencanakan
            outfit.
          </DialogDescription>
        </DialogHeader>

        {/* Toolbar: Search dan Filter */}
        <div className="flex-shrink-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Cari nama outfit atau item..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              {" "}
              {/* Diubah dari 5 menjadi 3 */}
              <TabsTrigger value="wardrobe">Dari Lemari</TabsTrigger>
              <TabsTrigger value="inspiration">Dari Inspirasi</TabsTrigger>
              <TabsTrigger value="semua">Semua</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Grid Item Pakaian */}
        <ScrollArea className="flex-grow my-4 min-h-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pr-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : selectableItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pr-3">
              {selectableItems.map((item) => (
                <Card
                  key={`${item.itemType}-${item._id}`} // Gunakan kombinasi ID dan tipe untuk kunci unik
                  onClick={() => {
                    setSelectedItemId(item._id);
                    setSelectedItemType(item.itemType);
                  }}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedItemId === item._id &&
                    selectedItemType === item.itemType // Pastikan keduanya cocok
                      ? "ring-2 ring-sky-500 shadow-lg"
                      : "hover:shadow-md"
                  }`}
                >
                  <AspectRatio
                    ratio={4 / 5}
                    className="overflow-hidden rounded-t-lg"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="p-2 text-center">
                    <p className="font-semibold text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.itemType === "WardrobeItem"
                        ? "Lemari"
                        : "Inspirasi"}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              Tidak ada item ditemukan.
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" disabled={isPlanning}>
            <Plus className="w-4 h-4 mr-2" />
            Buat Outfit Baru (Coming Soon)
          </Button>
          <div className="flex-grow" />
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPlanning}
          >
            Batal
          </Button>
          <Button
            onClick={handleSelect}
            disabled={isPlanning || !selectedItemId || !selectedItemType}
            className="bg-sky-600 hover:bg-sky-700"
          >
            {isPlanning ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : null}
            Pilih
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
