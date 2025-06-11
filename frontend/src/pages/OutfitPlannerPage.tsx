// src/pages/OutfitPlannerPage.tsx

import React, { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  MoreVertical,
  Trash2,
  Calendar,
  Sun,
  Cloud,
  CloudRain,
  Shirt,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  SelectableItem,
  SelectOutfitDialog,
} from "@/components/planner/SelectOutfitPlanner";

const dummyPlannedOutfits = {
  "2025-06-16": {
    id: "outfit1",
    name: "Meeting Klien",
    imageUrl: "/api/placeholder/400/500?text=Office+Look",
    items: ["Kemeja Biru", "Celana Chino", "Loafers"],
    occasion: "Presentasi proyek penting",
  },
  "2025-06-18": {
    id: "outfit2",
    name: "Casual Hangout",
    imageUrl: "/api/placeholder/400/500?text=Casual+Vibe",
    items: ["T-shirt Putih", "Jeans", "Sneakers"],
    occasion: "Nongkrong di kafe",
  },
  "2025-06-20": {
    id: "outfit3",
    name: "Friday Work",
    imageUrl: "/api/placeholder/400/500?text=Smart+Casual",
    items: ["Polo Shirt", "Celana Kain", "Sepatu Derby"],
    occasion: "Kerja santai & Buka Bersama",
  },
};

//  Dummy untuk Cuaca ---
const dummyWeather = {
  "2025-06-15": {
    icon: <Sun className="w-5 h-5 text-yellow-500" />,
    temp: "32°C",
  },
  "2025-06-16": {
    icon: <Cloud className="w-5 h-5 text-slate-500" />,
    temp: "30°C",
  },
  "2025-06-17": {
    icon: <Sun className="w-5 h-5 text-yellow-500" />,
    temp: "33°C",
  },
  "2025-06-18": {
    icon: <CloudRain className="w-5 h-5 text-blue-500" />,
    temp: "28°C",
  },
  "2025-06-19": {
    icon: <Cloud className="w-5 h-5 text-slate-500" />,
    temp: "29°C",
  },
  "2025-06-20": {
    icon: <Sun className="w-5 h-5 text-yellow-500" />,
    temp: "31°C",
  },
  "2025-06-21": {
    icon: <CloudRain className="w-5 h-5 text-blue-500" />,
    temp: "27°C",
  },
};

// Data Dummy untuk Saran Outfit dari Wardrobe ---
const dummySuggestedOutfits = [
  {
    id: "sug1",
    name: "Monochrome Daily",
    imageUrl: "/api/placeholder/200/250?text=Mono",
  },
  {
    id: "sug2",
    name: "Earth Tone Formal",
    imageUrl: "/api/placeholder/200/250?text=Earth",
  },
  {
    id: "sug3",
    name: "Weekend Sporty",
    imageUrl: "/api/placeholder/200/250?text=Sport",
  },
  {
    id: "sug4",
    name: "Beach Ready",
    imageUrl: "/api/placeholder/200/250?text=Beach",
  },
  {
    id: "sug5",
    name: "Smart Workwear",
    imageUrl: "/api/placeholder/200/250?text=Work",
  },
];

type Outfit = {
  id: string;
  name: string;
  imageUrl: string;
  items: string[];
  occasion?: string;
};

const PlannedOutfitCard = ({
  outfit,
  onRemove,
}: {
  outfit: Outfit;
  onRemove: () => void;
}) => (
  <div className="relative group h-full">
    <AspectRatio ratio={4 / 5} className="overflow-hidden rounded-lg">
      <img
        src={outfit.imageUrl}
        alt={outfit.name}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </AspectRatio>
    <div className="absolute bottom-0 left-0 p-3 w-full">
      <h4 className="font-bold text-white text-sm truncate">{outfit.name}</h4>
      <p className="text-xs text-slate-200 truncate">
        {outfit.items.join(", ")}
      </p>
    </div>
    <div className="absolute top-2 right-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-black/30 hover:bg-black/50 text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={onRemove}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus dari Planner
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

const EmptySlot = ({ onPlan }: { onPlan: () => void }) => (
  <button
    onClick={onPlan}
    className="w-full h-full flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all duration-200 text-slate-400 hover:text-sky-600"
  >
    <PlusCircle className="w-8 h-8" />
    <span className="font-semibold text-sm mt-2">Pilih Outfit</span>
  </button>
);

export function OutfitPlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [plannedOutfits, setPlannedOutfits] = useState(dummyPlannedOutfits);
  const [editingOccasion, setEditingOccasion] = useState<string | null>(null);

  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [planningDate, setPlanningDate] = useState<Date | null>(null);

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays(currentDate);

  const handleNextWeek = () => {
    setCurrentDate(
      (prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() + 7))
    );
  };
  const handlePrevWeek = () => {
    setCurrentDate(
      (prevDate) => new Date(new Date(prevDate).setDate(prevDate.getDate() - 7))
    );
  };

  const formatDateToKey = (date: Date) => date.toISOString().split("T")[0];

  const handlePlanOutfit = (date: Date) => {
    setPlanningDate(date);
    setIsSelectDialogOpen(true);
  };

  const handleSelectItemAndPlan = (item: SelectableItem) => {
    if (planningDate) {
      const dateKey = formatDateToKey(planningDate);

      // Buat objek outfit baru berdasarkan item yang dipilih
      const newPlannedOutfit: Outfit = {
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        items: item.items || [item.name], // Jika setelan, gunakan items[], jika tidak, gunakan namanya sendiri
        occasion: "", // Kosongkan catatan acara, biarkan pengguna mengisinya
      };

      // Update state planner
      setPlannedOutfits((prev) => ({
        ...prev,
        [dateKey]: newPlannedOutfit,
      }));
    }

    // Tutup dialog
    setIsSelectDialogOpen(false);
    setPlanningDate(null);
  };
  const handleRemoveOutfit = (dateKey: string) => {
    // Logika ini perlu dimodifikasi untuk benar-benar menghapus data
    const newPlanned = { ...plannedOutfits };
    delete newPlanned[dateKey as keyof typeof newPlanned];
    setPlannedOutfits(newPlanned);
    alert(`Menghapus outfit dari tanggal ${dateKey}`);
  };

  // --- BARU: Fungsi untuk menangani update catatan acara ---
  const handleUpdateOccasion = (dateKey: string, newOccasion: string) => {
    setPlannedOutfits((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey as keyof typeof prev]!,
        occasion: newOccasion,
      },
    }));
    setEditingOccasion(null);
  };

  return (
    <>
      <SelectOutfitDialog
        open={isSelectDialogOpen}
        onOpenChange={setIsSelectDialogOpen}
        selectedDate={planningDate}
        onSelectItem={handleSelectItemAndPlan}
      />

      <PageWrapper
        title="Outfit Planner"
        actions={
          <Button className="bg-sky-600 hover:bg-sky-700 text-white">
            {" "}
            <Calendar className="mr-2 h-4 w-4" /> Lihat Kalender Bulanan{" "}
          </Button>
        }
      >
        {/* Header Navigasi Minggu */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            {" "}
            <ChevronLeft className="h-5 w-5" />{" "}
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-800">
              {weekDays[0].toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <p className="text-sm text-slate-500">
              {weekDays[0].toLocaleDateString("id-ID", { day: "numeric" })} -{" "}
              {weekDays[6].toLocaleDateString("id-ID", { day: "numeric" })}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            {" "}
            <ChevronRight className="h-5 w-5" />{" "}
          </Button>
        </div>

        {/* Grid Kalender Mingguan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
          {weekDays.map((day) => {
            const dateKey = formatDateToKey(day);
            const outfit =
              plannedOutfits[dateKey as keyof typeof plannedOutfits];
            const weather = dummyWeather[dateKey as keyof typeof dummyWeather];
            const isToday = formatDateToKey(new Date()) === dateKey;

            return (
              <Card
                key={dateKey}
                className={`flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300 ${
                  isToday ? "border-sky-500 border-2" : "border-slate-200"
                }`}
              >
                {/* --- MODIFIKASI: CardHeader dengan Cuaca --- */}
                <CardHeader className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {" "}
                        {day.toLocaleDateString("id-ID", {
                          weekday: "short",
                        })}{" "}
                      </CardTitle>
                      <p
                        className={`text-2xl font-bold ${
                          isToday ? "text-sky-600" : "text-slate-700"
                        }`}
                      >
                        {" "}
                        {day.getDate()}{" "}
                      </p>
                    </div>
                    {weather && (
                      <div className="flex flex-col items-center text-slate-500">
                        {weather.icon}
                        <span className="text-xs font-semibold">
                          {weather.temp}
                        </span>
                      </div>
                    )}
                  </div>
                  {isToday && (
                    <Badge variant="secondary" className="w-fit mt-1">
                      Hari Ini
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="flex-grow p-2 pt-0 flex flex-col">
                  <div className="flex-grow min-h-[150px]">
                    {outfit ? (
                      <PlannedOutfitCard
                        outfit={outfit}
                        onRemove={() => handleRemoveOutfit(dateKey)}
                      />
                    ) : (
                      <EmptySlot onPlan={() => handlePlanOutfit(day)} />
                    )}
                  </div>

                  {/* --- BARU: Bagian Catatan Acara --- */}
                  <div className="mt-2 pt-2 border-t">
                    {editingOccasion === dateKey ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateOccasion(
                            dateKey,
                            e.currentTarget.occasion.value
                          );
                        }}
                      >
                        <Input
                          name="occasion"
                          defaultValue={outfit?.occasion || ""}
                          className="h-8 text-xs"
                          autoFocus
                          onBlur={() => setEditingOccasion(null)}
                        />
                      </form>
                    ) : (
                      <div
                        onClick={() => setEditingOccasion(dateKey)}
                        className="flex items-start text-xs text-slate-600 min-h-[28px] p-1 rounded-md hover:bg-slate-100 cursor-pointer"
                      >
                        <Pencil className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="italic break-words">
                          {outfit?.occasion || "Tambah catatan..."}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* --- BARU: Bagian Saran Outfit Cepat --- */}
        <Separator className="my-8" />
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Shirt className="mr-3 text-sky-600" />
            Saran Cepat dari Lemari Anda
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {dummySuggestedOutfits.map((outfit) => (
              <Card
                key={outfit.id}
                className="group overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <AspectRatio ratio={4 / 5}>
                  <img
                    src={outfit.imageUrl}
                    alt={outfit.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </AspectRatio>
                <div className="p-3 bg-white">
                  <p className="font-semibold text-sm truncate">
                    {outfit.name}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
