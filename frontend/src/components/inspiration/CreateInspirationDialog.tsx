import { useState, useEffect } from "react";
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
import {
  Loader2,
  PlusCircle,
  ImageUp,
  XCircle,
  Sparkles,
  Tag,
  Camera,
} from "lucide-react";
import { createInspirationPost } from "@/services/inspiration/inspirationService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWardrobeCategories } from "@/services/wardrobeService";

interface DynamicItemState {
  id: number;
  name: string;
  category: string;
  brand: string;
  imageFile: File | null;
  imagePreview: string | null;
}

const DynamicItemForm = ({
  item,
  onUpdate,
  onRemove,
  categories,
}: {
  item: DynamicItemState;
  onUpdate: Function;
  onRemove: Function;
  categories: string[];
}) => {
  const handleCategoryChange = (value: string) => {
    onUpdate(item.id, "category", value);
  };

  return (
    <div className="relative group">
      <div className="p-6 border-2 border-blue-100 rounded-xl space-y-4 bg-gradient-to-br from-white to-blue-50/30 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-8 w-8 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-200"
          onClick={() => onRemove(item.id)}
        >
          <XCircle className="h-4 w-4 text-red-500" />
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor={`item-name-${item.id}`}
              className="text-gray-700 font-medium flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-blue-500" />
              Nama Item
            </Label>
            <Input
              id={`item-name-${item.id}`}
              value={item.name}
              onChange={(e) => onUpdate(item.id, "name", e.target.value)}
              placeholder="cth: Kemeja Flanel"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor={`item-category-${item.id}`}
              className="text-gray-700 font-medium flex items-center gap-2"
            >
              <Tag className="h-4 w-4 text-blue-500" />
              Kategori
            </Label>
            <Select value={item.category} onValueChange={handleCategoryChange}>
              <SelectTrigger
                id={`item-category-${item.id}`}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
              >
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="hover:bg-blue-50"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`item-brand-${item.id}`}
            className="text-gray-700 font-medium"
          >
            Brand (Opsional)
          </Label>
          <Input
            id={`item-brand-${item.id}`}
            value={item.brand}
            onChange={(e) => onUpdate(item.id, "brand", e.target.value)}
            placeholder="cth: Uniqlo"
            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`item-image-${item.id}`}
            className="text-gray-700 font-medium flex items-center gap-2"
          >
            <Camera className="h-4 w-4 text-blue-500" />
            Foto Item
          </Label>
          {item.imagePreview && (
            <div className="relative group/image">
              <img
                src={item.imagePreview}
                className="h-24 w-24 object-cover rounded-lg border-2 border-blue-200 shadow-sm"
                alt="Preview"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-200 rounded-lg"></div>
            </div>
          )}
          <Input
            id={`item-image-${item.id}`}
            type="file"
            accept="image/*"
            onChange={(e) =>
              onUpdate(item.id, "imageFile", e.target.files?.[0])
            }
            className="border-blue-200 focus:border-blue-400 file:bg-blue-50 file:text-black file:border-blue-200"
          />
        </div>
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
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await getWardrobeCategories();
          setCategories(response.data);
        } catch (error) {
          toast.error("Gagal memuat kategori pakaian.");
          console.error("Failed to fetch categories:", error);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

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

    const isValidItems = dynamicItems.every(
      (item) => item.name.trim() !== "" && item.category.trim() !== ""
    );
    if (dynamicItems.length > 0 && !isValidItems) {
      toast.warning("Nama dan kategori semua item dalam outfit wajib diisi.");
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
      setMainImageFile(null);
      setMainImagePreview(null);
      setCaption("");
      setTags("");
      setDynamicItems([]);
    } catch (error) {
      toast.error("Gagal mengunggah inspirasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="font-medium">Upload Inspirasi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[1200px] min-w-[calc(70vw-40px)]  bg-white border-blue-200">
        <DialogHeader className="pb-6 border-b border-blue-100">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            Buat Postingan Inspirasi Baru
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Bagikan gayamu kepada komunitas. Unggah foto utama, lalu tambahkan
            detail item yang kamu gunakan untuk menginspirasi orang lain.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] p-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6 pr-6">
            {/* Kolom Kiri: Info Utama */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Foto Outfit Utama
                </Label>
                <div className="relative group">
                  <div className="w-full h-80 border-3 border-dashed border-blue-200 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-50/50 to-white overflow-hidden hover:border-blue-300 transition-colors duration-300">
                    {mainImagePreview ? (
                      <>
                        <img
                          src={mainImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    ) : (
                      <div className="text-center text-blue-400 group-hover:text-blue-500 transition-colors duration-300">
                        <ImageUp className="mx-auto h-16 w-16 mb-3" />
                        <p className="text-lg font-medium">
                          Pilih gambar utama
                        </p>
                        <p className="text-sm opacity-75">
                          Drag & drop atau klik untuk upload
                        </p>
                      </div>
                    )}
                  </div>
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
                  className="border-blue-200 focus:border-blue-400 file:bg-blue-50 file:text-black file:border-blue-200 file:rounded-md"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="caption"
                  className="text-lg font-semibold text-gray-800"
                >
                  Caption
                </Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  placeholder="Ceritakan tentang outfit ini..."
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="tags"
                  className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                >
                  <Tag className="h-5 w-5 text-blue-600" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="casual, formal, streetwear..."
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
                />
                <p className="text-sm text-gray-500">
                  Pisahkan dengan koma untuk multiple tags
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Item Dinamis */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Item dalam Outfit
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Tambah Item
                </Button>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {dynamicItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Sparkles className="mx-auto h-12 w-12 mb-3 opacity-50" />
                    <p>Belum ada item yang ditambahkan</p>
                    <p className="text-sm">Klik "Tambah Item" untuk mulai</p>
                  </div>
                ) : (
                  dynamicItems.map((item) => (
                    <DynamicItemForm
                      key={item.id}
                      item={item}
                      onUpdate={handleItemUpdate}
                      onRemove={handleRemoveItem}
                      categories={categories}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-6 border-t border-blue-100 bg-gradient-to-r from-blue-50/50 to-white">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <span className="font-medium">
              {isSubmitting ? "Mengunggah..." : "Unggah Inspirasi"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
