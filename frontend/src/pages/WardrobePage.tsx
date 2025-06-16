// frontend/src/pages/WardrobePage.tsx (REFACTORED)

import React, { useState, useEffect, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Folder, FolderSymlink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getWardrobes, Wardrobe } from "@/services/wardrobeService"; // Assume these exist
import { Skeleton } from "@/components/ui/skeleton";
import { CreateWardrobeDialog } from "@/components/wardrobe/CreateWardrobeDialog";
import { WardrobeListCard } from "@/components/wardrobe/WardrobeListCard";

export default function WardrobePage() {
  const [wardrobes, setWardrobes] = useState<Wardrobe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);

  const fetchWardrobes = useCallback(async () => {
    setIsLoading(true);
    try {
      // Assume a search parameter can be passed
      const response = await getWardrobes({ search: searchTerm });
      setWardrobes(response.data);
    } catch (error) {
      toast.error("Gagal memuat daftar lemari.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Debounce search
    const handler = setTimeout(() => {
      fetchWardrobes();
    }, 300);
    return () => clearTimeout(handler);
  }, [fetchWardrobes]);

  return (
    <>
      <PageWrapper
        title="Lemari Pakaian Saya"
        actions={
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Lemari Baru
          </Button>
        }
      >
        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              placeholder="Cari nama lemari..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-[240px] w-full" />
              </div>
            ))}
          </div>
        ) : wardrobes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wardrobes.map((wardrobe) => (
              <WardrobeListCard key={wardrobe._id} wardrobe={wardrobe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 border-2 border-dashed rounded-lg">
            <FolderSymlink className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-xl font-semibold">Belum Ada Lemari</h3>
            <p>
              Mulai dengan membuat lemari pertama Anda untuk koleksi pakaian.
            </p>
            <Button
              className="mt-4 bg-sky-600 hover:bg-sky-700"
              onClick={() => setCreateOpen(true)}
            >
              Buat Lemari Baru
            </Button>
          </div>
        )}
      </PageWrapper>
      <CreateWardrobeDialog
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchWardrobes}
      />
    </>
  );
}
