// frontend/src/pages/WardrobeDetailPage.tsx (NEW FILE)

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Search,
  ListFilter,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  getWardrobeItems,
  deleteWardrobeItem,
  getWardrobeCategories,
  ClothingItem,
} from "@/services/wardrobeService";
import { Skeleton } from "@/components/ui/skeleton";
import { ClothingFormDialog } from "@/components/wardrobe/ClothingFormDialog";
import { ClothingDetailDialog } from "@/components/wardrobe/ClothingDetailDialog";
import { ImageViewer } from "@/components/wardrobe/ImageViewer";
import { ClothingItemCard } from "@/components/wardrobe/ClothingItemCard";
import { DeleteConfirmationDialog } from "@/components/wardrobe/DeleteConfirmationDialogue";

export default function WardrobeDetailPage() {
  const { wardrobeId } = useParams<{ wardrobeId: string }>();
  const navigate = useNavigate();

  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ClothingItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ClothingItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [detailItem, setDetailItem] = useState<ClothingItem | null>(null);
  const [isImageViewerOpen, setImageViewerOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!wardrobeId) return;
    setIsLoading(true);
    try {
      const response = await getWardrobeItems(wardrobeId, {
        search: searchTerm,
      });
      setItems(response.data);
    } catch (error) {
      toast.error("Gagal memuat data pakaian.");
    } finally {
      setIsLoading(false);
    }
  }, [wardrobeId, searchTerm]);

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

  const handleDelete = (item: ClothingItem) => {
    setItemToDelete(item);
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

  if (!wardrobeId) {
    navigate("/dashboard/wardrobe");
    return null;
  }

  return (
    <>
      <PageWrapper
        title="Detail Lemari" // Title can be dynamic with wardrobe name
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/wardrobe")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button
              onClick={handleAddNew}
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Pakaian
            </Button>
          </div>
        }
      >
        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              placeholder="Cari pakaian di lemari ini..."
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
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-[280px] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item) => (
              <ClothingItemCard
                key={item._id}
                item={item}
                onClick={() => setDetailItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 border-2 border-dashed rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-xl font-semibold">Lemari Ini Kosong</h3>
            <p>Mulai dengan menambahkan pakaian pertama Anda ke koleksi ini.</p>
            <Button
              className="mt-4 bg-sky-600 hover:bg-sky-700"
              onClick={handleAddNew}
            >
              Tambah Pakaian
            </Button>
          </div>
        )}
      </PageWrapper>

      <ClothingFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        itemToEdit={itemToEdit}
        onSaveSuccess={() => fetchItems()}
        categories={categories}
        wardrobeId={wardrobeId}
      />

      <ClothingDetailDialog
        isOpen={!!detailItem}
        onOpenChange={(isOpen) => !isOpen && setDetailItem(null)}
        item={detailItem}
        onEdit={(item) => {
          setDetailItem(null);
          handleEdit(item);
        }}
        onDelete={(item) => {
          setDetailItem(null);
          handleDelete(item);
        }}
        onImageClick={() => setImageViewerOpen(true)}
      />

      <DeleteConfirmationDialog
        isOpen={!!itemToDelete}
        item={itemToDelete}
        onOpenChange={() => setItemToDelete(null)}
        onConfirm={() => {
          confirmDelete();
          setItemToDelete(null);
        }}
      />

      <ImageViewer
        isOpen={isImageViewerOpen}
        onOpenChange={setImageViewerOpen}
        imageUrl={detailItem?.imageUrl || ""}
      />
    </>
  );
}
