// === PERUBAHAN DI SINI: Impor useState dan useEffect ===
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Search, User, Menu, LogOut, Shirt, Sparkles } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItems = [
  { href: "/dashboard/overview", label: "Overview" },
  { href: "/dashboard/wardrobe", label: "Wardrobe" },
  { href: "/dashboard/inspiration", label: "Inspiration" },
  { href: "/dashboard/planner", label: "Planner" },
  { href: "/dashboard/community", label: "Community" },
  { href: "/dashboard/ai", label: "Ask AI", isSpecial: true },
];

export function Header() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // === PERUBAHAN DI SINI: State untuk melacak posisi scroll ===
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // === PERUBAHAN DI SINI: Efek untuk menambahkan event listener scroll ===
  useEffect(() => {
    const handleScroll = () => {
      // Set state menjadi true jika scroll Y lebih dari 10px, false jika tidak
      setIsScrolled(window.scrollY > 10);
    };

    // Tambahkan event listener saat komponen di-mount
    window.addEventListener("scroll", handleScroll);

    // Hapus event listener saat komponen di-unmount untuk mencegah memory leak
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Array dependensi kosong agar efek ini hanya berjalan sekali

  const handleProfileNavigation = () => navigate("/profile");
  const handleLogoutInitiate = () => setShowLogoutConfirm(true);

  const performActualLogout = () => {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/signin");
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* === PERUBAHAN DI SINI: className dibuat dinamis === */}
      <header
        className={`
          sticky top-0 z-50 flex h-16 items-center justify-between gap-4 px-4 transition-all duration-300 md:px-6
          ${
            isScrolled
              ? "border-b border-border bg-background/70 backdrop-blur-xl"
              : "border-b border-transparent"
          }
        `}
      >
        {/* Kiri: Logo & Navigasi Mobile */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold text-lg text-primary"
          >
            <Shirt className="h-6 w-6" />
            <span className="hidden sm:inline-block">Outfitly</span>
          </Link>
        </div>

        {/* Tengah: Navigasi Desktop (tidak ada perubahan) */}
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`transition-colors hover:text-foreground ${
                location.pathname.startsWith(item.href)
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {item.isSpecial ? (
                <div className="flex items-center gap-1">
                  {item.label} <Sparkles className="h-4 w-4 text-sky-500" />
                </div>
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>

        {/* Kanan: Aksi & Profil (tidak ada perubahan) */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleProfileNavigation}
                className="cursor-pointer"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleLogoutInitiate}
                className="text-red-500 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tombol Menu Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                    {item.isSpecial && (
                      <Sparkles className="h-4 w-4 text-sky-500" />
                    )}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
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
