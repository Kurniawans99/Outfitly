// frontend/src/components/wardrobe/WardrobeListCard.tsx (ENHANCED UI)

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Wardrobe } from "@/services/wardrobeService";
import {
  Shirt,
  Calendar,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";

interface WardrobeListCardProps {
  wardrobe: Wardrobe;
  viewMode?: "grid" | "list";
}

export const WardrobeListCard: React.FC<WardrobeListCardProps> = ({
  wardrobe,
  viewMode = "grid",
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <Card
        onClick={() => navigate(`/dashboard/wardrobe/${wardrobe._id}`)}
        className="cursor-pointer group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-blue-100/50 hover:border-blue-300/50 hover:bg-white/90"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Thumbnail Section */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100/50 group-hover:shadow-md transition-all duration-300">
              {wardrobe.itemImageUrls && wardrobe.itemImageUrls.length > 0 ? (
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <img
                    src={wardrobe.itemImageUrls[0]}
                    alt={wardrobe.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="text-center text-blue-400">
                  <Shirt className="w-8 h-8 mx-auto mb-1" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors duration-200">
                    {wardrobe.name}
                  </h3>
                  {wardrobe.description && (
                    <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                      {wardrobe.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Shirt className="w-3 h-3" />
                      <span>{wardrobe.itemCount || 0} Item</span>
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={() => navigate(`/dashboard/wardrobe/${wardrobe._id}`)}
      className="cursor-pointer group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white/80 backdrop-blur-sm border-blue-100/50 hover:border-blue-300/50 hover:bg-white/90 overflow-hidden"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate text-slate-800 group-hover:text-blue-700 transition-colors duration-200 flex items-center gap-2">
              <span className="truncate">{wardrobe.name}</span>
              {(wardrobe.itemCount || 0) > 10 && (
                <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
            </CardTitle>
            <CardDescription className="truncate h-5 mt-1 text-slate-500">
              {wardrobe.description || "Koleksi pakaian"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Preview Grid */}
        <div className="h-44 bg-gradient-to-br from-blue-50/50 to-slate-50/50 rounded-xl overflow-hidden p-2 mb-4 border border-blue-100/30 group-hover:shadow-inner transition-all duration-300">
          {wardrobe.itemImageUrls && wardrobe.itemImageUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-1.5 w-full h-full">
              {wardrobe.itemImageUrls.slice(0, 4).map((url, index) => (
                <div
                  key={index}
                  className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm border border-blue-100/30 group-hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={url}
                    alt={`item ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-blue-400/70 group-hover:text-blue-500/70 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-100/70 transition-colors duration-300">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium">Belum ada item</p>
              <p className="text-xs opacity-75">Tambahkan pakaian pertama</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
              <Shirt className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                {wardrobe.itemCount || 0}
              </span>
            </div>
            {(wardrobe.itemCount || 0) > 0 && (
              <div className="text-xs text-slate-400">Item Pakaian</div>
            )}
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <div className="mt-3 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
      </CardContent>
    </Card>
  );
};
