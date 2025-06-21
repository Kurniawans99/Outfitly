import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, ImageIcon } from "lucide-react";
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
      <DialogContent className="min-w-4xl p-0 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 shadow-2xl">
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[700px]">
            {/* Enhanced Image Upload Section */}
            <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white md:rounded-l-xl border-r border-blue-100">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              <div className="w-full max-w-sm">
                <div
                  className="w-full h-80 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center text-center text-slate-500 cursor-pointer hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-100 hover:to-white transition-all duration-300 shadow-sm hover:shadow-lg group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full overflow-hidden rounded-xl">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                        <UploadCloud className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-black text-lg">
                          Klik untuk mengunggah gambar
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          PNG, JPG, atau WEBP (Maks 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 w-full bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-black font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? "Ganti Gambar" : "Pilih Gambar"}
                </Button>
              </div>
            </div>

            {/* Enhanced Form Section */}
            <div className="p-8 flex flex-col space-y-6 bg-white">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  {itemToEdit ? "Edit Pakaian" : "Tambah Pakaian Baru"}
                </DialogTitle>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mt-2" />
              </DialogHeader>

              <div className="space-y-5 flex-grow">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="font-bold text-black text-sm uppercase tracking-wide"
                  >
                    Nama Pakaian
                  </Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl py-3 text-base shadow-sm"
                    placeholder="Masukkan nama pakaian..."
                    required
                  />
                </div>

                {/* Category and Color Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="font-bold text-black text-sm uppercase tracking-wide"
                    >
                      Kategori
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        setFormData((p) => ({ ...p, category: val }))
                      }
                      required
                    >
                      <SelectTrigger
                        id="category"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl py-3 text-base shadow-sm"
                      >
                        <SelectValue placeholder="Pilih kategori..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-blue-200">
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat}
                            value={cat}
                            className="text-base"
                          >
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="color"
                      className="font-bold text-black text-sm uppercase tracking-wide"
                    >
                      Warna
                    </Label>
                    <Input
                      id="color"
                      value={formData.color || ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, color: e.target.value }))
                      }
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl py-3 text-base shadow-sm"
                      placeholder="Contoh: Merah, Biru..."
                    />
                  </div>
                </div>

                {/* Tags Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="tags"
                    className="font-bold text-black text-sm uppercase tracking-wide"
                  >
                    Tags
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Pisahkan setiap tag dengan koma (contoh: casual, formal,
                    musim panas)
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
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl py-3 text-base shadow-sm"
                    placeholder="Masukkan tags..."
                  />
                </div>

                {/* Notes Textarea */}
                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="font-bold text-black text-sm uppercase tracking-wide"
                  >
                    Catatan
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, notes: e.target.value }))
                    }
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base shadow-sm min-h-[100px] resize-none"
                    placeholder="Tambahkan catatan tentang pakaian ini..."
                  />
                </div>
              </div>

              <DialogFooter className="pt-6 border-t border-blue-100 gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  disabled={isSaving}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 min-w-[120px]"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Menyimpan...</span>
                    </div>
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
