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
import {
  Search,
  Loader2,
  Filter,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { InspirationPost } from "@/services/inspiration/inspiration.types";
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
  const [isOpeningDetail, setIsOpeningDetail] = useState(false);

  const [filters, setFilters] = useState<InspirationFilters>({
    sort: "newest",
    search: "",
  });

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
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

  const handleCardClick = async (post: InspirationPost) => {
    setIsOpeningDetail(true);
    try {
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

  function handleFilterChange(type: "sort" | "search", value: string) {
    if (type === "sort") {
      setFilters((prev) => ({ ...prev, sort: value as SortOptions }));
    } else {
      setFilters((prev) => ({ ...prev, search: value }));
    }
  }

  return (
    <>
      {/* Enhanced Loading Overlay */}
      {isOpeningDetail && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/20 via-slate-900/50 to-slate-900/80 z-[9999] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <div className="absolute inset-0 h-8 w-8 border-2 border-blue-200 rounded-full animate-pulse" />
            </div>
            <p className="text-slate-600 font-medium">Memuat detail...</p>
          </div>
        </div>
      )}

      <PageWrapper title="Inspirasi Outfit">
        {/* Enhanced Hero Section */}
        <div className="mb-8 relative overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                  Temukan Inspirasi Fashion Terbaru
                </h2>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed">
                Jelajahi koleksi outfit terkurasi dari fashion creator terbaik
                dan temukan gaya yang sempurna untuk Anda
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-sky-200/30 rounded-full blur-xl" />
            <div className="absolute bottom-4 right-12 w-12 h-12 bg-gradient-to-br from-sky-200/40 to-blue-200/40 rounded-full blur-lg" />
          </div>
        </div>

        {/* Enhanced Filter & Search Bar */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-grow w-full lg:w-auto">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Search className="h-5 w-5 text-slate-400" />
                  <div className="h-4 w-px bg-slate-200" />
                </div>
                <Input
                  placeholder="Cari inspirasi outfit (vintage, streetwear, formal...)"
                  className="pl-12 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-slate-700 placeholder:text-slate-500"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2 text-slate-600">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Urutkan:</span>
                </div>
                <Select
                  value={filters.sort}
                  onValueChange={(val) => handleFilterChange("sort", val)}
                >
                  <SelectTrigger className="w-full lg:w-48 bg-slate-50 border-slate-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                    <SelectValue placeholder="Pilih urutan" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem value="newest" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Terbaru</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="popular" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-red-600" />
                        <span>Paling Populer</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Create Button */}
              <CreateInspirationDialog onPostCreated={handlePostCreated} />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500 font-medium">
                Filter cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                {["Casual", "Formal", "Streetwear", "Vintage"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      handleFilterChange("search", tag.toLowerCase())
                    }
                    className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-xs rounded-full border border-slate-200 hover:border-blue-200 transition-all duration-200 font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Gallery */}
        {isLoading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="break-inside-avoid-column mb-6">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <Skeleton className="h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4 bg-slate-100" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full bg-slate-100" />
                      <Skeleton className="h-6 w-20 rounded-full bg-slate-100" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full bg-slate-100" />
                        <Skeleton className="h-3 w-16 bg-slate-100" />
                      </div>
                      <div className="flex gap-3">
                        <Skeleton className="h-3 w-8 bg-slate-100" />
                        <Skeleton className="h-3 w-8 bg-slate-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            {/* Results count */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <p className="text-slate-600 font-medium">
                  {posts.length} inspirasi ditemukan
                  {filters.search && (
                    <span className="text-blue-600 ml-1">
                      untuk "{filters.search}"
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Enhanced Masonry Grid */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <InspirationCard post={post} onClick={handleCardClick} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Tidak ada inspirasi ditemukan
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau hapus filter untuk melihat
                lebih banyak inspirasi outfit
              </p>
            </div>
            {filters.search && (
              <button
                onClick={() => handleFilterChange("search", "")}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
              >
                Hapus Pencarian
              </button>
            )}
          </div>
        )}
      </PageWrapper>

      <InspirationDetailV2
        post={selectedPost}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onPostUpdate={handlePostUpdate}
      />
    </>
  );
}
