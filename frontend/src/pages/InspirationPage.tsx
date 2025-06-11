// src/pages/InspirationPage.tsx

import React, { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  InspirationCard,
  InspirationPost,
} from "@/components/inspiration/InspirationCard";
import { InspirationDetailV2 } from "@/components/inspiration/InspirationDetailDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// --- Data dummy tetap sama seperti sebelumnya (dengan properti 'items') ---
const dummyInspirationPosts: InspirationPost[] = [
  {
    id: "1",
    user: {
      name: "Andina",
      avatarUrl: "https://placehold.co/100x100/E2E8F0/475569?text=A",
    },
    imageUrl: "https://placehold.co/600x800/E2E8F0/475569?text=Outfit+1",
    caption: "OOTD simpel buat WFC hari Jumat!",
    tags: ["casual", "work", "friday"],
    likes: 124,
    items: [
      {
        id: "i1",
        name: "Blazer Crop Putih",
        imageUrl: "https://placehold.co/100x100/FEF08A/422006?text=Item",
        category: "Atasan",
      },
      {
        id: "i2",
        name: "Celana Kulot Jeans",
        imageUrl: "https://placehold.co/100x100/E9D5FF/4A044E?text=Item",
        category: "Bawahan",
      },
    ],
  },
  {
    id: "2",
    user: {
      name: "Bima Saputra",
      avatarUrl: "https://placehold.co/100x100/E2E8F0/475569?text=B",
    },
    imageUrl: "https://placehold.co/600x700/E2E8F0/475569?text=Outfit+2",
    caption: "Street style black on black.",
    tags: ["streetwear", "monochrome"],
    likes: 256,
    items: [
      {
        id: "i3",
        name: "Hoodie Hitam Oversized",
        imageUrl: "https://placehold.co/100x100/A3E635/1A2E05?text=Item",
        category: "Atasan",
      },
      {
        id: "i4",
        name: "Celana Kargo Hitam",
        imageUrl: "https://placehold.co/100x100/FBCFE8/831843?text=Item",
        category: "Bawahan",
      },
      {
        id: "i5",
        name: "Topi Beanie",
        imageUrl: "https://placehold.co/100x100/BAE6FD/0C4A6E?text=Item",
        category: "Aksesoris",
      },
    ],
  },
  {
    id: "3",
    user: {
      name: "Citra Kirana",
      avatarUrl: "https://placehold.co/100x100/E2E8F0/475569?text=C",
    },
    imageUrl: "https://placehold.co/600x900/E2E8F0/475569?text=Outfit+3",
    caption: "Lagi suka sama gaya vintage gini.",
    tags: ["vintage", "weekend"],
    likes: 88,
    items: [],
  },
  {
    id: "4",
    user: {
      name: "Doni",
      avatarUrl: "https://placehold.co/100x100/E2E8F0/475569?text=D",
    },
    imageUrl: "https://placehold.co/600x750/E2E8F0/475569?text=Outfit+4",
    caption: "Outfit santai buat ke pantai.",
    tags: ["summer", "beach", "holiday"],
    likes: 178,
    items: [],
  },
];

export function InspirationPage() {
  const [selectedPost, setSelectedPost] = useState<InspirationPost | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleCardClick = (post: InspirationPost) => {
    setSelectedPost(post);
    setIsDetailOpen(true);
  };

  return (
    <>
      <PageWrapper title="Inspirasi Outfit">
        {/* --- MODIFIKASI: Toolbar Filter dan Pencarian yang lebih responsif --- */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center flex-wrap">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Cari inspirasi (cth: vintage, streetwear, #ootd ...)"
              className="pl-10"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Paling Populer</SelectItem>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="most_saved">
                  Paling Banyak Disimpan
                </SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kategori Gaya" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Gaya</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="streetwear">Streetwear</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
                <SelectItem value="sporty">Sporty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Galeri Inspirasi (tanpa perubahan) */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {dummyInspirationPosts.map((post) => (
            <InspirationCard
              key={post.id}
              post={post}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </PageWrapper>

      {/* Render komponen dialog (tanpa perubahan) */}
      <InspirationDetailV2
        post={selectedPost}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}
