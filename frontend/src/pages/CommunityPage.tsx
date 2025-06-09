// src/pages/CommunityPage.tsx (Updated)

import { useState, useEffect, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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
    <PageWrapper
      title="Komunitas Fashion"
      actions={
        <Button
          onClick={() => setCreatePostOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Postingan Baru
        </Button>
      }
    >
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Input placeholder="Cari postingan..." className="flex-grow" />
        <Select defaultValue="terbaru">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="terbaru">Terbaru</SelectItem>
            <SelectItem value="terpopuler">Terpopuler</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          // Loading Skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))
        ) : posts.length === 0 ? (
          <p className="text-center text-slate-500 py-10">
            Belum ada postingan. Jadilah yang pertama!
          </p>
        ) : (
          posts.map((post) => <PostItem key={post._id} post={post} />)
        )}
      </div>

      <CreatePostDialog
        isOpen={isCreatePostOpen}
        onOpenChange={setCreatePostOpen}
        onPostCreated={handleCreatePost}
      />
    </PageWrapper>
  );
}
