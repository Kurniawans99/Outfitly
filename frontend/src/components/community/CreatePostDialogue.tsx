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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Buat Postingan Baru</DialogTitle>
          <DialogDescription>
            Ajukan pertanyaan, bagikan OOTD, atau mulai diskusi fashion baru.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Judul
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Apa topik diskusimu?"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              Isi Postingan
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
              placeholder="Jelaskan lebih detail di sini..."
              rows={6}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="col-span-3"
              placeholder="Contoh: Casual, Tanya, OOTD (pisahkan dengan koma)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-sky-600 hover:bg-sky-700"
          >
            {isSaving ? "Menyimpan..." : "Publikasikan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
