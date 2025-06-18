import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  InspirationPost,
  InspoItem,
  Comment,
} from "@/services/inspiration/inspiration.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Heart,
  Bookmark,
  Send,
  Plus,
  Loader2,
  BookmarkPlus,
} from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  toggleLike,
  toggleSave,
  addComment,
} from "@/services/inspiration/inspirationService";
import { SaveInspoItemToWardrobeDialog } from "../wardrobe/SaveInspoItemToWardrobeDialog";

// Komponen Item Outfit (tidak berubah banyak)
const OutfitItem: React.FC<{
  item: InspoItem;
  onSave: (item: InspoItem) => void;
}> = ({ item, onSave }) => (
  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50">
    <img
      src={item.imageUrl}
      alt={item.name}
      className="w-20 h-24 object-cover rounded-md bg-slate-100"
    />
    <div className="flex-grow">
      <p className="font-semibold text-slate-800">{item.name}</p>
      <p className="text-sm text-slate-500">{item.category}</p>
      {item.brand && (
        <p className="text-xs text-slate-400">Brand: {item.brand}</p>
      )}
    </div>
    {/* --- TAMBAHKAN TOMBOL INI --- */}
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onSave(item)}
      title="Simpan ke Wardrobe"
    >
      <BookmarkPlus className="h-5 w-5 text-sky-600 hover:text-sky-700" />
    </Button>
  </div>
);

// Komponen Komentar (tidak berubah banyak)
const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  console.log(comment),
  (
    <div className="flex items-start gap-3">
      <Avatar className="w-9 h-9">
        <AvatarImage src={comment.author.avatar?.url} />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <span className="font-semibold text-sm">{comment.author.name}</span>
        <p className="text-sm text-slate-700 mt-0.5">{comment.content}</p>
      </div>
    </div>
  )
);

interface InspirationDetailV2Props {
  post: InspirationPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUpdate: (updatedPost: InspirationPost) => void;
}

export const InspirationDetailV2: React.FC<InspirationDetailV2Props> = ({
  post,
  open,
  onOpenChange,
  onPostUpdate,
}) => {
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaveItemDialogOpen, setSaveItemDialogOpen] = useState(false);
  const [itemToSave, setItemToSave] = useState<InspoItem | null>(null);

  const currentUserId = localStorage.getItem("userId") || "";

  const handleSaveItemClick = (item: InspoItem) => {
    setItemToSave(item);
    setSaveItemDialogOpen(true);
  };

  if (!post) return null;

  const isLiked = post.likes.includes(currentUserId);
  const isSaved = post.saves.includes(currentUserId);

  const handleAction = async (action: "like" | "save" | "comment") => {
    if (isSubmitting) return;

    let promise;
    if (action === "comment" && !commentContent.trim()) {
      toast.warning("Komentar tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);

    switch (action) {
      case "like":
        promise = toggleLike(post._id);
        break;
      case "save":
        promise = toggleSave(post._id);
        break;
      case "comment":
        promise = addComment(post._id, commentContent);
        break;
      default:
        setIsSubmitting(false);
        return;
    }

    try {
      const updatedPost = await promise;
      onPostUpdate(updatedPost); // Update state di parent
      if (action === "comment") {
        setCommentContent(""); // Reset input field
        toast.success("Komentar berhasil dikirim!");
      }
    } catch (error) {
      toast.error("Aksi gagal.", {
        description: "Gagal memperbarui data postingan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl lg:max-w-6xl w-[95%] p-0 h-auto max-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-lg">
          {/* Kolom Gambar */}
          <div className="bg-black flex items-center justify-center h-96 md:h-full">
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Kolom Detail */}
          <div className="flex flex-col bg-white max-h-[90vh] w-full">
            {/* Header Dialog */}
            <div className="p-4 pr-14 border-b flex-shrink-0">
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar?.url} />
                    <AvatarFallback>
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{post.author.name}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <Button
                    variant={isLiked ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleAction("like")}
                    disabled={isSubmitting}
                    className={isLiked ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {post.likeCount} Suka
                  </Button>
                  <Button
                    variant={isSaved ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleAction("save")}
                    disabled={isSubmitting}
                    className={isSaved ? "bg-sky-600 hover:bg-sky-700" : ""}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    {post.saveCount} Simpan
                  </Button>
                </div>
              </div>
            </div>

            {/* Konten Scrollable */}
            <ScrollArea className="flex-grow min-h-0">
              <div className="p-5">
                {/* Caption & Tags */}
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

                {/* Item dalam Outfit */}
                {post.items.length > 0 && (
                  <div className="my-6">
                    <h3 className="font-semibold text-lg mb-3 text-slate-900">
                      Item dalam Outfit Ini
                    </h3>
                    <div className="space-y-2">
                      {post.items.map((item) => (
                        <OutfitItem
                          key={item._id}
                          item={item}
                          onSave={handleSaveItemClick}
                        />
                      ))}
                    </div>
                    <Separator className="mt-6" />
                  </div>
                )}

                {/* Komentar */}
                <div className="my-6">
                  <h3 className="font-semibold text-lg mb-4 text-slate-900">
                    Komentar ({post.commentCount})
                  </h3>
                  <div className="space-y-5">
                    {post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} />
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        Jadilah yang pertama berkomentar.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Footer Input Komentar */}
            <div className="p-4 border-t bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarImage src="/api/placeholder/100/100?text=Me" />
                  <AvatarFallback>Me</AvatarFallback>
                </Avatar>
                <Input
                  placeholder="Tulis komentar..."
                  className="flex-grow"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button
                  size="icon"
                  className="bg-sky-600 hover:bg-sky-700 flex-shrink-0"
                  onClick={() => handleAction("comment")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <SaveInspoItemToWardrobeDialog
        isOpen={isSaveItemDialogOpen}
        onOpenChange={setSaveItemDialogOpen}
        itemToSave={itemToSave}
      />
    </>
  );
};
