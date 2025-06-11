// src/components/inspiration/InspirationCard.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, CalendarPlus } from "lucide-react";

export type OutfitItem = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
};

export type InspirationPost = {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  imageUrl: string;
  caption: string;
  tags: string[];
  likes: number;
  items: OutfitItem[];
};

interface InspirationCardProps {
  post: InspirationPost;
  onClick: (post: InspirationPost) => void;
}

export const InspirationCard: React.FC<InspirationCardProps> = ({
  post,
  onClick,
}) => {
  // --- BARU: Fungsi untuk menangani klik tombol internal ---
  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    action: string
  ) => {
    e.stopPropagation(); // Mencegah event 'click' menyebar ke parent (kartu)
    alert(`${action} post ${post.id}`);
  };

  return (
    <div onClick={() => onClick(post)} className="group cursor-pointer">
      <Card className="overflow-hidden  transition-all duration-300 ease-in-out  hover:shadow-2xl hover:-translate-y-2">
        <div className="relative">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-auto"
          />
          {/* Overlay yang muncul saat hover untuk menampilkan tombol aksi */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end items-start p-2">
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="bg-white/90 text-slate-800 hover:bg-white"
                onClick={(e) => handleButtonClick(e, "Simpan")}
              >
                <Bookmark className="h-4 w-4 mr-2 text-sky-600" /> Simpan
              </Button>
              <Button
                size="sm"
                className="bg-white/90 text-slate-800 hover:bg-white"
                onClick={(e) => handleButtonClick(e, "Gunakan di Planner")}
              >
                <CalendarPlus className="h-4 w-4 mr-2 text-green-600" /> Planner
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <p className="font-semibold text-sm text-slate-800 mb-2">
            {post.caption}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user.avatarUrl} alt={post.user.name} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-slate-600">
                {post.user.name}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-red-500"
                onClick={(e) => handleButtonClick(e, "Like")}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-600 font-medium">
                {post.likes}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
