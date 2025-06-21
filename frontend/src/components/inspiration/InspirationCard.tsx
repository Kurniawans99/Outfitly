import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, Eye } from "lucide-react";
import { InspirationPost } from "@/services/inspiration/inspiration.types";

interface InspirationCardProps {
  post: InspirationPost;
  onClick: (post: InspirationPost) => void;
}

export const InspirationCard: React.FC<InspirationCardProps> = ({
  post,
  onClick,
}) => {
  return (
    <div onClick={() => onClick(post)} className="group cursor-pointer">
      <Card className="break-inside-avoid-column mb-6 overflow-hidden bg-white shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-blue-500/10 group-hover:border-blue-200 transition-all duration-500 ease-out transform group-hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Floating view indicator */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
        </div>

        <CardContent className="p-5">
          <p className="font-semibold text-sm text-slate-800 mb-3 line-clamp-2 leading-relaxed">
            {post.caption}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={tag}
                variant="secondary"
                className={`font-normal text-xs px-2.5 py-1 rounded-full border-0 transition-colors duration-200 ${
                  index === 0
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    : index === 1
                    ? "bg-sky-50 text-sky-700 hover:bg-sky-100"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge
                variant="secondary"
                className="font-normal text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500"
              >
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                <AvatarImage
                  src={post.author.avatar?.url}
                  alt={post.author.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs font-medium">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700">
                  {post.author.name}
                </span>
                <span className="text-xs text-slate-500">Fashion Creator</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors duration-200">
                <div className="p-1.5 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors duration-200">
                  <Bookmark className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium">{post.saveCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors duration-200">
                <div className="p-1.5 rounded-full bg-slate-50 group-hover:bg-red-50 transition-colors duration-200">
                  <Heart className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium">{post.likeCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
