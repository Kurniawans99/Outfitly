import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Sparkles } from "lucide-react";
import { ClothingItem } from "@/services/wardrobeService";

export const ClothingDetailDialog = ({
  item,
  isOpen,
  onOpenChange,
  onEdit,
  onDelete,
  onImageClick,
}: {
  item: ClothingItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: ClothingItem) => void;
  onDelete: (item: ClothingItem) => void;
  onImageClick: () => void;
}) => {
  if (!item) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl p-0 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          {/* Image Section with Enhanced Styling */}
          <div
            className="relative cursor-zoom-in group overflow-hidden"
            onClick={onImageClick}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
            <img
              src={item.imageUrl}
              alt={item.name}
              className="object-cover w-full h-full min-h-[400px] md:rounded-l-xl transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          {/* Content Section with Enhanced Layout */}
          <div className="p-8 flex flex-col bg-gradient-to-b from-white to-blue-50/30">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                {item.name}
              </DialogTitle>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mt-2" />
            </DialogHeader>

            <div className="space-y-6 text-sm text-slate-700 flex-grow">
              {/* Category Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
                <Label className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                  Kategori
                </Label>
                <p className="text-lg font-semibold text-slate-800 mt-1">
                  {item.category}
                </p>
              </div>

              {/* Color Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
                <Label className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                  Warna
                </Label>
                <p className="text-lg font-semibold text-slate-800 mt-1">
                  {item.color}
                </p>
              </div>

              {/* Tags Section */}
              {item.tags && item.tags.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
                  <Label className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-3 block">
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {item.notes && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
                  <Label className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                    Catatan
                  </Label>
                  <p className="text-base text-slate-700 mt-2 leading-relaxed whitespace-pre-wrap">
                    {item.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Action Buttons */}
            <DialogFooter className="mt-8 gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => onDelete(item)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
              <Button
                onClick={() => onEdit(item)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 px-6"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
