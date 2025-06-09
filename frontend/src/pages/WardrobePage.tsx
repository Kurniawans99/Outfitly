import React, { useState, useEffect, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ListFilter,
  Image as ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  getWardrobeItems,
  createWardrobeItem,
  updateWardrobeItem,
  deleteWardrobeItem,
  getWardrobeCategories,
} from "@/services/wardrobeService";
import { Skeleton } from "@/components/ui/skeleton";

type ClothingItem = {
  _id: string;
  name: string;
  category: string;
  color: string;
  imageUrl: string;
  tags: string[];
  notes?: string;
};

const ClothingItemCard = ({
  item,
  onEdit,
  onDelete,
}: {
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
  onDelete: (item: ClothingItem) => void;
}) => (
  <Card className="overflow-hidden group transition-all hover:shadow-lg">
    <CardHeader className="p-0">
      <AspectRatio ratio={4 / 5}>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </AspectRatio>
    </CardHeader>
    <CardContent className="p-4">
      <h3 className="font-semibold text-lg truncate text-slate-800">
        {item.name}
      </h3>
      <p className="text-sm text-slate-500">{item.category}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="outline">{item.color}</Badge>
        {item.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onEdit(item)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => onDelete(item)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardFooter>
  </Card>
);

const ClothingFormDialog = ({
  isOpen,
  onOpenChange,
  itemToEdit,
  onSaveSuccess,
  categories,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit: ClothingItem | null;
  onSaveSuccess: () => void;
  categories: string[];
}) => {
  const [formData, setFormData] = useState<Partial<ClothingItem>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(
        itemToEdit || {
          name: "",
          category: categories[0] || "",
          color: "",
          tags: [],
          notes: "",
        }
      );
      setSelectedFile(null);
    }
  }, [itemToEdit, isOpen, categories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const data = new FormData();
    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "tags" && Array.isArray(value)) {
        data.append(key, value.join(","));
      } else if (value !== undefined && value !== null) {
        data.append(key, value as string);
      }
    });

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      if (itemToEdit?._id) {
        await updateWardrobeItem(itemToEdit._id, data);
        toast.success("Pakaian berhasil diperbarui!");
      } else {
        await createWardrobeItem(data);
        toast.success("Pakaian baru berhasil ditambahkan!");
      }
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
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>
              {itemToEdit ? "Edit Pakaian" : "Tambah Pakaian Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Pakaian</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">
                Gambar Pakaian {itemToEdit ? "(Opsional)" : ""}
              </Label>
              <Input
                id="image"
                type="file"
                onChange={handleFileChange}
                required={!itemToEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori..." />
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
            <div className="space-y-2">
              <Label htmlFor="color">Warna</Label>
              <Input
                id="color"
                value={formData.color || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
              <Input
                id="tags"
                value={
                  Array.isArray(formData.tags) ? formData.tags.join(", ") : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e.target.value.split(",").map((t) => t.trim()),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function WardrobePage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ClothingItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ClothingItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getWardrobeItems({ search: searchTerm });
      setItems(response.data);
    } catch (error) {
      toast.error("Gagal memuat data pakaian.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getWardrobeCategories();
        setCategories(response.data);
      } catch (error) {
        toast.error("Gagal memuat kategori pakaian.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(handler);
  }, [fetchItems]);

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: ClothingItem) => {
    setItemToEdit(item);
    setIsFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteWardrobeItem(itemToDelete._id);
      toast.success(`"${itemToDelete.name}" berhasil dihapus.`);
      fetchItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menghapus item.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <PageWrapper
      title="Manajemen Pakaian"
      actions={
        <Button
          onClick={handleAddNew}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pakaian
        </Button>
      }
    >
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            placeholder="Cari pakaian..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <ListFilter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((item) => (
            <ClothingItemCard
              key={item._id}
              item={item}
              onEdit={handleEdit}
              onDelete={setItemToDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 border-2 border-dashed rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-xl font-semibold">Lemari Pakaian Kosong</h3>
          <p>Mulai dengan menambahkan pakaian pertama Anda.</p>
          <Button
            className="mt-4 bg-sky-600 hover:bg-sky-700"
            onClick={handleAddNew}
          >
            Tambah Pakaian
          </Button>
        </div>
      )}

      <ClothingFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        itemToEdit={itemToEdit}
        onSaveSuccess={fetchItems}
        categories={categories}
      />

      {itemToDelete && (
        <AlertDialog
          open={!!itemToDelete}
          onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan menghapus{" "}
                <span className="font-bold">"{itemToDelete.name}"</span> secara
                permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setItemToDelete(null)}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Ya, Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </PageWrapper>
  );
}
