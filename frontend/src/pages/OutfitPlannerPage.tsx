// src/pages/OutfitPlannerPage.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react"; // <-- Import useMemo
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
  Loader2,
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
import { toast } from "sonner";
import {
  getPlannedOutfits,
  planOutfit,
  deletePlannedOutfit,
  PlannedOutfit,
} from "@/services/planner/plannerService";
import { Skeleton } from "@/components/ui/skeleton";

// Data Dummy untuk Cuaca (tetap sama, karena belum ada API cuaca) ---
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

// Data Dummy untuk Saran Outfit dari Wardrobe (tetap sama untuk saat ini) ---
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

const PlannedOutfitCard = ({
  outfit,
  onRemove,
}: {
  outfit: PlannedOutfit; // Menggunakan tipe PlannedOutfit yang baru
  onRemove: () => void;
}) => (
  <div className="relative group h-full">
    <AspectRatio ratio={4 / 5} className="overflow-hidden rounded-lg">
      <img
        src={
          outfit.items[0]?.item?.imageUrl ||
          "/api/placeholder/400/500?text=No+Image"
        } // Ambil gambar dari item pertama
        alt={outfit.outfitName || "Planned Outfit"}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </AspectRatio>
    <div className="absolute bottom-0 left-0 p-3 w-full">
      <h4 className="font-bold text-white text-sm truncate">
        {outfit.outfitName || "Outfit Terencana"}
      </h4>
      <p className="text-xs text-slate-200 truncate">
        {outfit.items.map((i) => i.item.name).join(", ")}
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
  // Gunakan Map untuk menyimpan planned outfits, key-nya adalah tanggal ISO string
  const [plannedOutfits, setPlannedOutfits] = useState<
    Map<string, PlannedOutfit>
  >(new Map());
  const [editingOccasion, setEditingOccasion] = useState<string | null>(null);

  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [planningDate, setPlanningDate] = useState<Date | null>(null);
  const [isLoadingOutfits, setIsLoadingOutfits] = useState(true);

  // === PERUBAHAN DI SINI: Gunakan useMemo untuk weekDays ===
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      return day;
    });
  }, [currentDate]); // Dependensi hanya pada currentDate

  const formatDateToKey = (date: Date) => date.toISOString().split("T")[0];

  const fetchPlannedOutfits = useCallback(async () => {
    setIsLoadingOutfits(true);
    try {
      const startOfCurrentWeek = weekDays[0];
      const endOfCurrentWeek = weekDays[6];

      // Fungsi helper untuk format YYYY-MM-DD
      const toYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const response = await getPlannedOutfits(
        toYYYYMMDD(startOfCurrentWeek),
        toYYYYMMDD(endOfCurrentWeek)
      );
      const newPlannedOutfits = new Map<string, PlannedOutfit>();
      response.data.forEach((outfit) => {
        newPlannedOutfits.set(formatDateToKey(new Date(outfit.date)), outfit);
      });
      setPlannedOutfits(newPlannedOutfits);
    } catch (error) {
      toast.error("Gagal memuat outfit planner.");
      console.error("Error fetching planned outfits:", error);
    } finally {
      setIsLoadingOutfits(false);
    }
  }, [weekDays]); // fetchPlannedOutfits sekarang hanya akan berubah jika weekDays berubah

  useEffect(() => {
    fetchPlannedOutfits();
  }, [fetchPlannedOutfits]); // Panggil fetchPlannedOutfits ketika referensinya berubah (yaitu, ketika weekDays berubah)

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

  const handlePlanOutfit = (date: Date) => {
    setPlanningDate(date);
    setIsSelectDialogOpen(true);
  };

  const handleOutfitPlannedSuccess = () => {
    fetchPlannedOutfits(); // Re-fetch data setelah outfit berhasil direncanakan
  };

  const handleRemoveOutfit = async (outfitId: string) => {
    try {
      await deletePlannedOutfit(outfitId);
      toast.success("Outfit berhasil dihapus dari planner.");
      fetchPlannedOutfits(); // Re-fetch data setelah outfit dihapus
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus outfit.");
      console.error("Error deleting outfit:", error);
    }
  };

  const handleUpdateOccasion = async (dateKey: string, newOccasion: string) => {
    const outfitToUpdate = plannedOutfits.get(dateKey);
    if (!outfitToUpdate) return;

    try {
      const payload = {
        date: outfitToUpdate.date,
        outfitName: outfitToUpdate.outfitName,
        occasion: newOccasion,
        items: outfitToUpdate.items.map((itemRef) => ({
          itemType: itemRef.itemType,
          item: itemRef.item._id, // Kirim hanya ID item
        })),
      };
      await planOutfit(payload); // Gunakan planOutfit untuk update
      toast.success("Catatan acara berhasil diperbarui!");
      fetchPlannedOutfits(); // Refresh data
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui catatan acara."
      );
      console.error("Error updating occasion:", error);
    } finally {
      setEditingOccasion(null);
    }
  };

  return (
    <>
      <SelectOutfitDialog
        open={isSelectDialogOpen}
        onOpenChange={setIsSelectDialogOpen}
        selectedDate={planningDate}
        onOutfitPlanned={handleOutfitPlannedSuccess}
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
        {isLoadingOutfits ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {Array.from({ length: 7 }).map((_, i) => (
              <Card
                key={i}
                className="flex flex-col shadow-md animate-pulse h-[300px]"
              >
                <CardHeader className="p-3">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow p-2 pt-0 flex flex-col justify-center items-center">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {weekDays.map((day) => {
              const dateKey = formatDateToKey(day);
              const outfit = plannedOutfits.get(dateKey); // Ambil dari Map
              const weather =
                dummyWeather[dateKey as keyof typeof dummyWeather];
              const isToday = formatDateToKey(new Date()) === dateKey;

              return (
                <Card
                  key={dateKey}
                  className={`flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300 ${
                    isToday ? "border-sky-500 border-2" : "border-slate-200"
                  }`}
                >
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
                          onRemove={() => handleRemoveOutfit(outfit._id)}
                        />
                      ) : (
                        <EmptySlot onPlan={() => handlePlanOutfit(day)} />
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t">
                      {editingOccasion === dateKey ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateOccasion(
                              dateKey,
                              (e.target as HTMLFormElement).occasion.value
                            );
                          }}
                        >
                          <Input
                            name="occasion"
                            defaultValue={outfit?.occasion || ""}
                            className="h-8 text-xs"
                            autoFocus
                            onBlur={(e) =>
                              handleUpdateOccasion(dateKey, e.target.value)
                            } // Simpan saat blur
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
        )}

        {/* Saran Outfit Cepat (tetap sama) */}
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
