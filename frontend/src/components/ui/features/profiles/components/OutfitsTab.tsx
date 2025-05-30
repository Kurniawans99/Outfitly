// src/components/features/profile/components/OutfitsTab.tsx
import React from "react";
import { OutfitData } from "../profile.types"; // Asumsi OutfitData ada di profile.types.ts
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart, Eye } from "lucide-react";

// Data outfit statis (seperti di kode asli)
const recentOutfits: OutfitData[] = [
  {
    id: 1,
    image: "/api/placeholder/300/400",
    title: "Summer Casual",
    likes: 23,
    views: 156,
  },
  {
    id: 2,
    image: "/api/placeholder/300/400",
    title: "Office Chic",
    likes: 31,
    views: 203,
  },
  {
    id: 3,
    image: "/api/placeholder/300/400",
    title: "Weekend Vibes",
    likes: 18,
    views: 134,
  },
  {
    id: 4,
    image: "/api/placeholder/300/400",
    title: "Date Night",
    likes: 42,
    views: 289,
  },
  {
    id: 5,
    image: "/api/placeholder/300/400",
    title: "Brunch Look",
    likes: 27,
    views: 178,
  },
  {
    id: 6,
    image: "/api/placeholder/300/400",
    title: "Street Style",
    likes: 35,
    views: 221,
  },
];

interface OutfitItemProps {
  outfit: OutfitData;
}

const OutfitItem: React.FC<OutfitItemProps> = ({ outfit }) => {
  return (
    <div className="group cursor-pointer">
      <Card className="overflow-hidden">
        {" "}
        {/* Card untuk setiap outfit item */}
        <AspectRatio ratio={3 / 4} className="bg-slate-200">
          <img
            src={outfit.image}
            alt={outfit.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            {/* Bisa tambahkan tombol atau info di sini saat hover */}
          </div>
        </AspectRatio>
        <CardContent className="p-3">
          {" "}
          {/* Padding lebih kecil untuk konten di bawah gambar */}
          <h4
            className="font-medium text-slate-900 text-sm mb-1 truncate"
            title={outfit.title}
          >
            {outfit.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {outfit.likes}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {outfit.views}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const OutfitsTab: React.FC = () => {
  // Logika untuk filter (Terbaru, Terpopuler) bisa ditambahkan di sini
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Outfits</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Terbaru
            </Button>
            <Button variant="ghost" size="sm">
              Terpopuler
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recentOutfits.map((outfit) => (
            <OutfitItem key={outfit.id} outfit={outfit} />
          ))}
        </div>
        {recentOutfits.length === 0 && (
          <p className="text-slate-600 text-center py-8">Belum ada outfit.</p>
        )}
      </CardContent>
    </Card>
  );
};
