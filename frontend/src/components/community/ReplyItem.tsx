// src/components/community/ReplyItem.tsx (REVISED)

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Reply } from "@/services/community/community.types";
import { useState } from "react";

interface ReplyItemProps {
  reply: Reply;
  onLike: () => void;
}

export function ReplyItem({ reply, onLike }: ReplyItemProps) {
  const currentUserId = localStorage.getItem("userId") || ""; // Ganti dengan state management user Anda
  const [isLiked, setIsLiked] = useState(reply.likes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(reply.likes.length);

  const handleLikeClick = () => {
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike(); // Panggil fungsi dari parent untuk request ke server
  };

  return (
    <div className="flex items-start gap-4 p-5 bg-white/80 backdrop-blur-sm border border-blue-100 shadow-lg hover:shadow-xl rounded-xl transition-shadow duration-300">
      <Avatar className="h-10 w-10 ring-2 ring-blue-100">
        <AvatarImage src={reply.author.avatar?.url} alt={reply.author.name} />
        <AvatarFallback className="bg-blue-500 text-white">
          {reply.author.name?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-semibold text-gray-800">
              {reply.author.name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              ·{" "}
              {new Date(reply.createdAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{reply.content}</p>
        <div className="flex items-center mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50"
            onClick={handleLikeClick}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-200 ${
                isLiked ? "text-red-500 fill-current" : ""
              }`}
            />
            <span className="font-medium text-sm">
              {likeCount > 0 ? likeCount : ""}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
