// src/components/layout/Header.tsx

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Bell,
  UserCircle,
  Menu,
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  Shirt,
  Lightbulb,
  CalendarDays,
  Users,
  Bot,
  Sparkles,
  X, // Import ikon X untuk tombol close
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Pindahkan navItems dari Sidebar.tsx ke sini
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

export function Header() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State untuk menu mobile
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileNavigation = () => navigate("/profile");
  const handleSettingsNavigation = () => navigate("/dashboard/settings");
  const handleLogoutInitiate = () => setShowLogoutConfirm(true);

  const performActualLogout = () => {
    localStorage.removeItem("authToken");
    if (axios.defaults.headers.common["Authorization"]) {
      delete axios.defaults.headers.common["Authorization"];
    }
    navigate("/signin");
    setShowLogoutConfirm(false);
  };

  // Fungsi untuk menutup menu mobile saat link diklik
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* === PERUBAHAN DI SINI === */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          {/* Logo dan Navigasi Utama */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-2xl font-extrabold text-foreground hover:text-indigo-600 transition-colors duration-200"
              onClick={handleMobileLinkClick}
            >
              Outfitly
            </Link>

            {/* Navigasi Desktop */}
            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                    location.pathname.startsWith(item.href)
                      ? "text-indigo-600"
                      : "text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Ikon Aksi dan Menu Pengguna */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-slate-600" />
              <span className="sr-only">Cari</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="sr-only">Notifikasi</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="h-6 w-6 text-slate-600" />
                  <span className="sr-only">Menu Pengguna</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleProfileNavigation}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={handleSettingsNavigation}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleLogoutInitiate}
                  className="text-red-600 hover:!text-red-600 hover:!bg-red-50 focus:!text-red-600 focus:!bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tombol Menu Mobile */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>

        {/* Menu Tampilan Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleMobileLinkClick}
                >
                  <Button
                    variant={
                      location.pathname.startsWith(item.href)
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-start text-base"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Dialog Konfirmasi Logout (tidak ada perubahan) */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun Anda? Sesi Anda akan
              diakhiri.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutConfirm(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={performActualLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
