// frontend/src/pages/WardrobePage.tsx (ENHANCED UI)

import React, { useState, useEffect, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Search,
  Folder,
  FolderSymlink,
  Sparkles,
  Grid3X3,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getWardrobes, Wardrobe } from "@/services/wardrobeService";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateWardrobeDialog } from "@/components/wardrobe/CreateWardrobeDialog";
import { WardrobeListCard } from "@/components/wardrobe/WardrobeListCard";

export default function WardrobePage() {
  const [wardrobes, setWardrobes] = useState<Wardrobe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchWardrobes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getWardrobes({ search: searchTerm });
      setWardrobes(response.data);
    } catch (error) {
      toast.error("Gagal memuat daftar lemari.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchWardrobes();
    }, 300);
    return () => clearTimeout(handler);
  }, [fetchWardrobes]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
        <PageWrapper
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Lemari Pakaian Saya
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Kelola koleksi fashion Anda dengan mudah
                </p>
              </div>
            </div>
          }
          actions={
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Lemari Baru
            </Button>
          }
        >
          {/* Enhanced Search and Controls Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-blue-100/50">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                <Input
                  type="search"
                  placeholder="Cari nama lemari atau deskripsi..."
                  className="pl-12 pr-4 py-3 w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-blue-100">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  } transition-all duration-200`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`${
                    viewMode === "list"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  } transition-all duration-200`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats Section */}
            {!isLoading && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-100/50">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>
                    {wardrobes.length} lemari ditemukan
                    {searchTerm && ` untuk "${searchTerm}"`}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Total:{" "}
                  {wardrobes.reduce((acc, w) => acc + (w.itemCount || 0), 0)}{" "}
                  item pakaian
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1"
              } gap-6`}
            >
              {Array.from({ length: viewMode === "grid" ? 8 : 4 }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100/50"
                  >
                    <Skeleton
                      className={`${
                        viewMode === "grid" ? "h-[240px]" : "h-[120px]"
                      } w-full rounded-xl mb-4`}
                    />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                )
              )}
            </div>
          ) : wardrobes.length > 0 ? (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1"
              } gap-6 animate-in fade-in-0 duration-500`}
            >
              {wardrobes.map((wardrobe, index) => (
                <div
                  key={wardrobe._id}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <WardrobeListCard wardrobe={wardrobe} viewMode={viewMode} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-sm border border-blue-100/50 max-w-md mx-auto">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto">
                    <FolderSymlink className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <PlusCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {searchTerm ? "Tidak Ada Hasil" : "Belum Ada Lemari"}
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  {searchTerm
                    ? `Tidak ditemukan lemari dengan kata kunci "${searchTerm}". Coba kata kunci lain.`
                    : "Mulai dengan membuat lemari pertama Anda untuk koleksi pakaian yang terorganisir dengan baik."}
                </p>

                {!searchTerm && (
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => setCreateOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Buat Lemari Pertama
                  </Button>
                )}
              </div>
            </div>
          )}
        </PageWrapper>
      </div>

      <CreateWardrobeDialog
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchWardrobes}
      />
    </>
  );
}
