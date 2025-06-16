import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark } from "lucide-react";
// Gunakan tipe data baru dari service
import { InspirationPost } from "@/services/inspiration/inspiration.types";

interface InspirationCardProps {
  post: InspirationPost;
  onClick: (post: InspirationPost) => void;
}

export const InspirationCard: React.FC<InspirationCardProps> = ({
  post,
  onClick,
}) => {
  // Aksi tombol telah dipindahkan ke dialog detail untuk state management yang lebih mudah
  return (
    <div onClick={() => onClick(post)} className="group cursor-pointer">
      <Card className="break-inside-avoid-column mb-4 overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-auto"
          />
        </div>

        <CardContent className="p-4">
          <p className="font-semibold text-sm text-slate-800 mb-2 line-clamp-2">
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
                <AvatarImage
                  src={post.author.avatar?.url}
                  alt={post.author.name}
                />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-slate-600">
                {post.author.name}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-slate-500">
                <Bookmark className="h-4 w-4" />
                <span className="text-sm font-medium">{post.saveCount}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">{post.likeCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
