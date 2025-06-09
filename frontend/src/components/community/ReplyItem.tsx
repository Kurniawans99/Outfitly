import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CornerDownRight } from "lucide-react";
import { Reply } from "@/services/community/community.types";

interface ReplyItemProps {
  reply: Reply;
  onLike: () => void;
}

export function ReplyItem({ reply, onLike }: ReplyItemProps) {
  // Ganti ini dengan cara Anda mendapatkan ID user yang sedang login
  const currentUserId = localStorage.getItem("userId") || "";
  const isLiked = reply.likes.includes(currentUserId);

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={reply.author.avatar?.url}
              alt={reply.author.name}
            />
            <AvatarFallback>
              {reply.author.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="font-semibold text-slate-800">
                  {reply.author.name}
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  · {new Date(reply.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onLike}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isLiked ? "text-red-500 fill-current" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>
            <p className="text-slate-700">{reply.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
