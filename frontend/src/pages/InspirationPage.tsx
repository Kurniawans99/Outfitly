import React, { useState, useEffect, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { InspirationCard } from "@/components/inspiration/InspirationCard";
import { InspirationDetailV2 } from "@/components/inspiration/InspirationDetailDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react"; // Import Loader2
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { InspirationPost } from "@/services/inspiration/inspiration.types";
// --- TAMBAHKAN IMPORT INI ---
import {
  getAllInspirationPosts,
  getInspirationPostById,
} from "@/services/inspiration/inspirationService";
import { CreateInspirationDialog } from "@/components/inspiration/CreateInspirationDialog";

type SortOptions = "newest" | "popular";
interface InspirationFilters {
  sort: SortOptions;
  search: string;
}

export function InspirationPage() {
  const [posts, setPosts] = useState<InspirationPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<InspirationPost | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  // --- STATE BARU UNTUK LOADING DIALOG ---
  const [isOpeningDetail, setIsOpeningDetail] = useState(false);

  const [filters, setFilters] = useState<InspirationFilters>({
    sort: "newest",
    search: "",
  });

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      // NOTE: Data dari sini memiliki comment.author yang tidak populated. Itu tidak apa-apa.
      const data = await getAllInspirationPosts(filters);
      setPosts(data);
    } catch (error) {
      toast.error("Gagal memuat inspirasi.", {
        description: "Terjadi kesalahan saat mengambil data dari server.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(handler);
  }, [filters.search, fetchPosts]);

  useEffect(() => {
    if (!filters.search) fetchPosts();
  }, [filters.sort, fetchPosts]);

  // --- PERBAIKAN UTAMA DI FUNGSI INI ---
  const handleCardClick = async (post: InspirationPost) => {
    setIsOpeningDetail(true);
    try {
      // Panggil API untuk mendapatkan detail post yang LENGKAP
      const fullPostData = await getInspirationPostById(post._id);
      setSelectedPost(fullPostData);
      setIsDetailOpen(true);
    } catch (error) {
      toast.error("Gagal membuka detail", {
        description: "Tidak bisa mengambil data lengkap postingan.",
      });
    } finally {
      setIsOpeningDetail(false);
    }
  };

  const handlePostUpdate = (updatedPost: InspirationPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
    setSelectedPost(updatedPost);
  };

  const handlePostCreated = () => {
    if (filters.sort !== "newest") {
      setFilters((prev) => ({ ...prev, sort: "newest" }));
    } else {
      fetchPosts();
    }
  };

  return (
    <>
      {/* Tambahkan indikator loading global untuk saat membuka dialog */}
      {isOpeningDetail && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
      <PageWrapper title="Inspirasi Outfit">
        {/* ... (kode toolbar tidak berubah) ... */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center flex-wrap">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Cari inspirasi (cth: vintage, streetwear...)"
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select
              value={filters.sort}
              onValueChange={(val) => handleFilterChange("sort", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="popular">Paling Populer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CreateInspirationDialog onPostCreated={handlePostCreated} />
        </div>

        {/* ... (kode galeri tidak berubah) ... */}
        {isLoading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid-column mb-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {posts.map((post) => (
              <InspirationCard
                key={post._id}
                post={post}
                onClick={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-slate-500">
            Tidak ada inspirasi yang ditemukan.
          </p>
        )}
      </PageWrapper>

      {/* Dialog ini sekarang akan selalu menerima 'post' yang sudah fully-populated */}
      <InspirationDetailV2
        post={selectedPost}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onPostUpdate={handlePostUpdate}
      />
    </>
  );

  // Fungsi handleFilterChange perlu ada agar tidak error, Anda bisa copy dari jawaban sebelumnya.
  function handleFilterChange(type: "sort" | "search", value: string) {
    if (type === "sort") {
      setFilters((prev) => ({ ...prev, sort: value as SortOptions }));
    } else {
      setFilters((prev) => ({ ...prev, search: value }));
    }
  }
}
