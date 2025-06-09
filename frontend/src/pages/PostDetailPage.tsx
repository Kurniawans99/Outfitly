import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReplyItem } from "@/components/community/ReplyItem";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  getPostById,
  addReply,
  togglePostLike,
  toggleReplyLike,
} from "@/services/community/communityService";
import { Post } from "@/services/community/community.types";

export function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      setIsLoading(true);
      const data = await getPostById(postId);
      setPost(data);
    } catch (error) {
      toast.error("Gagal memuat detail postingan.");
      console.error(error);
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
      setPost(updatedPost); // Update state dengan post yang berisi balasan baru
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
      let updatedPost;
      if (type === "post") {
        updatedPost = await togglePostLike(postId);
      } else {
        updatedPost = await toggleReplyLike(postId, id);
      }
      setPost(updatedPost);
    } catch (error) {
      toast.error("Gagal memproses permintaan.");
    }
  };

  if (isLoading) {
    return (
      <PageWrapper title=" ">
        <Skeleton className="h-[60vh] w-full" />
      </PageWrapper>
    );
  }

  if (!post) {
    return <PageWrapper title="Error">Postingan tidak ditemukan.</PageWrapper>;
  }

  return (
    <PageWrapper
      title="Detail Postingan"
      actions={
        <Link to="/dashboard/community">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
      }
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={post.author.avatar?.url}
                  alt={post.author.name}
                />
                <AvatarFallback>
                  {post.author.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-800">
                  {post.author.name}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(post.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {post.title}
            </h2>
            <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
              {post.content}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => handleToggleLike("post", post._id)}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${
                  post.likes.includes(localStorage.getItem("userId") || "")
                    ? "text-red-500 fill-current"
                    : ""
                }`}
              />
              Suka ({post.likeCount})
            </Button>
          </CardFooter>
        </Card>

        <Separator className="my-8" />

        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-semibold">Beri Balasan</h3>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Tulis balasanmu di sini..."
              rows={4}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              className="bg-sky-600 hover:bg-sky-700"
              onClick={handleReplySubmit}
              disabled={isReplying}
            >
              {isReplying ? (
                "Mengirim..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Balasan
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-800">
            {post.replyCount} Balasan
          </h3>
          {post.replies.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              onLike={() => handleToggleLike("reply", reply._id)}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
