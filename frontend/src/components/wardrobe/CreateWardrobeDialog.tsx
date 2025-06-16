// frontend/src/components/wardrobe/CreateWardrobeDialog.tsx (NEW FILE)

import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createWardrobe } from "@/services/wardrobeService";
import { Loader2 } from "lucide-react";

interface CreateWardrobeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export const CreateWardrobeDialog: React.FC<CreateWardrobeDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Nama lemari tidak boleh kosong.");
      return;
    }
    setIsSaving(true);
    try {
      await createWardrobe({ name, description });
      toast.success(`Lemari "${name}" berhasil dibuat!`);
      onSuccess(); // Refresh the list on the parent page
      onOpenChange(false); // Close the dialog
      setName("");
      setDescription("");
    } catch (error) {
      toast.error("Gagal membuat lemari.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Lemari Baru</DialogTitle>
          <DialogDescription>
            Buat koleksi baru untuk mengorganisir pakaian Anda. Misalnya:
            "Pakaian Kerja" atau "Baju Musim Panas".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="wardrobe-name">Nama Lemari</Label>
            <Input
              id="wardrobe-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Pakaian Kerja"
            />
          </div>
          <div>
            <Label htmlFor="wardrobe-description">Deskripsi (Opsional)</Label>
            <Textarea
              id="wardrobe-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Semua outfit untuk ke kantor"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-sky-600 hover:bg-sky-700"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
