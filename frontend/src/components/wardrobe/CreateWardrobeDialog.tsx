// frontend/src/components/wardrobe/CreateWardrobeDialog.tsx (ENHANCED UI)

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
import { Loader2, Folder, Sparkles, Lightbulb } from "lucide-react";

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

  const wardrobeExamples = [
    {
      name: "Pakaian Kerja",
      description: "Koleksi outfit formal untuk aktivitas profesional",
    },
    {
      name: "Casual Weekend",
      description: "Pakaian santai untuk akhir pekan dan liburan",
    },
    {
      name: "Musim Panas",
      description: "Pakaian ringan dan segar untuk cuaca panas",
    },
    {
      name: "Evening Wear",
      description: "Koleksi pakaian malam dan acara formal",
    },
  ];

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Nama lemari tidak boleh kosong.");
      return;
    }
    setIsSaving(true);
    try {
      await createWardrobe({ name, description });
      toast.success(`Lemari "${name}" berhasil dibuat!`);
      onSuccess();
      onOpenChange(false);
      setName("");
      setDescription("");
    } catch (error) {
      toast.error("Gagal membuat lemari.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExampleClick = (example: (typeof wardrobeExamples)[0]) => {
    setName(example.name);
    setDescription(example.description);
  };

  const handleClose = () => {
    if (!isSaving) {
      onOpenChange(false);
      // Reset form when closing
      setTimeout(() => {
        setName("");
        setDescription("");
      }, 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-blue-200/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
              <Folder className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Buat Lemari Baru
          </DialogTitle>
          <DialogDescription className="text-slate-600 leading-relaxed">
            Buat koleksi baru untuk mengorganisir pakaian Anda. Pilih nama yang
            mudah diingat dan deskripsi yang jelas untuk memudahkan pencarian.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label
              htmlFor="wardrobe-name"
              className="text-sm font-semibold text-slate-700"
            >
              Nama Lemari <span className="text-red-500">*</span>
            </Label>
            <Input
              id="wardrobe-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Pakaian Kerja"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
              maxLength={50}
            />
            <div className="text-xs text-slate-500 text-right">
              {name.length}/50 karakter
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="wardrobe-description"
              className="text-sm font-semibold text-slate-700"
            >
              Deskripsi (Opsional)
            </Label>
            <Textarea
              id="wardrobe-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Semua outfit untuk ke kantor dan meeting"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 min-h-[100px] resize-none"
              maxLength={200}
            />
            <div className="text-xs text-slate-500 text-right">
              {description.length}/200 karakter
            </div>
          </div>

          {/* Example Section */}
          <div className="bg-gradient-to-r from-blue-50/50 to-slate-50/50 rounded-xl p-4 border border-blue-100/50">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-700">
                Inspirasi Nama Lemari
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {wardrobeExamples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-2 bg-white/70 hover:bg-white/90 rounded-lg border border-blue-100/50 hover:border-blue-200/50 transition-all duration-200 group"
                  disabled={isSaving}
                >
                  <div className="text-xs font-medium text-slate-700 group-hover:text-blue-700">
                    {example.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {example.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 border-slate-200 hover:bg-slate-50 transition-all duration-200"
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:hover:shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Buat Lemari
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
