import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shirt,
  Lightbulb,
  CalendarDays,
  Users,
  Settings,
  PackagePlus,
  Bot,
  Sparkles,
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
  { href: "/dashboard/ai", label: "Ask AI Fashion", icon: Bot },
  { href: "/dashboard/community", label: "Komunitas", icon: Users },
];

const settingsItem = {
  href: "/dashboard/settings",
  label: "Pengaturan",
  icon: Settings,
};

export function Sidebar() {
  const location = useLocation();

  return (
    // === PERUBAHAN DI SINI ===
    <aside className="hidden md:flex md:flex-col md:w-64 bg-sidebar border-r border-sidebar-border h-screen md:fixed top-0 left-0 p-4">
      <div className="mb-8 text-center">
        <Link to="/dashboard" className="text-2xl font-bold text-foreground">
          Outfitly
        </Link>
      </div>

      {/* Tambahkan overflow-y-auto agar list menu bisa scroll jika tidak muat */}
      <nav className="flex-grow overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link to={item.href}>
                <Button
                  variant={
                    location.pathname.startsWith(item.href)
                      ? "secondary"
                      : "ghost"
                  }
                  className={`w-full justify-start ${
                    item.href === "/dashboard/ai"
                      ? "hover:bg-gradient-to-r hover:from-sky-50 hover:to-purple-50 hover:text-sky-700"
                      : ""
                  }`}
                >
                  {item.href === "/dashboard/ai" ? (
                    <div className="flex items-center">
                      <div className="p-1 bg-gradient-to-r from-sky-500 to-purple-600 rounded mr-2">
                        <item.icon className="h-3 w-3 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent font-medium">
                        {item.label}
                      </span>
                      <Sparkles className="ml-1 h-3 w-3 text-sky-500" />
                    </div>
                  ) : (
                    <>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </>
                  )}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

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
