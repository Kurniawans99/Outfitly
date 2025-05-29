import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Bell,
  UserCircle,
  Menu,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

export function Header({
  setMobileSidebarOpen,
}: {
  setMobileSidebarOpen: (open: boolean) => void;
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  // --- Handler untuk Navigasi ke Halaman Profil ---
  const handleProfileNavigation = () => {
    console.log("DropdownMenuItem: Profil diklik");
    // TODO: Ganti dengan logika navigasi atau aksi profil Anda
    navigate("/dashboard/profile"); // Asumsi rute profil adalah /dashboard/profile
  };

  // --- Handler untuk Navigasi ke Halaman Pengaturan ---
  const handleSettingsNavigation = () => {
    // TODO: Ganti dengan logika navigasi atau aksi pengaturan Anda
    navigate("/dashboard/settings"); // Asumsi rute pengaturan adalah /dashboard/settings
  };

  // --- Handler untuk Memulai Proses Logout (Menampilkan Dialog) ---
  const handleLogoutInitiate = () => {
    setShowLogoutConfirm(true);
  };

  // --- Fungsi untuk Melakukan Logout Aktual ---
  const performActualLogout = () => {
    localStorage.removeItem("authToken");

    if (axios.defaults.headers.common["Authorization"]) {
      delete axios.defaults.headers.common["Authorization"];
    }

    // 3. Arahkan pengguna ke halaman login
    navigate("/signin");

    // 4. Tutup dialog
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 md:px-8">
        {/* Tombol Menu untuk Mobile */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Input Pencarian */}
        <div className="flex-1 relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Cari pakaian, inspirasi..."
            className="pl-8 sm:w-full md:w-1/3 lg:w-1/2 bg-slate-50"
          />
        </div>

        {/* Ikon Aksi dan Menu Pengguna */}
        <div className="flex items-center gap-4 ml-auto">
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

              {/* Item Menu Profil */}
              <DropdownMenuItem
                onSelect={handleProfileNavigation}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>

              {/* Item Menu Pengaturan */}
              <DropdownMenuItem
                onSelect={handleSettingsNavigation}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>

              {/* Tambahkan DropdownMenuItem lain di sini jika perlu */}
              {/* Contoh:
              <DropdownMenuItem onSelect={() => console.log("Bantuan diklik")}>
                Bantuan
              </DropdownMenuItem>
              */}

              <DropdownMenuSeparator />

              {/* Item Menu Keluar */}
              <DropdownMenuItem
                onSelect={handleLogoutInitiate}
                className="text-red-600 hover:!text-red-600 hover:!bg-red-50 focus:!text-red-600 focus:!bg-red-50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Dialog Konfirmasi Logout */}
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
