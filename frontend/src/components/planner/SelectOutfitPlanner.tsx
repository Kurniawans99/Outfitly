// src/components/planner/SelectOutfitDialog.tsx

import React, { useState, useMemo } from "react";
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
import { Search, Plus } from "lucide-react";

// Tipe data untuk item di dalam dialog
export type SelectableItem = {
  id: string;
  name: string;
  imageUrl: string;
  category: "Setelan" | "Atasan" | "Bawahan" | "Aksesoris";
  items?: string[]; // Hanya untuk 'Setelan'
};

// --- Data Dummy (akan diganti dengan data dari API wardrobe) ---
const dummyWardrobeItems: SelectableItem[] = [
  {
    id: "outfit1",
    name: "Meeting Klien",
    imageUrl: "/api/placeholder/400/500?text=Office+Look",
    category: "Setelan",
    items: ["Kemeja", "Celana Chino"],
  },
  {
    id: "outfit2",
    name: "Casual Hangout",
    imageUrl: "/api/placeholder/400/500?text=Casual+Vibe",
    category: "Setelan",
    items: ["T-shirt", "Jeans"],
  },
  {
    id: "item1",
    name: "Kemeja Flanel Kotak",
    imageUrl: "/api/placeholder/400/500?text=Flanel",
    category: "Atasan",
  },
  {
    id: "item2",
    name: "Celana Jeans Biru",
    imageUrl: "/api/placeholder/400/500?text=Jeans",
    category: "Bawahan",
  },
  {
    id: "item3",
    name: "T-Shirt Polos Hitam",
    imageUrl: "/api/placeholder/400/500?text=T-Shirt",
    category: "Atasan",
  },
  {
    id: "item4",
    name: "Sneakers Putih",
    imageUrl: "/api/placeholder/400/500?text=Sneakers",
    category: "Aksesoris",
  },
  {
    id: "item5",
    name: "Jaket Denim",
    imageUrl: "/api/placeholder/400/500?text=Jacket",
    category: "Atasan",
  },
  {
    id: "item6",
    name: "Celana Kargo Hijau",
    imageUrl: "/api/placeholder/400/500?text=Cargo",
    category: "Bawahan",
  },
];

interface SelectOutfitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectItem: (item: SelectableItem) => void;
  selectedDate: Date | null;
}

export const SelectOutfitDialog: React.FC<SelectOutfitDialogProps> = ({
  open,
  onOpenChange,
  onSelectItem,
  selectedDate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("semua");

  const filteredItems = useMemo(() => {
    return dummyWardrobeItems.filter((item) => {
      const matchesCategory =
        activeTab === "semua" || item.category.toLowerCase() === activeTab;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeTab]);

  const handleSelect = () => {
    if (selectedItemId) {
      const selectedItem = dummyWardrobeItems.find(
        (item) => item.id === selectedItemId
      );
      if (selectedItem) {
        onSelectItem(selectedItem);
      }
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
            Pilih setelan yang sudah ada atau gabungkan beberapa item dari
            lemari Anda.
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="semua">Semua</TabsTrigger>
              <TabsTrigger value="setelan">Setelan</TabsTrigger>
              <TabsTrigger value="atasan">Atasan</TabsTrigger>
              <TabsTrigger value="bawahan">Bawahan</TabsTrigger>
              <TabsTrigger value="aksesoris">Aksesoris</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Grid Item Pakaian */}
        <ScrollArea className="flex-grow my-4 min-h-0">
          {" "}
          {/* <-- TAMBAHKAN min-h-0 DI SINI */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pr-3">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedItemId === item.id
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
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.category}</p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Buat Outfit Baru
          </Button>
          <div className="flex-grow" />
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedItemId}
            className="bg-sky-600 hover:bg-sky-700"
          >
            Pilih
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
