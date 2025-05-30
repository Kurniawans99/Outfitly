import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio"; // Untuk gambar di Most Popular
import { OutfitData, UserStatsState } from "../profile.types"; // Impor tipe jika dibutuhkan untuk data dinamis

// Data statis, nantinya bisa dari props atau API
const quickStatsData = {
  outfitsThisMonth: 12,
  totalViews: "8.5K", // Bisa jadi number jika dari API
  avgLikes: 28,
};

const styleTagsData = [
  "Casual",
  "Vintage",
  "Modern",
  "Minimalist",
  "Bohemian",
  "Street Style",
];

// Menggunakan data outfit statis yang sama dengan OutfitsTab untuk contoh
const popularOutfitsData: Pick<
  OutfitData,
  "id" | "image" | "title" | "likes"
>[] = [
  {
    id: 1,
    image: "/api/placeholder/150/150",
    title: "Summer Casual",
    likes: 23,
  },
  { id: 4, image: "/api/placeholder/150/150", title: "Date Night", likes: 42 },
  {
    id: 6,
    image: "/api/placeholder/150/150",
    title: "Street Style",
    likes: 35,
  },
];

interface ProfileSidebarProps {
  // stats?: UserStatsState; // Jika ingin mengambil stats dari API untuk Quick Stats
  // userProfile?: ProfileDataState; // Jika ingin mengambil style tags dari data profil
  // popularOutfits?: OutfitData[]; // Jika ingin mengambil data outfit populer dari API
}

export const ProfileSidebar: React.FC<
  ProfileSidebarProps
> = (/* { stats, userProfile, popularOutfits } */) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Stats</CardTitle>{" "}
          {/* Ukuran font disesuaikan */}
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Outfit Bulan Ini</span>
            <span className="font-medium text-slate-900">
              {quickStatsData.outfitsThisMonth}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Total Views</span>
            <span className="font-medium text-slate-900">
              {quickStatsData.totalViews}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Average Likes</span>
            <span className="font-medium text-slate-900">
              {quickStatsData.avgLikes}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Style Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Style Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {styleTagsData.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
            {styleTagsData.length === 0 && (
              <p className="text-xs text-slate-500">Belum ada style tags.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Most Popular Outfits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Most Popular</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularOutfitsData.slice(0, 3).map((outfit) => (
            <div key={outfit.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-200">
                <AspectRatio ratio={1}>
                  <img
                    src={outfit.image}
                    alt={outfit.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
              <div className="flex-1">
                <p
                  className="font-medium text-slate-900 text-sm truncate"
                  title={outfit.title}
                >
                  {outfit.title}
                </p>
                <p className="text-xs text-slate-600">{outfit.likes} likes</p>
              </div>
            </div>
          ))}
          {popularOutfitsData.length === 0 && (
            <p className="text-xs text-slate-500">Belum ada outfit populer.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
