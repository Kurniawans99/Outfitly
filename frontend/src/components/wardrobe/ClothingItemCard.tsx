import { ClothingItem } from "@/services/wardrobeService";
import { Card, CardContent, CardHeader } from "../ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Expand, Sparkles } from "lucide-react";

export const ClothingItemCard = ({
  item,
  onClick,
}: {
  item: ClothingItem;
  onClick: () => void;
}) => (
  <Card
    onClick={onClick}
    className="overflow-hidden group transition-all duration-500 ease-out cursor-pointer hover:shadow-2xl hover:-translate-y-3 bg-gradient-to-b from-white to-blue-50/30 border-2 border-blue-100/50 hover:border-blue-200"
  >
    <CardHeader className="p-0 relative overflow-hidden">
      <AspectRatio ratio={3 / 4}>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
      </AspectRatio>

      {/* Floating Action Icon */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
        <Sparkles className="w-4 h-4 text-blue-600" />
      </div>

      {/* Center Expand Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-xl">
          <Expand className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </CardHeader>

    <CardContent className="p-5 bg-gradient-to-b from-white to-blue-50/50 group-hover:from-blue-50/50 group-hover:to-white transition-all duration-300">
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-800 transition-colors duration-300 line-clamp-1">
          {item.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-600 font-medium bg-blue-100/50 px-3 py-1 rounded-full group-hover:bg-blue-200/50 transition-colors duration-300">
            {item.category}
          </p>
          {item.color && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-sm" />
              <span className="text-xs text-slate-600 font-medium">
                {item.color}
              </span>
            </div>
          )}
        </div>

        {/* Tags Preview */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gradient-to-r from-blue-500 to-blue-400 text-white px-2 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-medium">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
