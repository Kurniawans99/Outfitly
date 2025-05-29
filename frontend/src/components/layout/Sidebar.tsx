import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shirt,
  Lightbulb,
  CalendarDays,
  Users,
  Settings,
  PackagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/wardrobe", label: "Manajemen Pakaian", icon: Shirt },
  {
    href: "/dashboard/inspiration",
    label: "Inspirasi Outfit",
    icon: Lightbulb,
  },
  { href: "/dashboard/planner", label: "Outfit Planner", icon: CalendarDays },
  { href: "/dashboard/community", label: "Komunitas", icon: Users },
];

const settingsItem = {
  href: "/dashboard/settings",
  label: "Pengaturan",
  icon: Settings,
};

export function Sidebar() {
  const location = useLocation(); // Untuk menyorot item aktif

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-slate-50 border-r border-slate-200 min-h-screen p-4">
      <div className="mb-8 text-center">
        {/* Ganti dengan logo Anda */}
        <Link to="/dashboard" className="text-2xl font-bold text-slate-800">
          Outfitly
        </Link>
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link to={item.href}>
                <Button
                  variant={
                    location.pathname === item.href ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tombol Aksi Cepat di Sidebar */}
      <div className="mt-auto mb-4">
        <Link to="/dashboard/wardrobe/add">
          {" "}
          {/* Sesuaikan path jika halaman tambah pakaian Anda berbeda */}
          <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">
            <PackagePlus className="mr-2 h-4 w-4" />
            Tambah Pakaian
          </Button>
        </Link>
      </div>

      <div>
        <Link to={settingsItem.href}>
          <Button
            variant={
              location.pathname === settingsItem.href ? "secondary" : "ghost"
            }
            className="w-full justify-start"
          >
            <settingsItem.icon className="mr-2 h-4 w-4" />
            {settingsItem.label}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
