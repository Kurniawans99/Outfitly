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
import {
  Shirt,
  Lightbulb,
  CalendarCheck2,
  Users2,
  PlusCircle,
} from "lucide-react";

// Komponen kecil untuk kartu statistik
const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  colorClass = "text-sky-600",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  colorClass?: string;
}) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-600">
        {title}
      </CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      {description && (
        <p className="text-xs text-slate-500 pt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export function DashboardOverviewPage() {
  // Data dummy, nantinya akan dari state atau API
  const stats = {
    totalPakaian: 78,
    outfitTersimpan: 12,
    inspirasiDilihat: 120,
    temanKomunitas: 5,
  };

  return (
    <PageWrapper
      title="Dashboard Overview"
      actions={
        <Link to="/dashboard/wardrobe/add">
          <Button className="bg-sky-600 hover:bg-sky-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pakaian
          </Button>
        </Link>
      }
    >
      {/* Bagian Statistik Utama */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Pakaian"
          value={`${stats.totalPakaian}`}
          icon={Shirt}
          description="+5 minggu ini"
          colorClass="text-blue-600"
        />
        <StatCard
          title="Outfit Tersimpan"
          value={`${stats.outfitTersimpan}`}
          icon={CalendarCheck2}
          description="+2 minggu ini"
          colorClass="text-green-600"
        />
        <StatCard
          title="Inspirasi Dilihat"
          value={`${stats.inspirasiDilihat}`}
          icon={Lightbulb}
          description="Popularitas meningkat"
          colorClass="text-yellow-500"
        />
        <StatCard
          title="Koneksi Komunitas"
          value={`${stats.temanKomunitas}`}
          icon={Users2}
          description="Temukan teman baru"
          colorClass="text-purple-600"
        />
      </div>

      {/* Bagian Lain (Contoh: Inspirasi Terbaru, Pakaian Sering Dipakai) */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-700">
              Inspirasi Terbaru Untukmu
            </CardTitle>
            <CardDescription>
              Outfit yang mungkin kamu suka berdasarkan gayamu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder untuk konten inspirasi */}
            <div className="flex flex-col space-y-3">
              <div className="h-20 bg-slate-100 rounded-md animate-pulse"></div>
              <div className="h-20 bg-slate-100 rounded-md animate-pulse"></div>
              <div className="h-20 bg-slate-100 rounded-md animate-pulse"></div>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              Lihat Semua Inspirasi
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-700">
              Pakaian Terpopuler
            </CardTitle>
            <CardDescription>
              Item dari wardrobe-mu yang sering muncul di outfit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder untuk pakaian terpopuler */}
            <div className="flex flex-col space-y-3">
              <div className="h-16 bg-slate-100 rounded-md animate-pulse"></div>
              <div className="h-16 bg-slate-100 rounded-md animate-pulse"></div>
              <div className="h-16 bg-slate-100 rounded-md animate-pulse"></div>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              Lihat Semua Pakaian
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bagian Quick Actions / Call to Action */}
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              Siap Merencanakan Outfit?
            </CardTitle>
            <CardDescription className="text-sky-100">
              Gunakan Outfit Planner untuk mengatur gayamu setiap hari.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/planner">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-sky-700 hover:bg-slate-100 font-semibold"
              >
                Buka Outfit Planner
                <CalendarCheck2 className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
