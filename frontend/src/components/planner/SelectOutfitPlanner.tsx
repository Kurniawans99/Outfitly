// frontend/src/components/planner/SelectOutfitPlanner.tsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card"; // Import CardTitle, CardDescription
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Loader2,
  Calendar,
  Sparkles,
  Shirt,
  Folder, // Import Folder icon
  ArrowLeft, // Import ArrowLeft icon
} from "lucide-react";
import { toast } from "sonner";
import {
  getWardrobeItems,
  getWardrobes,
  ClothingItem,
  Wardrobe,
} from "@/services/wardrobeService"; // Import Wardrobe type
import {
  InspirationPost,
  InspoItem,
} from "@/services/inspiration/inspiration.types";
import { getAllInspirationPosts } from "@/services/inspiration/inspirationService";
import {
  planOutfit,
  PlanOutfitPayload,
} from "@/services/planner/plannerService";
import { Skeleton } from "@/components/ui/skeleton";

export type SelectableItem = {
  _id: string;
  name: string;
  imageUrl: string;
  category: string;
  itemType: "WardrobeItem" | "InspoItem";
};

interface SelectOutfitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onOutfitPlanned: () => void;
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
  const [activeTab, setActiveTab] = useState("wardrobe");
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [allWardrobes, setAllWardrobes] = useState<Wardrobe[]>([]); // New state for all wardrobes
  const [selectedWardrobe, setSelectedWardrobe] = useState<Wardrobe | null>(
    null
  ); // New state for selected wardrobe
  const [inspirationItems, setInspirationItems] = useState<InspoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanning, setIsPlanning] = useState(false);

  // Memoized function to fetch items based on selected wardrobe/tab
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeTab === "wardrobe" && !selectedWardrobe) {
        // If 'wardrobe' tab is active and no specific wardrobe is selected,
        // fetch all wardrobes to let the user choose
        const wardrobesResponse = await getWardrobes({});
        setAllWardrobes(wardrobesResponse.data);
        setWardrobeItems([]); // Clear items until a wardrobe is selected
      } else if (activeTab === "wardrobe" && selectedWardrobe) {
        // If a specific wardrobe is selected, fetch items from that wardrobe
        const itemsRes = await getWardrobeItems(selectedWardrobe._id, {
          search: searchTerm,
        });
        setWardrobeItems(itemsRes.data);
        setAllWardrobes([]); // Clear all wardrobes list when showing items
      } else if (activeTab === "inspiration" || activeTab === "semua") {
        // Fetch inspiration items for 'inspiration' or 'semua' tab
        const inspirationPostsRes = await getAllInspirationPosts({
          search: searchTerm,
        });
        const allInspoItems: InspoItem[] = [];
        inspirationPostsRes.forEach((post) => {
          post.items.forEach((item) => {
            allInspoItems.push(item);
          });
        });
        setInspirationItems(allInspoItems);

        // If 'semua' tab is active, also fetch all wardrobe items
        if (activeTab === "semua") {
          const wardrobesResponse = await getWardrobes({});
          let allWardrobeItems: ClothingItem[] = [];
          for (const wardrobe of wardrobesResponse.data) {
            const itemsRes = await getWardrobeItems(wardrobe._id, {
              search: searchTerm,
            });
            allWardrobeItems = allWardrobeItems.concat(itemsRes.data);
          }
          setWardrobeItems(allWardrobeItems);
        }
      }
    } catch (error) {
      toast.error("Gagal memuat item pakaian atau inspirasi.");
      console.error("Fetch items error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [open, searchTerm, activeTab, selectedWardrobe]); // Added selectedWardrobe to dependencies

  useEffect(() => {
    if (open) {
      fetchItems();
    } else {
      // Reset states when dialog closes
      setSearchTerm("");
      setSelectedItemId(null);
      setSelectedItemType(null);
      setActiveTab("wardrobe");
      setWardrobeItems([]);
      setAllWardrobes([]);
      setSelectedWardrobe(null);
      setInspirationItems([]);
      setIsLoading(true);
      setIsPlanning(false);
    }
  }, [open, fetchItems]);

  const selectableItems: SelectableItem[] = useMemo(() => {
    let combinedItems: SelectableItem[] = [];

    if (activeTab === "wardrobe") {
      combinedItems = wardrobeItems
        .filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item): SelectableItem => ({ ...item, itemType: "WardrobeItem" })); // Explicitly cast
    } else if (activeTab === "inspiration") {
      combinedItems = inspirationItems
        .filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item): SelectableItem => ({ ...item, itemType: "InspoItem" })); // Explicitly cast
    } else if (activeTab === "semua") {
      const filteredWardrobe = wardrobeItems
        .filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item): SelectableItem => ({ ...item, itemType: "WardrobeItem" })); // Explicitly cast

      const filteredInspiration = inspirationItems
        .filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item): SelectableItem => ({ ...item, itemType: "InspoItem" })); // Explicitly cast

      combinedItems = filteredWardrobe.concat(filteredInspiration);
    }
    return combinedItems;
  }, [searchTerm, activeTab, wardrobeItems, inspirationItems]);

  const handleSelect = async () => {
    if (!selectedItemId || !selectedItemType || !selectedDate) {
      toast.warning("Pilih setidaknya satu item dan tanggal.");
      return;
    }

    setIsPlanning(true);
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const payload: PlanOutfitPayload = {
        date: dateString,
        items: [{ itemType: selectedItemType, item: selectedItemId }],
        outfitName: "Outfit Terencana",
        occasion: "",
      };

      await planOutfit(payload);
      toast.success("Outfit berhasil direncanakan!");
      onOutfitPlanned();
      onOpenChange(false);
      setSelectedItemId(null);
      setSelectedItemType(null);
      setSearchTerm("");
      setActiveTab("wardrobe");
      setSelectedWardrobe(null); // Reset selected wardrobe on successful plan
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
      <DialogContent className="sm:max-w-[900px] h-[92vh] flex flex-col bg-white shadow-xl">
        <DialogHeader className="border-b border-blue-100 pb-6 bg-gradient-to-r from-blue-50 to-white -mx-6 px-6 -mt-6 pt-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-800 leading-tight">
                Pilih Outfit Sempurna
              </DialogTitle>
              <DialogDescription className="text-lg text-blue-600 font-medium mt-1">
                {selectedDate?.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </DialogDescription>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Temukan kombinasi outfit terbaik dari koleksi Anda atau inspirasi
            fashion terkini
          </p>
        </DialogHeader>

        {/* Enhanced Search and Filter Section */}
        <div className="flex-shrink-0 space-y-4 py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-500 rounded-xl blur opacity-20"></div>
            <div className="relative bg-white rounded-xl border border-blue-200 shadow-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
              <Input
                placeholder="Cari outfit impian Anda..."
                className="pl-12 pr-4 py-3 border-0 bg-transparent text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setSelectedWardrobe(null); // Reset selected wardrobe when changing tabs
              setSearchTerm(""); // Reset search term when changing tabs
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-blue-50 border border-blue-200 rounded-xl p-1">
              <TabsTrigger
                value="wardrobe"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 text-gray-600 font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <Shirt className="w-4 h-4" />
                Lemari Saya
              </TabsTrigger>
              <TabsTrigger
                value="inspiration"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 text-gray-600 font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Inspirasi
              </TabsTrigger>
              <TabsTrigger
                value="semua"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-blue-200 text-gray-600 font-medium rounded-lg transition-all duration-200"
              >
                Semua
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Dynamic Content Area based on Tab and Selected Wardrobe */}
        <ScrollArea className="flex-grow my-4 min-h-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pr-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl bg-gradient-to-br from-blue-100 to-blue-50" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-blue-100" />
                    <Skeleton className="h-3 w-1/2 bg-blue-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "wardrobe" && !selectedWardrobe ? (
            // Display list of wardrobes if 'wardrobe' tab is active and no wardrobe is selected
            allWardrobes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pr-4">
                {allWardrobes.map((wardrobe) => (
                  <Card
                    key={wardrobe._id}
                    onClick={() => setSelectedWardrobe(wardrobe)}
                    className="group cursor-pointer transition-all duration-300 hover:scale-105 border-2 bg-white shadow-sm hover:shadow-xl border-blue-100 hover:border-blue-300 rounded-xl overflow-hidden"
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-bold text-slate-800 line-clamp-1">
                        {wardrobe.name}
                      </CardTitle>
                      <Folder className="w-6 h-6 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-gray-500 line-clamp-2">
                        {wardrobe.description || "Koleksi pakaian Anda"}
                      </CardDescription>
                      <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                        <Shirt className="w-4 h-4" />
                        <span>{wardrobe.itemCount || 0} items</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Folder className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Tidak ada lemari ditemukan
                </h3>
                <p className="text-sm text-gray-400">
                  Buat lemari di halaman Wardrobe untuk menambah item.
                </p>
              </div>
            )
          ) : selectableItems.length > 0 ? (
            // Display items if a wardrobe is selected or in other tabs
            <>
              {activeTab === "wardrobe" && selectedWardrobe && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedWardrobe(null)}
                  className="mb-4 text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Daftar Lemari
                </Button>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pr-4">
                {selectableItems.map((item) => (
                  <Card
                    key={`${item.itemType}-${item._id}`}
                    onClick={() => {
                      setSelectedItemId(item._id);
                      setSelectedItemType(item.itemType);
                    }}
                    className={`group cursor-pointer transition-all duration-300 hover:scale-105 border-2 bg-white shadow-sm hover:shadow-xl ${
                      selectedItemId === item._id &&
                      selectedItemType === item.itemType
                        ? "ring-4 ring-blue-500 ring-offset-2 border-blue-500 shadow-xl scale-105"
                        : "border-blue-100 hover:border-blue-300"
                    } rounded-xl overflow-hidden`}
                  >
                    <div className="relative">
                      <AspectRatio
                        ratio={4 / 5}
                        className="overflow-hidden rounded-t-xl"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </AspectRatio>

                      {/* Selection Indicator */}
                      {selectedItemId === item._id &&
                        selectedItemType === item.itemType && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}

                      {/* Item Type Badge */}
                      <div
                        className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                          item.itemType === "WardrobeItem"
                            ? "bg-blue-500 text-white"
                            : "bg-purple-500 text-white"
                        }`}
                      >
                        {item.itemType === "WardrobeItem"
                          ? "Lemari"
                          : "Inspirasi"}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-gray-800 truncate text-sm leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full inline-block">
                        {item.category}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Tidak ada item ditemukan
              </h3>
              <p className="text-sm text-gray-400">
                Coba ubah kata kunci pencarian atau filter
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Enhanced Footer */}
        <DialogFooter className="flex-shrink-0 border-t border-blue-100 pt-6 bg-gradient-to-r from-white to-blue-50/30 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
          <div className="flex items-center justify-between w-full gap-4">
            <Button
              variant="outline"
              disabled={isPlanning}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Outfit Baru
              <span className="text-xs text-gray-400 ml-2">(Segera Hadir)</span>
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPlanning}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
              >
                Batal
              </Button>
              <Button
                onClick={handleSelect}
                disabled={isPlanning || !selectedItemId || !selectedItemType}
                className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Merencanakan...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Pilih Outfit
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
