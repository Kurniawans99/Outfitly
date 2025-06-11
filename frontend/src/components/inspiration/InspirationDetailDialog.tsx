// src/components/inspiration/InspirationDetailV2.tsx

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  InspirationPost,
  OutfitItem as OutfitItemType,
} from "./InspirationCard";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Heart, Bookmark, CalendarPlus, Plus, Send } from "lucide-react";
import { Input } from "../ui/input";

const dummyComments = [
  {
    user: { name: "Bima", avatarUrl: "/api/placeholder/100/100?text=B" },
    text: "Keren banget OOTD-nya! 🔥",
  },
  {
    user: { name: "Citra", avatarUrl: "/api/placeholder/100/100?text=C" },
    text: "Suka sama perpaduan warnanya, simpel tapi elegan.",
  },
  {
    user: { name: "Dewi", avatarUrl: "/api/placeholder/100/100?text=D" },
    text: "Inspiratif sekali!",
  },
  {
    user: { name: "Eko", avatarUrl: "/api/placeholder/100/100?text=E" },
    text: "Celananya beli di mana kak?",
  },
  {
    user: { name: "Fitri", avatarUrl: "/api/placeholder/100/100?text=F" },
    text: "Wah, auto masuk ke planner outfit mingguanku. Thanks!",
  },
  {
    user: { name: "Gilang", avatarUrl: "/api/placeholder/100/100?text=G" },
    text: "Mantap!",
  },
];

interface InspirationDetailV2Props {
  post: InspirationPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OutfitItem: React.FC<{ item: OutfitItemType }> = ({ item }) => (
  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50 transition-colors">
    <img
      src={item.imageUrl}
      alt={item.name}
      className="w-20 h-24 object-cover rounded-md bg-slate-100"
    />
    <div className="flex-grow">
      <p className="font-semibold text-slate-800">{item.name}</p>
      <p className="text-sm text-slate-500">{item.category}</p>
    </div>
    <Button variant="outline" size="sm" className="flex-shrink-0">
      <Plus className="w-4 h-4 mr-2" /> Simpan
    </Button>
  </div>
);

const DetailHeader: React.FC<{ post: InspirationPost }> = ({ post }) => (
  <div className="p-4 pr-14 border-b flex-shrink-0">
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={post.user.avatarUrl} />
          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{post.user.name}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        <Button variant="ghost" size="sm">
          <Heart className="w-4 h-4 mr-2" />
          Suka
        </Button>
        <Button variant="ghost" size="sm">
          <Bookmark className="w-4 h-4 mr-2" />
          Simpan
        </Button>
        <Button className="bg-sky-600 hover:bg-sky-700 text-white" size="sm">
          <CalendarPlus className="w-4 h-4 mr-2" />
          Planner
        </Button>
      </div>
    </div>
  </div>
);

export const InspirationDetailV2: React.FC<InspirationDetailV2Props> = ({
  post,
  open,
  onOpenChange,
}) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl lg:max-w-6xl w-[95%] p-0 h-auto max-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-lg">
        <div className="bg-black flex items-center justify-center h-96 md:h-full">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col bg-white max-h-[90vh] w-full">
          <DetailHeader post={post} />

          {/* --- PERBAIKAN FINAL DI SINI --- */}
          {/* Menambahkan min-h-0 untuk memastikan flex-grow dapat di-scroll */}
          <ScrollArea className="flex-grow min-h-0">
            <div className="p-5">
              <div className="mb-6">
                <p className="text-base text-slate-800 leading-relaxed">
                  {post.caption}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="my-6">
                <h3 className="font-semibold text-lg mb-3 text-slate-900">
                  Item dalam Outfit Ini
                </h3>
                <div className="space-y-2">
                  {post.items.map((item) => (
                    <OutfitItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
              <Separator />
              <div className="my-6">
                <h3 className="font-semibold text-lg mb-4 text-slate-900">
                  Komentar ({dummyComments.length})
                </h3>
                <div className="space-y-5">
                  {dummyComments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={comment.user.avatarUrl} />
                        <AvatarFallback>
                          {comment.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-semibold text-sm">
                          {comment.user.name}
                        </span>
                        <p className="text-sm text-slate-700 mt-0.5">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src="/api/placeholder/100/100?text=Me" />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
              <Input placeholder="Tulis komentar..." className="flex-grow" />
              <Button
                size="icon"
                className="bg-sky-600 hover:bg-sky-700 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
