import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InspoItem } from "@/services/inspiration/inspiration.types";
import {
  getWardrobes,
  Wardrobe,
  createWardrobeItemFromUrl,
  CreateItemFromUrlPayload,
} from "@/services/wardrobeService";

interface SaveInspoItemToWardrobeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  itemToSave: InspoItem | null;
}

export const SaveInspoItemToWardrobeDialog: React.FC<
  SaveInspoItemToWardrobeDialogProps
> = ({ isOpen, onOpenChange, itemToSave }) => {
  const [wardrobes, setWardrobes] = useState<Wardrobe[]>([]);
  const [selectedWardrobeId, setSelectedWardrobeId] = useState<string>("");
  const [formData, setFormData] = useState<Partial<CreateItemFromUrlPayload>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch user's wardrobes when dialog opens
      const fetchUserWardrobes = async () => {
        try {
          const response = await getWardrobes({});
          setWardrobes(response.data);
          // Set default selected wardrobe if available
          if (response.data.length > 0) {
            setSelectedWardrobeId(response.data[0]._id);
          }
        } catch (error) {
          toast.error("Gagal memuat daftar lemari Anda.");
        }
      };

      fetchUserWardrobes();
    }
  }, [isOpen]);

  useEffect(() => {
    // Pre-fill form when itemToSave changes
    if (itemToSave) {
      setFormData({
        name: itemToSave.name,
        category: itemToSave.category,
        color: "", // User can fill this in
        tags: [],
        notes: `Disimpan dari inspirasi. Brand: ${itemToSave.brand || "N/A"}`,
        imageUrl: itemToSave.imageUrl,
      });
    }
  }, [itemToSave]);

  const handleInputChange = (
    field: keyof CreateItemFromUrlPayload,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!itemToSave || !selectedWardrobeId) {
      toast.warning("Pilih lemari tujuan terlebih dahulu.");
      return;
    }
    if (!formData.name || !formData.category) {
      toast.warning("Nama dan kategori item harus diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: CreateItemFromUrlPayload = {
        name: formData.name!,
        category: formData.category!,
        color: formData.color || "",
        tags:
          typeof formData.tags === "string"
            ? (formData.tags as string).split(",").map((t) => t.trim())
            : [],
        notes: formData.notes,
        imageUrl: itemToSave.imageUrl,
      };

      await createWardrobeItemFromUrl(selectedWardrobeId, payload);
      toast.success(`"${payload.name}" berhasil disimpan ke lemari!`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal menyimpan item ke lemari.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!itemToSave) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Simpan Item ke Wardrobe</DialogTitle>
          <DialogDescription>
            Pilih lemari tujuan dan sesuaikan detail item di bawah ini sebelum
            menyimpan.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <img
              src={itemToSave.imageUrl}
              alt={itemToSave.name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="col-span-2 space-y-4">
            <div>
              <Label htmlFor="wardrobe-select">Simpan ke Lemari</Label>
              <Select
                value={selectedWardrobeId}
                onValueChange={setSelectedWardrobeId}
              >
                <SelectTrigger id="wardrobe-select">
                  <SelectValue placeholder="Pilih lemari..." />
                </SelectTrigger>
                <SelectContent>
                  {wardrobes.length > 0 ? (
                    wardrobes.map((w) => (
                      <SelectItem key={w._id} value={w._id}>
                        {w.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      Anda belum punya lemari.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="item-name">Nama Item</Label>
              <Input
                id="item-name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="item-category">Kategori</Label>
              <Input
                id="item-category"
                value={formData.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="item-notes">Catatan</Label>
              <Textarea
                id="item-notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>
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
            disabled={isSaving || !selectedWardrobeId}
            className="bg-sky-600 hover:bg-sky-700"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan ke Wardrobe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
