import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/services/community/community.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MessageSquare, Heart } from "lucide-react";

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  return (
    <Card className="hover:border-sky-300 hover:bg-slate-50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
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
              <p className="font-semibold text-slate-800">{post.author.name}</p>
              <p className="text-xs text-slate-500">{post.createdAt}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{post.title}</h3>
        <p className="text-slate-600 line-clamp-2">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-slate-600">
          <span className="flex items-center gap-1.5 text-sm">
            <MessageSquare className="w-4 h-4" /> {post.replyCount} Balasan
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <Heart className="w-4 h-4" /> {post.likeCount} Suka
          </span>
        </div>
        <Link to={`/dashboard/post/${post._id}`}>
          <Button variant="outline" size="sm">
            Lihat Diskusi
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
