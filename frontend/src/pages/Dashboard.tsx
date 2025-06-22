// frontend/src/pages/Dashboard.tsx
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shirt,
  Lightbulb,
  CalendarCheck2,
  Users2,
  PlusCircle,
  Eye,
  Heart,
  TrendingUp,
  Star,
  ShoppingBag,
  Sparkles,
  Calendar,
  Clock,
  Award,
  Target,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllInspirationPosts } from "@/services/inspiration/inspirationService";
import { InspirationPost } from "@/services/inspiration/inspiration.types";
import {
  getWardrobeItems,
  getWardrobes,
  Wardrobe,
  ClothingItem,
} from "@/services/wardrobeService";

// Enhanced StatCard dengan design yang lebih menarik
const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  colorClass = "text-blue-600",
  bgGradient = "from-blue-50 to-sky-50",
  trend,
  trendValue,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  colorClass?: string;
  bgGradient?: string;
  trend?: "up" | "down";
  trendValue?: string;
}) => (
  <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <div className="space-y-1">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        {trend && trendValue && (
          <div className="flex items-center gap-1">
            <TrendingUp
              className={`h-3 w-3 ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendValue}
            </span>
          </div>
        )}
      </div>
      <div className={`p-2 rounded-xl bg-gradient-to-br ${bgGradient}`}>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </CardContent>
  </Card>
);

interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ElementType; // Bisa juga React.FC atau React.ComponentType
  isUnlocked?: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon: Icon,
  isUnlocked = false,
}) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
      isUnlocked
        ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
        : "border-slate-200 bg-slate-50"
    }`}
  >
    <div
      className={`p-2 rounded-full ${
        isUnlocked ? "bg-yellow-100" : "bg-slate-100"
      }`}
    >
      <Icon
        className={`h-4 w-4 ${
          isUnlocked ? "text-yellow-600" : "text-slate-400"
        }`}
      />
    </div>
    <div className="flex-1">
      <p
        className={`font-medium text-sm ${
          isUnlocked ? "text-yellow-800" : "text-slate-600"
        }`}
      >
        {title}
      </p>
      <p
        className={`text-xs ${
          isUnlocked ? "text-yellow-600" : "text-slate-500"
        }`}
      >
        {description}
      </p>
    </div>
    {isUnlocked && (
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-700 border-yellow-200"
      >
        <Star className="h-3 w-3 mr-1" />
        Unlocked
      </Badge>
    )}
  </div>
);

const LatestInspiration = () => {
  const [latestPosts, setLatestPosts] = useState<InspirationPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestInspirations = async () => {
      try {
        setIsLoading(true);
        const data = await getAllInspirationPosts({ sort: "newest" });
        setLatestPosts(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching latest inspirations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestInspirations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl"
          >
            <Skeleton className="h-16 w-16 rounded-lg bg-slate-200" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 bg-slate-200" />
              <Skeleton className="h-3 w-1/2 bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const postsToShow = latestPosts;

  return (
    <div className="flex flex-col space-y-4">
      {postsToShow.map((post, index) => (
        <div
          key={post._id}
          className="group flex items-center gap-4 bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100"
        >
          <div className="relative">
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-700 transition-colors">
              {post.caption}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500" />
                <span className="font-medium">{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-blue-500" />
                <span className="font-medium">{post.commentCount}</span>
              </span>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
            >
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Enhanced Popular Wardrobe Items
const PopularWardrobeItems = () => {
  const [popularItems, setPopularItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userWardrobeId, setUserWardrobeId] = useState<string | null>(null);

  // Dummy data untuk fallback
  const dummyItems = [
    {
      _id: "1",
      name: "Classic White Button Shirt",
      category: "Kemeja",
      imageUrl:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      name: "Blue Denim Jacket",
      category: "Jaket",
      imageUrl:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "3",
      name: "Black Skinny Jeans",
      category: "Celana",
      imageUrl:
        "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop",
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const fetchUserWardrobeId = async () => {
      try {
        const wardrobesResponse = await getWardrobes({});
        if (wardrobesResponse.data.length > 0) {
          setUserWardrobeId(wardrobesResponse.data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch user wardrobes:", error);
      }
    };
    fetchUserWardrobeId();
  }, []);

  useEffect(() => {
    const fetchPopularItems = async () => {
      if (!userWardrobeId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await getWardrobeItems(userWardrobeId, {});
        const sortedItems = response.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPopularItems(sortedItems.slice(0, 3));
      } catch (error) {
        console.error("Error fetching popular wardrobe items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularItems();
  }, [userWardrobeId]);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl"
          >
            <Skeleton className="h-16 w-16 rounded-lg bg-slate-200" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 bg-slate-200" />
              <Skeleton className="h-3 w-1/2 bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const itemsToShow = popularItems.length > 0 ? popularItems : dummyItems;

  return (
    <div className="flex flex-col space-y-4">
      {itemsToShow.map((item, index) => (
        <div
          key={item._id}
          className="group flex items-center gap-4 bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200"
        >
          <div className="relative">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1 py-0">
              New
            </Badge>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-700 transition-colors">
              {item.name}
            </p>
            <p className="text-sm text-slate-600 mt-1">{item.category}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export function DashboardOverviewPage() {
  const { stats, isLoading: isLoadingProfile } = useUserProfile();

  // Dummy stats untuk fallback
  const dummyStats = {
    outfits: 24,
    likes: 156,
    followers: 89,
    following: 127,
  };

  const currentStats = stats || dummyStats;

  return (
    <PageWrapper
      title="Dashboard Overview"
      actions={
        <div className="flex gap-2">
          <Link to="/dashboard/inspiration">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Inspirasi
            </Button>
          </Link>
          <Link to="/dashboard/wardrobe">
            <Button className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Pakaian
            </Button>
          </Link>
        </div>
      }
    >
      {/* Welcome Banner */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Selamat Datang di Fashion Dashboard! 👋
                </h2>
                <p className="text-blue-100 mb-4">
                  Kelola koleksi fashion Anda dan temukan inspirasi outfit baru
                  setiap hari
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Hari ini:{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Cuaca: Cerah ☀️</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
                  <Sparkles className="h-12 w-12 text-yellow-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {isLoadingProfile ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/2 bg-slate-100" />
                <Skeleton className="h-5 w-5 bg-slate-100 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-3/4 bg-slate-200 mb-1" />
                <Skeleton className="h-3 w-1/2 bg-slate-100" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Pakaian"
              value={currentStats.outfits}
              icon={Shirt}
              description="Item di semua wardrobe"
              colorClass="text-blue-600"
              bgGradient="from-blue-50 to-sky-100"
              trend="up"
              trendValue="+12%"
            />
            <StatCard
              title="Total Likes"
              value={currentStats.likes}
              icon={Heart}
              description="Likes di postingan inspirasi"
              colorClass="text-red-500"
              bgGradient="from-red-50 to-rose-100"
              trend="up"
              trendValue="+8%"
            />
            <StatCard
              title="Pengikut"
              value={currentStats.followers}
              icon={Users2}
              description="Pengikut di komunitas"
              colorClass="text-purple-600"
              bgGradient="from-purple-50 to-violet-100"
              trend="up"
              trendValue="+15%"
            />
            <StatCard
              title="Mengikuti"
              value={currentStats.following}
              icon={Users2}
              description="Pengguna yang Anda ikuti"
              colorClass="text-green-600"
              bgGradient="from-green-50 to-emerald-100"
              trend="up"
              trendValue="+5%"
            />
          </>
        )}
      </div>

      {/* Additional Statistics Row */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-700">
                Outfit Minggu Ini
              </CardTitle>
              <Target className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-800 mb-2">5/7</div>
            <Progress value={71} className="h-2 mb-2" />
            <p className="text-xs text-orange-600">71% target tercapai</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-emerald-700">
                Style Score
              </CardTitle>
              <Award className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-800 mb-2">87</div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              Excellent
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-violet-50 to-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-violet-700">
                Inspirasi Dibuat
              </CardTitle>
              <Lightbulb className="h-5 w-5 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-800 mb-2">12</div>
            <p className="text-xs text-violet-600">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Latest Inspiration - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Inspirasi Terbaru Untukmu
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Outfit trending yang mungkin cocok dengan style Anda
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  Trending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <LatestInspiration />
              <Link to="/dashboard/inspiration">
                <Button
                  variant="outline"
                  className="mt-6 w-full border-blue-200 hover:bg-blue-50 text-blue-700 font-medium"
                >
                  Lihat Semua Inspirasi
                  <Eye className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Wardrobe Items - Takes 1 column */}
        <div>
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-slate-600" />
                Pakaian Terbaru
              </CardTitle>
              <CardDescription className="text-slate-600">
                Item terbaru di wardrobe Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PopularWardrobeItems />
              <Link to="/dashboard/wardrobe">
                <Button
                  variant="outline"
                  className="mt-6 w-full border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
                >
                  Lihat Semua Pakaian
                  <Shirt className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <Card className="shadow-lg border-0 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl text-amber-800 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Pencapaian Anda
            </CardTitle>
            <CardDescription className="text-amber-700">
              Unlock achievement dengan terus menggunakan aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <AchievementCard
                title="Fashion Enthusiast"
                description="Tambahkan 10 item ke wardrobe"
                icon={Shirt}
                isUnlocked={true}
              />
              <AchievementCard
                title="Style Influencer"
                description="Dapatkan 50 likes di inspirasi"
                icon={Heart}
                isUnlocked={true}
              />
              <AchievementCard
                title="Trend Setter"
                description="Buat 5 inspirasi outfit"
                icon={TrendingUp}
                isUnlocked={false}
              />
              <AchievementCard
                title="Community Builder"
                description="Dapatkan 100 followers"
                icon={Users2}
                isUnlocked={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div>
        <Card className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarCheck2 className="h-6 w-6" />
              Siap Merencanakan Outfit Hari Ini?
            </CardTitle>
            <CardDescription className="text-blue-100">
              Gunakan Outfit Planner untuk mengatur style Anda setiap hari dan
              tampil percaya diri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard/planner" className="flex-1">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg"
                >
                  Buka Outfit Planner
                  <CalendarCheck2 className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard/inspiration" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white text-blue-600 hover:bg-white hover:text-blue-700 font-semibold"
                >
                  Cari Inspirasi
                  <Lightbulb className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
