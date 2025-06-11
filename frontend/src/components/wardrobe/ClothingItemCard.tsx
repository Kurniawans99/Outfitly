import { ClothingItem } from "@/pages/WardrobePage";
import { Card, CardContent, CardHeader } from "../ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Expand } from "lucide-react";

export const ClothingItemCard = ({
  item,
  onClick,
}: {
  item: ClothingItem;
  onClick: () => void;
}) => (
  <Card
    onClick={onClick}
    className="overflow-hidden group transition-all duration-300 ease-in-out cursor-pointer hover:shadow-2xl hover:-translate-y-2"
  >
    {" "}
    <CardHeader className="p-0 relative">
      {" "}
      <AspectRatio ratio={3 / 4}>
        {" "}
        <img
          src={item.imageUrl}
          alt={item.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />{" "}
      </AspectRatio>{" "}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        {" "}
        <Expand className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />{" "}
      </div>{" "}
    </CardHeader>{" "}
    <CardContent className="p-4">
      {" "}
      <h3 className="font-semibold text-base truncate text-slate-800">
        {item.name}
      </h3>{" "}
      <p className="text-sm text-slate-500">{item.category}</p>{" "}
    </CardContent>{" "}
  </Card>
);
