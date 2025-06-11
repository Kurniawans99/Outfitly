// src/components/community/CreatePostDialogue.tsx (REVISED)

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookText, MessageSquareText, Tag } from "lucide-react";

interface CreatePostDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPostCreated: (postData: {
    title: string;
    content: string;
    tags: string;
  }) => Promise<boolean>;
}

export function CreatePostDialog({
  isOpen,
  onOpenChange,
  onPostCreated,
}: CreatePostDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !content) {
      toast.error("Judul dan isi postingan tidak boleh kosong.");
      return;
    }
    setIsSaving(true);
    const success = await onPostCreated({ title, content, tags });
    setIsSaving(false);

    if (success) {
      onOpenChange(false);
      setTitle("");
      setContent("");
      setTags("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-sm border-blue-100 shadow-2xl rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-blue-800">
            Buat Diskusi Baru
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Bagikan inspirasi atau tanyakan sesuatu kepada komunitas.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 px-2">
          {/* Judul Input */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="flex items-center text-gray-700 font-semibold"
            >
              <BookText className="w-4 h-4 mr-2 text-blue-500" />
              Judul
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 shadow-sm"
              placeholder="Contoh: Bagaimana cara styling kemeja flanel?"
            />
          </div>

          {/* Isi Postingan Input */}
          <div className="space-y-2">
            <Label
              htmlFor="content"
              className="flex items-center text-gray-700 font-semibold"
            >
              <MessageSquareText className="w-4 h-4 mr-2 text-blue-500" />
              Isi Postingan
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-52 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 shadow-sm"
              placeholder="Jelaskan lebih detail tentang topik yang ingin kamu diskusikan..."
              rows={8}
            />
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <Label
              htmlFor="tags"
              className="flex items-center text-gray-700 font-semibold"
            >
              <Tag className="w-4 h-4 mr-2 text-blue-500" />
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 shadow-sm"
              placeholder="Pisahkan dengan koma, contoh: OOTD, Casual, Vintage"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 hover:bg-gray-100"
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
          >
            {isSaving ? "Menyimpan..." : "Publikasikan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
