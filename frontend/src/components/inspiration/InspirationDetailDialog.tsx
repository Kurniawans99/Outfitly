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
  Star,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  toggleLike,
  toggleSave,
  addComment,
} from "@/services/inspiration/inspirationService";
import { SaveInspoItemToWardrobeDialog } from "../wardrobe/SaveInspoItemToWardrobeDialog";

// Enhanced Outfit Item Component
const OutfitItem: React.FC<{
  item: InspoItem;
  onSave: (item: InspoItem) => void;
}> = ({ item, onSave }) => (
  <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-sky-50/50 border border-transparent hover:border-blue-100 transition-all duration-300">
    <div className="relative">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-20 h-24 object-cover rounded-xl bg-slate-100 shadow-sm group-hover:shadow-lg transition-shadow duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="flex-grow">
      <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors duration-200">
        {item.name}
      </p>
      <p className="text-sm text-slate-500 mb-1">{item.category}</p>
      {item.brand && (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-400 fill-current" />
          <p className="text-xs text-slate-400 font-medium">{item.brand}</p>
        </div>
      )}
    </div>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onSave(item)}
      title="Simpan ke Wardrobe"
      className="rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border-0 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <BookmarkPlus className="h-5 w-5" />
    </Button>
  </div>
);

// Enhanced Comment Component
const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50/50 transition-colors duration-200">
    <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
      <AvatarImage src={comment.author.avatar?.url} />
      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-sm font-medium">
        {comment.author.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
    <div className="flex-grow">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-sm text-slate-800">
          {comment.author.name}
        </span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs text-slate-500">Baru saja</span>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">
        {comment.content}
      </p>
    </div>
  </div>
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
      onPostUpdate(updatedPost);
      if (action === "comment") {
        setCommentContent("");
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
        <DialogContent className="max-w-5xl lg:max-w-7xl w-[96%] p-0 h-auto max-h-[95vh] grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          {/* Enhanced Image Column */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center h-96 lg:h-full">
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="object-cover w-full h-full"
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

            {/* Floating share button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Enhanced Detail Column */}
          <div className="flex flex-col bg-white max-h-[95vh] w-full">
            {/* Enhanced Header */}
            <div className="p-6 border-b border-slate-100 flex-shrink-0 bg-gradient-to-r from-white to-blue-50/30">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 ring-3 ring-blue-100 shadow-lg">
                    <AvatarImage src={post.author.avatar?.url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-bold text-slate-800 text-lg">
                      {post.author.name}
                    </span>
                    <p className="text-sm text-slate-500">Fashion Creator</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAction("like")}
                  disabled={isSubmitting}
                  className={`rounded-xl border-0 shadow-sm transition-all duration-200 ${
                    isLiked
                      ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/25"
                      : "bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 hover:shadow-md"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {post.likeCount} Suka
                </Button>
                <Button
                  variant={isSaved ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAction("save")}
                  disabled={isSubmitting}
                  className={`rounded-xl border-0 shadow-sm transition-all duration-200 ${
                    isSaved
                      ? "bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 hover:shadow-md"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`}
                  />
                  {post.saveCount} Simpan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-0 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {post.commentCount}
                </Button>
              </div>
            </div>

            {/* Enhanced Scrollable Content */}
            <ScrollArea className="flex-grow min-h-0">
              <div className="p-6">
                {/* Enhanced Caption & Tags */}
                <div className="mb-8">
                  <p className="text-base text-slate-800 leading-relaxed mb-4 font-medium">
                    {post.caption}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={`font-medium text-sm px-3 py-1.5 rounded-full border-0 transition-colors duration-200 ${
                          index === 0
                            ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 hover:from-blue-200 hover:to-blue-100"
                            : index === 1
                            ? "bg-gradient-to-r from-sky-100 to-sky-50 text-sky-700 hover:from-sky-200 hover:to-sky-100"
                            : index === 2
                            ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 hover:from-purple-200 hover:to-purple-100"
                            : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 hover:from-slate-200 hover:to-slate-100"
                        }`}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="my-6 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                {/* Enhanced Items Section */}
                {post.items.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl">
                        <Star className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-xl text-slate-900">
                        Item dalam Outfit Ini
                      </h3>
                      <div className="flex-grow h-px bg-gradient-to-r from-slate-200 to-transparent" />
                    </div>
                    <div className="space-y-3 bg-gradient-to-br from-slate-50/50 to-blue-50/30 rounded-2xl p-4">
                      {post.items.map((item) => (
                        <OutfitItem
                          key={item._id}
                          item={item}
                          onSave={handleSaveItemClick}
                        />
                      ))}
                    </div>
                    <Separator className="mt-8 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                  </div>
                )}

                {/* Enhanced Comments Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900">
                      Komentar ({post.commentCount})
                    </h3>
                    <div className="flex-grow h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  </div>
                  <div className="space-y-4">
                    {post.comments.length > 0 ? (
                      <div className="bg-gradient-to-br from-slate-50/50 to-green-50/30 rounded-2xl p-4 space-y-3">
                        {post.comments.map((comment) => (
                          <CommentItem key={comment._id} comment={comment} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gradient-to-br from-slate-50/50 to-blue-50/30 rounded-2xl">
                        <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">
                          Jadilah yang pertama berkomentar
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          Bagikan pendapat Anda tentang outfit ini
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Enhanced Comment Input Footer */}
            <div className="p-6 border-t border-slate-100 bg-gradient-to-r from-white to-blue-50/30 flex-shrink-0">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10 ring-2 ring-blue-100 shadow-sm">
                  <AvatarImage src="/api/placeholder/100/100?text=Me" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-medium">
                    Me
                  </AvatarFallback>
                </Avatar>
                <Input
                  placeholder="Tulis komentar yang membangun..."
                  className="flex-grow bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 py-3"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAction("comment");
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex-shrink-0"
                  onClick={() => handleAction("comment")}
                  disabled={isSubmitting || !commentContent.trim()}
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
