// src/pages/CommunityPage.tsx (Enhanced Visual Design)

import { useState, useEffect, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Filter } from "lucide-react";
import { PostItem } from "@/components/community/PostItem";
import { CreatePostDialog } from "@/components/community/CreatePostDialogue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosts, createPost } from "@/services/community/communityService";
import { Post } from "@/services/community/community.types";

export function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      toast.error("Gagal memuat postingan komunitas.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (postData: {
    title: string;
    content: string;
    tags: string;
  }) => {
    try {
      await createPost(postData);
      toast.success("Postingan berhasil dibuat!");
      fetchPosts(); // Muat ulang data setelah berhasil
      return true; // Beri sinyal sukses ke dialog
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat postingan.");
      return false; // Beri sinyal gagal ke dialog
    }
  };

  return (
    <div className="min-h-screen ">
      <PageWrapper
        title="Komunitas Fashion"
        actions={
          <Button
            onClick={() => setCreatePostOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out border-0"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Postingan Baru
          </Button>
        }
      >
        {/* Header Section dengan Enhanced Design */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Selamat Datang di Komunitas Fashion! 👗
            </h2>
            <p className="text-gray-600">
              Bagikan gaya, dapatkan inspirasi, dan terhubung dengan fashion
              enthusiast lainnya
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-blue-100 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari postingan, topik, atau pengguna..."
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/90 shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Select defaultValue="terbaru">
                  <SelectTrigger className="w-full md:w-[200px] pl-10 border-blue-200 focus:border-blue-400 bg-white/90 shadow-sm hover:shadow-md transition-all duration-200">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
                    <SelectItem value="terbaru" className="hover:bg-blue-50">
                      🕒 Terbaru
                    </SelectItem>
                    <SelectItem value="terpopuler" className="hover:bg-blue-50">
                      🔥 Terpopuler
                    </SelectItem>
                    <SelectItem value="terdiskusi" className="hover:bg-blue-50">
                      💬 Paling Banyak Diskusi
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          {isLoading ? (
            // Enhanced Loading Skeleton
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full bg-blue-200" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-blue-200" />
                      <Skeleton className="h-3 w-24 bg-blue-100" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-3 bg-blue-200" />
                  <Skeleton className="h-20 w-full bg-blue-100" />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-20 bg-blue-200" />
                      <Skeleton className="h-4 w-16 bg-blue-200" />
                    </div>
                    <Skeleton className="h-8 w-24 bg-blue-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            // Enhanced Empty State
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusCircle className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Belum ada postingan
                </h3>
                <p className="text-gray-600 mb-6">
                  Jadilah yang pertama berbagi di komunitas fashion ini!
                </p>
                <Button
                  onClick={() => setCreatePostOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Buat Postingan Pertama
                </Button>
              </div>
            </div>
          ) : (
            // Enhanced Posts List
            <div className="space-y-6">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className="transform transition-all duration-300 hover:scale-[1.02] animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PostItem post={post} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <Button
            onClick={() => setCreatePostOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-0"
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        </div>

        <CreatePostDialog
          isOpen={isCreatePostOpen}
          onOpenChange={setCreatePostOpen}
          onPostCreated={handleCreatePost}
        />
      </PageWrapper>
    </div>
  );
}
