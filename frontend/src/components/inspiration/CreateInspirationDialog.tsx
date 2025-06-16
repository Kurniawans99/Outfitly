import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, PlusCircle, ImageUp, XCircle } from "lucide-react";
import { createInspirationPost } from "@/services/inspiration/inspirationService";

// Tipe untuk state item dinamis
interface DynamicItemState {
  id: number; // ID unik sementara untuk rendering
  name: string;
  category: string;
  brand: string;
  imageFile: File | null;
  imagePreview: string | null;
}

// Komponen untuk satu form item dinamis
const DynamicItemForm = ({
  item,
  onUpdate,
  onRemove,
}: {
  item: DynamicItemState;
  onUpdate: Function;
  onRemove: Function;
}) => {
  return (
    <div className="p-4 border rounded-lg space-y-3 relative bg-slate-50">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7"
        onClick={() => onRemove(item.id)}
      >
        <XCircle className="h-5 w-5 text-red-500" />
      </Button>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`item-name-${item.id}`}>Nama Item</Label>
          <Input
            id={`item-name-${item.id}`}
            value={item.name}
            onChange={(e) => onUpdate(item.id, "name", e.target.value)}
            placeholder="cth: Kemeja Flanel"
          />
        </div>
        <div>
          <Label htmlFor={`item-category-${item.id}`}>Kategori</Label>
          <Input
            id={`item-category-${item.id}`}
            value={item.category}
            onChange={(e) => onUpdate(item.id, "category", e.target.value)}
            placeholder="cth: Atasan"
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`item-brand-${item.id}`}>Brand (Opsional)</Label>
        <Input
          id={`item-brand-${item.id}`}
          value={item.brand}
          onChange={(e) => onUpdate(item.id, "brand", e.target.value)}
          placeholder="cth: Uniqlo"
        />
      </div>
      <div>
        <Label htmlFor={`item-image-${item.id}`}>Foto Item</Label>
        {item.imagePreview && (
          <img
            src={item.imagePreview}
            className="h-20 w-20 object-cover rounded-md my-2"
          />
        )}
        <Input
          id={`item-image-${item.id}`}
          type="file"
          accept="image/*"
          onChange={(e) => onUpdate(item.id, "imageFile", e.target.files?.[0])}
        />
      </div>
    </div>
  );
};

export function CreateInspirationDialog({
  onPostCreated,
}: {
  onPostCreated: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [dynamicItems, setDynamicItems] = useState<DynamicItemState[]>([]);

  const handleAddItem = () => {
    setDynamicItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        category: "",
        brand: "",
        imageFile: null,
        imagePreview: null,
      },
    ]);
  };

  const handleRemoveItem = (id: number) => {
    setDynamicItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemUpdate = (
    id: number,
    field: keyof DynamicItemState,
    value: any
  ) => {
    setDynamicItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === "imageFile") {
            return {
              ...item,
              imageFile: value,
              imagePreview: URL.createObjectURL(value),
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSubmit = async () => {
    if (!mainImageFile || !caption) {
      toast.warning("Gambar utama dan caption wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("mainImage", mainImageFile);
    formData.append("caption", caption);
    formData.append("tags", tags);

    const itemDetails = dynamicItems.map(({ name, category, brand }) => ({
      name,
      category,
      brand,
    }));
    formData.append("items", JSON.stringify(itemDetails));
    dynamicItems.forEach((item) => {
      if (item.imageFile) formData.append("itemImages", item.imageFile);
    });

    try {
      await createInspirationPost(formData);
      toast.success("Inspirasi berhasil diunggah!");
      onPostCreated();
      setIsOpen(false);
    } catch (error) {
      toast.error("Gagal mengunggah inspirasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-600 hover:bg-sky-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Upload Inspirasi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95%]">
        <DialogHeader>
          <DialogTitle>Buat Postingan Inspirasi Baru</DialogTitle>
          <DialogDescription>
            Bagikan gayamu kepada komunitas. Unggah foto utama, lalu tambahkan
            detail item yang kamu gunakan.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 pr-6">
            {/* Kolom Kiri: Info Utama */}
            <div className="space-y-4">
              <div>
                <Label>Foto Outfit Utama</Label>
                <div className="w-full h-80 border-2 border-dashed rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden">
                  {mainImagePreview ? (
                    <img
                      src={mainImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-500">
                      <ImageUp className="mx-auto h-12 w-12" />
                      <p>Pilih gambar utama</p>
                    </div>
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMainImageFile(file);
                      setMainImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            {/* Kolom Kanan: Item Dinamis */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Item dalam Outfit</Label>
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Tambah Item
                </Button>
              </div>
              <div className="space-y-4 max-h-[50vh] pr-1">
                {dynamicItems.map((item) => (
                  <DynamicItemForm
                    key={item.id}
                    item={item}
                    onUpdate={handleItemUpdate}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-sky-600 hover:bg-sky-700"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Unggah
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
