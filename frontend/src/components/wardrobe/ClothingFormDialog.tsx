import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import {
  createWardrobeItem,
  updateWardrobeItem,
} from "@/services/wardrobeService";
import { ClothingItem } from "@/services/wardrobeService";

export const ClothingFormDialog = ({
  isOpen,
  onOpenChange,
  itemToEdit,
  onSaveSuccess,
  categories,
  wardrobeId,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit: ClothingItem | null;
  onSaveSuccess: () => void;
  categories: string[];
  wardrobeId: string;
}) => {
  const [formData, setFormData] = useState<Partial<ClothingItem>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const initialData = itemToEdit || {
        name: "",
        category: "",
        color: "",
        tags: [],
        notes: "",
      };
      setFormData(initialData);
      setPreviewUrl(itemToEdit?.imageUrl || null);
      setSelectedFile(null);
    }
  }, [itemToEdit, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error("Nama Pakaian dan Kategori wajib diisi.");
      return;
    }
    if (!itemToEdit && !selectedFile) {
      toast.error("Gambar wajib diunggah untuk item baru.");
      return;
    }

    setIsSaving(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "tags" && Array.isArray(value))
        data.append(key, value.join(","));
      else if (value !== undefined && value !== null)
        data.append(key, value as string);
    });
    if (selectedFile) data.append("image", selectedFile);

    try {
      if (itemToEdit?._id) {
        await updateWardrobeItem(itemToEdit._id, data);
      } else {
        await createWardrobeItem(wardrobeId, data);
      }
      toast.success(
        itemToEdit
          ? "Pakaian berhasil diperbarui!"
          : "Pakaian baru berhasil ditambahkan!"
      );
      onSaveSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan pakaian.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl p-0">
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Kolom Kiri: Pratinjau Gambar */}
            <div className="p-8 flex flex-col items-center justify-center bg-slate-50 md:rounded-l-lg">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div
                className="w-full h-80 border-2 border-dashed rounded-xl flex items-center justify-center text-center text-slate-500 cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg p-2"
                  />
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="mx-auto h-12 w-12" />
                    <p className="font-semibold">
                      Klik untuk mengunggah gambar
                    </p>
                    <p className="text-xs">PNG, JPG, atau WEBP (Maks 5MB)</p>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? "Ganti Gambar" : "Pilih Gambar"}
              </Button>
            </div>

            {/* Kolom Kanan: Form Input */}
            <div className="p-8 flex flex-col space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {itemToEdit ? "Edit Pakaian" : "Tambah Pakaian Baru"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 flex-grow">
                <div>
                  <Label htmlFor="name" className="font-semibold">
                    Nama Pakaian
                  </Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="mt-1"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="font-semibold">
                      Kategori
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        setFormData((p) => ({ ...p, category: val }))
                      }
                      required
                    >
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color" className="font-semibold">
                      Warna
                    </Label>
                    <Input
                      id="color"
                      value={formData.color || ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, color: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags" className="font-semibold">
                    Tags
                  </Label>
                  <p className="text-xs text-slate-500 mb-1">
                    Pisahkan setiap tag dengan koma.
                  </p>
                  <Input
                    id="tags"
                    value={
                      Array.isArray(formData.tags)
                        ? formData.tags.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        tags: e.target.value.split(",").map((t) => t.trim()),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="font-semibold">
                    Catatan
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, notes: e.target.value }))
                    }
                    className="mt-1 min-h-[120px]"
                  />
                </div>
              </div>
              <DialogFooter className="pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  disabled={isSaving}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white w-32"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
