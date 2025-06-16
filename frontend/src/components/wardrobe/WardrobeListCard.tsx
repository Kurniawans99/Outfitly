// frontend/src/components/wardrobe/WardrobeListCard.tsx (NEW FILE)

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Wardrobe } from "@/services/wardrobeService"; // Assume this type will be defined
import { Shirt } from "lucide-react";

interface WardrobeListCardProps {
  wardrobe: Wardrobe;
}

export const WardrobeListCard: React.FC<WardrobeListCardProps> = ({
  wardrobe,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/dashboard/wardrobe/${wardrobe._id}`)}
      className="cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <CardHeader>
        <CardTitle className="truncate">{wardrobe.name}</CardTitle>
        <CardDescription className="truncate h-5">
          {wardrobe.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40 bg-slate-100 rounded-lg flex items-center justify-center p-2">
          {wardrobe.itemImageUrls && wardrobe.itemImageUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 w-full h-full">
              {wardrobe.itemImageUrls.slice(0, 4).map((url, index) => (
                <div
                  key={index}
                  className="w-full h-full bg-slate-200 rounded-sm overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`item ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400">
              <Shirt className="w-12 h-12 mx-auto" />
              <p className="text-xs mt-1">Belum ada item</p>
            </div>
          )}
        </div>
        <div className="text-xs text-slate-500 mt-3">
          {wardrobe.itemCount || 0} Pakaian
        </div>
      </CardContent>
    </Card>
  );
};
