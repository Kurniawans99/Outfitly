import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface InspirationItemFormProps {
  item?: {
    name: string;
    category: string;
    type: string;
    brand: string;
    size?: string;
    material?: string;
    season?:
      | "Semua Musim"
      | "Musim Panas/Kering"
      | "Musim Hujan"
      | "Musim Dingin";
    color?: string;
    tags?: string;
    notes?: string;
    imageUrl: string;
    imagePublicId: string;
  };
  onItemChange: (newItem: any) => void;
  onRemove?: () => void;
}

export const InspirationItemForm: React.FC<InspirationItemFormProps> = ({
  item: initialItem,
  onItemChange,
  onRemove,
}) => {
  const [item, setItem] = useState({
    name: initialItem?.name || "",
    category: initialItem?.category || "",
    type: initialItem?.type || "",
    brand: initialItem?.brand || "",
    size: initialItem?.size || "",
    material: initialItem?.material || "",
    season: initialItem?.season || "Semua Musim",
    color: initialItem?.color || "",
    tags: initialItem?.tags || "",
    notes: initialItem?.notes || "",
    imageUrl: initialItem?.imageUrl || "",
    imagePublicId: initialItem?.imagePublicId || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
    onItemChange({ ...item, [name]: value });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setItem((prev) => ({ ...prev, [name]: value }));
    onItemChange({ ...item, [name]: value });
  };

  return (
    <div className="border p-4 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Detail Item</h4>
        {onRemove && (
          <Button variant="destructive" size="icon" onClick={onRemove}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div>
        <Label htmlFor="itemName">Nama Item*</Label>
        <Input
          id="itemName"
          name="name"
          value={item.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="itemCategory">Kategori*</Label>
        <Select
          name="category"
          value={item.category}
          onValueChange={handleSelectChange("category")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tops">Tops</SelectItem>
            <SelectItem value="Bottoms">Bottoms</SelectItem>
            <SelectItem value="Dresses">Dresses</SelectItem>
            <SelectItem value="Outerwear">Outerwear</SelectItem>
            <SelectItem value="Shoes">Shoes</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
            <SelectItem value="Bags">Bags</SelectItem>
            <SelectItem value="Headwear">Headwear</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="itemType">Tipe Gaya*</Label>
        <Input
          id="itemType"
          name="type"
          value={item.type}
          onChange={handleChange}
          placeholder="cth: Kasual, Formal"
        />
      </div>
      <div>
        <Label htmlFor="itemBrand">Brand</Label>
        <Input
          id="itemBrand"
          name="brand"
          value={item.brand}
          onChange={handleChange}
          placeholder="cth: Nike"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="itemSize">Ukuran</Label>
          <Input
            id="itemSize"
            name="size"
            value={item.size}
            onChange={handleChange}
            placeholder="cth: M"
          />
        </div>
        <div>
          <Label htmlFor="itemColor">Warna</Label>
          <Input
            id="itemColor"
            name="color"
            value={item.color}
            onChange={handleChange}
            placeholder="cth: Merah"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="itemMaterial">Material</Label>
        <Input
          id="itemMaterial"
          name="material"
          value={item.material}
          onChange={handleChange}
          placeholder="cth: Katun"
        />
      </div>
      <div>
        <Label htmlFor="itemSeason">Musim</Label>
        <Select
          name="season"
          value={item.season}
          onValueChange={handleSelectChange("season")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih musim" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua Musim">Semua Musim</SelectItem>
            <SelectItem value="Musim Panas/Kering">
              Musim Panas/Kering
            </SelectItem>
            <SelectItem value="Musim Hujan">Musim Hujan</SelectItem>
            <SelectItem value="Musim Dingin">Musim Dingin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="itemTags">Tags (pisahkan dengan koma)</Label>
        <Input
          id="itemTags"
          name="tags"
          value={item.tags}
          onChange={handleChange}
          placeholder="cth: trendy, stylish"
        />
      </div>
      <div>
        <Label htmlFor="itemNotes">Catatan</Label>
        <Input
          id="itemNotes"
          name="notes"
          value={item.notes}
          onChange={handleChange}
          placeholder="cth: Cocok untuk acara santai"
        />
      </div>
      {/* Anda mungkin perlu menampilkan preview gambar di sini juga */}
    </div>
  );
};
