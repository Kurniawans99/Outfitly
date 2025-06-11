import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/services/community/community.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MessageSquare, Heart, Eye, Calendar, ArrowRight } from "lucide-react";

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/post/${post._id}`);
  };

  return (
    <Card
      className="bg-white/80 backdrop-blur-sm border border-blue-100 shadow-lg hover:shadow-2xl hover:border-blue-300 transition-all duration-300 ease-out transform hover:-translate-y-1 rounded-2xl overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-transparent">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300">
                <AvatarImage
                  src={post.author.avatar?.url}
                  alt={post.author.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                  {post.author.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                {post.author.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
            {post.tags.map((tag, index) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 text-xs px-2 py-1 shadow-sm"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-6 px-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-gray-50/50 border-t border-blue-100/50 px-6 py-4">
        <div className="flex items-center gap-6 text-gray-500">
          <div className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200 group/stat">
            <div className="p-1.5 rounded-full bg-blue-100 group-hover/stat:bg-blue-200 transition-colors duration-200">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium">{post.replyCount}</span>
            <span className="text-xs hidden sm:inline">Balasan</span>
          </div>

          <div className="flex items-center gap-2 hover:text-red-600 transition-colors duration-200 group/stat">
            <div className="p-1.5 rounded-full bg-red-100 group-hover/stat:bg-red-200 transition-colors duration-200">
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-sm font-medium">{post.likeCount}</span>
            <span className="text-xs hidden sm:inline">Suka</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400 group/stat">
            <div className="p-1.5 rounded-full bg-gray-100">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">
              {Math.floor(Math.random() * 100) + 50}
            </span>
            <span className="text-xs hidden sm:inline">Views</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:translate-x-1 transition-transform duration-200">
          <span className="text-sm">Lihat Diskusi</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
