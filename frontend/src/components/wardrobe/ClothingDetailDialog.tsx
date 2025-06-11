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
import { Trash2, Edit } from "lucide-react";
import { ClothingItem } from "@/pages/WardrobePage";

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
      <DialogContent className="min-w-3xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative cursor-zoom-in" onClick={onImageClick}>
            <img
              src={item.imageUrl}
              alt={item.name}
              className="object-cover w-full h-full min-h-[400px] md:rounded-l-lg"
            />
          </div>
          <div className="p-8 flex flex-col">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-3xl font-bold text-slate-900">
                {item.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 text-sm text-slate-700 flex-grow">
              <div>
                <Label className="text-xs font-semibold text-slate-500 tracking-wider">
                  KATEGORI
                </Label>
                <p className="text-base">{item.category}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-500 tracking-wider">
                  WARNA
                </Label>
                <p className="text-base">{item.color}</p>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div>
                  <Label className="text-xs font-semibold text-slate-500 tracking-wider">
                    TAGS
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {item.notes && (
                <div>
                  <Label className="text-xs font-semibold text-slate-500 tracking-wider">
                    CATATAN
                  </Label>
                  <p className="text-base whitespace-pre-wrap">{item.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter className="mt-8 gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => onDelete(item)}
                className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
              <Button
                onClick={() => onEdit(item)}
                className="bg-slate-900 text-white hover:bg-slate-800"
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
