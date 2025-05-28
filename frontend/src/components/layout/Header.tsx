import { Search, Bell, UserCircle, Menu } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Untuk sidebar mobile

// Anda bisa meng-import Sidebar lagi atau membuat versi mobile-nya
// import { SidebarMobile } from './SidebarMobile';

export function Header({
  setMobileSidebarOpen,
}: {
  setMobileSidebarOpen: (open: boolean) => void;
}) {
  return (
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

      <div className="flex-1 relative hidden md:block">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          type="search"
          placeholder="Cari pakaian, inspirasi..."
          className="pl-8 sm:w-full md:w-1/3 lg:w-1/2 bg-slate-50"
        />
      </div>

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
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Keluar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
