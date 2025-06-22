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
  Sparkles,
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
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "32°C",
  },
  "2025-06-16": {
    icon: <Cloud className="w-5 h-5 text-slate-400" />,
    temp: "30°C",
  },
  "2025-06-17": {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "33°C",
  },
  "2025-06-18": {
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    temp: "28°C",
  },
  "2025-06-19": {
    icon: <Cloud className="w-5 h-5 text-slate-400" />,
    temp: "29°C",
  },
  "2025-06-20": {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "31°C",
  },
  "2025-06-21": {
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    temp: "27°C",
  },
  "2025-06-22": {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "32°C",
  },
  "2025-06-23": {
    icon: <Cloud className="w-5 h-5 text-slate-400" />,
    temp: "30°C",
  },
  "2025-06-24": {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "33°C",
  },
  "2025-06-25": {
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    temp: "28°C",
  },
  "2025-06-26": {
    icon: <Cloud className="w-5 h-5 text-slate-400" />,
    temp: "29°C",
  },
  "2025-06-27": {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "31°C",
  },
  "2025-06-28": {
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    temp: "27°C",
  },
  "2025-06-29": {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "31°C",
  },
  "2025-06-30": {
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    temp: "27°C",
  },
  "2025-07-01": {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "32°C",
  },
  "2025-07-02": {
    icon: <Cloud className="w-5 h-5 text-slate-400" />,
    temp: "30°C",
  },
  "2025-07-03": {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "33°C",
  },
  "2025-07-04": {
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    temp: "28°C",
  },
  "2025-07-05": {
    icon: <Cloud className="w-5 h-5 text-slate-400" />,
    temp: "29°C",
  },
  "2025-07-06": {
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    temp: "31°C",
  },
  "2025-07-07": {
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    temp: "27°C",
  },
};

const PlannedOutfitCard = ({
  outfit,
  onRemove,
}: {
  outfit: PlannedOutfit; // Menggunakan tipe PlannedOutfit yang baru
  onRemove: () => void;
}) => (
  <div className="relative group h-full">
    <AspectRatio
      ratio={4 / 5}
      className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100"
    >
      <img
        src={
          outfit.items[0]?.item?.imageUrl ||
          "/api/placeholder/400/500?text=No+Image"
        } // Ambil gambar dari item pertama
        alt={outfit.outfitName || "Planned Outfit"}
        className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
    </AspectRatio>
    <div className="absolute bottom-0 left-0 p-4 w-full">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-3 h-3 text-blue-300" />
        <h4 className="font-bold text-white text-sm truncate">
          {outfit.outfitName || "Outfit Terencana"}
        </h4>
      </div>
      <p className="text-xs text-blue-100 truncate leading-relaxed">
        {outfit.items.map((i) => i.item.name).join(", ")}
      </p>
    </div>
    <div className="absolute top-3 right-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 transition-all duration-200"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white/95 backdrop-blur-sm border-white/20"
        >
          <DropdownMenuItem
            onSelect={onRemove}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
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
    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-dashed border-blue-200 rounded-xl hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100/50 transition-all duration-300 text-slate-400 hover:text-blue-600 group"
  >
    <div className="p-4 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all duration-300 mb-3 group-hover:scale-110">
      <PlusCircle className="w-8 h-8 group-hover:text-blue-500 transition-colors duration-300" />
    </div>
    <span className="font-semibold text-sm group-hover:text-blue-600 transition-colors duration-300">
      Pilih Outfit
    </span>
    <span className="text-xs text-slate-400 group-hover:text-blue-400 mt-1 transition-colors duration-300">
      Tap untuk memilih
    </span>
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <PageWrapper
          title="Outfit Planner"
          actions={
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <Calendar className="mr-2 h-4 w-4" />
              Lihat Kalender Bulanan
            </Button>
          }
        >
          {/* Header Navigasi Minggu */}
          <div className="flex items-center justify-between mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevWeek}
              className="h-12 w-12 rounded-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5 text-blue-600" />
            </Button>

            <div className="text-center px-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                {weekDays[0].toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p className="text-sm text-slate-600 font-medium">
                  {weekDays[0].toLocaleDateString("id-ID", { day: "numeric" })}{" "}
                  -{" "}
                  {weekDays[6].toLocaleDateString("id-ID", { day: "numeric" })}
                </p>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextWeek}
              className="h-12 w-12 rounded-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </Button>
          </div>

          {/* Grid Kalender Mingguan */}
          {isLoadingOutfits ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {Array.from({ length: 7 }).map((_, i) => (
                <Card
                  key={i}
                  className="flex flex-col shadow-lg animate-pulse h-[350px] bg-white/50 backdrop-blur-sm border-blue-100/50"
                >
                  <CardHeader className="p-4">
                    <Skeleton className="h-4 w-1/3 mb-2 bg-blue-100" />
                    <Skeleton className="h-8 w-1/2 bg-blue-100" />
                  </CardHeader>
                  <CardContent className="flex-grow p-3 pt-0 flex flex-col justify-center items-center">
                    <Skeleton className="h-32 w-full rounded-xl bg-blue-100" />
                    <Skeleton className="h-4 w-full mt-3 bg-blue-100" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {weekDays.map((day) => {
                const dateKey = formatDateToKey(day);
                const outfit = plannedOutfits.get(dateKey); // Ambil dari Map
                const weather =
                  dummyWeather[dateKey as keyof typeof dummyWeather];
                const isToday = formatDateToKey(new Date()) === dateKey;

                return (
                  <Card
                    key={dateKey}
                    className={`flex flex-col shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border-0 hover:-translate-y-1 ${
                      isToday
                        ? "bg-gradient-to-br from-blue-50 to-blue-100/50 ring-2 ring-blue-300 shadow-blue-200/50"
                        : "bg-white/80 hover:bg-white/90"
                    }`}
                  >
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            {day.toLocaleDateString("id-ID", {
                              weekday: "short",
                            })}
                          </CardTitle>
                          <p
                            className={`text-3xl font-bold ${
                              isToday ? "text-blue-600" : "text-slate-700"
                            }`}
                          >
                            {day.getDate()}
                          </p>
                        </div>
                        {weather && (
                          <div className="flex flex-col items-center text-slate-500 bg-white/60 p-2 rounded-lg backdrop-blur-sm">
                            {weather.icon}
                            <span className="text-xs font-semibold mt-1">
                              {weather.temp}
                            </span>
                          </div>
                        )}
                      </div>
                      {isToday && (
                        <Badge
                          variant="secondary"
                          className="w-fit mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          Hari Ini
                        </Badge>
                      )}
                    </CardHeader>

                    <CardContent className="flex-grow p-3 pt-0 flex flex-col">
                      <div className="flex-grow min-h-[180px]">
                        {outfit ? (
                          <PlannedOutfitCard
                            outfit={outfit}
                            onRemove={() => handleRemoveOutfit(outfit._id)}
                          />
                        ) : (
                          <EmptySlot onPlan={() => handlePlanOutfit(day)} />
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-blue-100">
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
                              className="h-9 text-xs border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                              autoFocus
                              onBlur={(e) =>
                                handleUpdateOccasion(dateKey, e.target.value)
                              } // Simpan saat blur
                            />
                          </form>
                        ) : (
                          <div
                            onClick={() => setEditingOccasion(dateKey)}
                            className="flex items-start text-xs text-slate-600 min-h-[32px] p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                          >
                            <Pencil className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0 text-blue-400 group-hover:text-blue-600" />
                            <p className="italic break-words group-hover:text-blue-700">
                              {outfit?.occasion || "Tambah catatan acara..."}
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
        </PageWrapper>
      </div>
    </>
  );
}
