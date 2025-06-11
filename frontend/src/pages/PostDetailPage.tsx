// src/pages/PostDetailPage.tsx (REVISED)

import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReplyItem } from "@/components/community/ReplyItem";
import { toast } from "sonner";
import {
  getPostById,
  addReply,
  togglePostLike,
  toggleReplyLike,
} from "@/services/community/communityService"; // Your services
import { Post } from "@/services/community/community.types";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Heart,
  Tag,
  Send,
  CornerDownRight,
} from "lucide-react";

export function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // --- Logic dari file Anda, tidak ada perubahan ---
  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      setIsLoading(true);
      const data = await getPostById(postId);
      setPost(data);
    } catch (error) {
      toast.error("Gagal memuat detail postingan.");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleReplySubmit = async () => {
    if (!postId || !replyContent.trim()) return;
    setIsReplying(true);
    try {
      const updatedPost = await addReply(postId, replyContent);
      setPost(updatedPost);
      setReplyContent("");
      toast.success("Balasan berhasil dikirim!");
    } catch (error) {
      toast.error("Gagal mengirim balasan.");
    } finally {
      setIsReplying(false);
    }
  };

  const handleToggleLike = async (type: "post" | "reply", id: string) => {
    if (!postId) return;
    try {
      const updatedPost =
        type === "post"
          ? await togglePostLike(postId)
          : await toggleReplyLike(postId, id);
      setPost(updatedPost);
    } catch (error) {
      toast.error("Gagal memproses permintaan.");
    }
  };
  // --- Akhir dari logic Anda ---

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return <PageWrapper title="Error">Postingan tidak ditemukan.</PageWrapper>;
  }

  const isPostLiked = post.likes.includes(localStorage.getItem("userId") || "");

  return (
    <PageWrapper
      title="Detail Diskusi"
      actions={
        <Link to="/dashboard/community">
          <Button
            variant="outline"
            className="border-blue-200 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Komunitas
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent p-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  Dibuat pada{" "}
                  {new Date(post.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl rounded-2xl">
            <CardHeader>
              <h2 className="font-bold text-lg text-blue-800 flex items-center">
                <CornerDownRight className="w-5 h-5 mr-2" /> Beri Komentar
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Tulis balasan Anda di sini..."
                rows={4}
                className="w-full min-h-40 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 shadow-sm"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleReplySubmit}
                  disabled={isReplying || !replyContent.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
                >
                  {isReplying ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Kirim Balasan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 pt-4">
            <h2 className="font-bold text-xl text-blue-900 pb-2 border-b-2 border-blue-200">
              {post.replyCount} Balasan
            </h2>
            {post.replies.length > 0 ? (
              post.replies.map((reply) => (
                <ReplyItem
                  key={reply._id}
                  reply={reply}
                  onLike={() => handleToggleLike("reply", reply._id)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Belum ada balasan. Jadilah yang pertama berkomentar!
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl rounded-2xl">
            <CardHeader className="text-center">
              <h3 className="font-bold text-lg text-blue-800">Penulis</h3>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="w-20 h-20 ring-4 ring-blue-200">
                <AvatarImage
                  src={post.author.avatar?.url}
                  alt={post.author.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                  {post.author.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="font-semibold text-xl text-gray-800">
                {post.author.name}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl rounded-2xl">
            <CardHeader>
              <h3 className="font-bold text-lg text-blue-800">Statistik</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-2">
                  <Heart
                    className={`w-5 h-5 ${
                      isPostLiked ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <span>Suka</span>
                </div>
                <span className="font-bold">{post.likeCount}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span>Balasan</span>
                </div>
                <span className="font-bold">{post.replyCount}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2"
                onClick={() => handleToggleLike("post", post._id)}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    isPostLiked ? "text-red-500 fill-current" : ""
                  }`}
                />
                {isPostLiked ? "Batal Suka" : "Sukai Postingan Ini"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl rounded-2xl">
            <CardHeader>
              <h3 className="font-bold text-lg text-blue-800 flex items-center">
                <Tag className="w-5 h-5 mr-2" /> Tags
              </h3>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 text-sm px-3 py-1 shadow-sm"
                >
                  #{tag}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

const PostDetailSkeleton = () => (
  <PageWrapper
    title=" "
    actions={<Skeleton className="h-10 w-40 bg-blue-100" />}
  >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-white/80 rounded-2xl shadow-lg p-6">
          <Skeleton className="h-8 w-3/4 mb-4 bg-blue-200" />
          <Skeleton className="h-4 w-1/2 mb-6 bg-blue-100" />
          <Skeleton className="h-4 w-full mt-4 bg-blue-100" />
          <Skeleton className="h-4 w-full mt-2 bg-blue-100" />
          <Skeleton className="h-4 w-10/12 mt-2 bg-blue-100" />
        </Card>
        <Card className="bg-white/80 rounded-2xl shadow-lg p-6">
          <Skeleton className="h-24 w-full bg-blue-100" />
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <Skeleton className="h-20 w-20 rounded-full mb-4 bg-blue-200" />
          <Skeleton className="h-6 w-32 mb-4 bg-blue-200" />
        </Card>
        <Card className="bg-white/80 rounded-2xl shadow-lg p-6">
          <Skeleton className="h-6 w-1/3 mb-4 bg-blue-200" />
          <Skeleton className="h-4 w-full mb-3 bg-blue-100" />
          <Skeleton className="h-4 w-full bg-blue-100" />
          <Skeleton className="h-9 w-full mt-4 bg-blue-100" />
        </Card>
      </div>
    </div>
  </PageWrapper>
);
