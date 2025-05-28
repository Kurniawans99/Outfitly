import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PathError from "./pages/PathError";
import LandingPage from "./pages/LandingPage";

import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { DashboardOverviewPage } from "./pages/Dashboard";
import { PlaceholderPage } from "./components/ui/place-holder";

import { Toaster } from "@/components/ui/sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";

// Layout Utama untuk Halaman Dashboard
function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Logika untuk autentikasi pengguna bisa ditambahkan di sini

  // Asumsi: Anda akan memiliki logika untuk memeriksa apakah pengguna terautentikasi
  // const isAuthenticated = true; // Ganti dengan logika autentikasi Anda

  // if (!isAuthenticated) {
  //   return <Navigate to="/signin" replace />;
  // }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar untuk Desktop */}
      <Sidebar />

      {/* Sidebar untuk Mobile menggunakan Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-64 md:hidden bg-slate-50 border-r border-slate-200"
        >
          {/* Anda bisa membuat versi Sidebar yang lebih ringkas untuk mobile atau menggunakan yang sama */}
          {/* Pastikan Sidebar bisa menutup sheet saat item diklik jika perlu */}
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col">
        <Header setMobileSidebarOpen={setMobileSidebarOpen} />{" "}
        {/* Header menerima prop untuk toggle sidebar mobile */}
        <main className="flex-1 overflow-y-auto">
          {/* Konten halaman dashboard akan dirender di sini */}
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik  */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Rute Landing Page */}
        {<Route path="/" element={<LandingPage />} />}

        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Halaman default saat mengunjungi /dashboard */}
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverviewPage />} />
          <Route
            path="wardrobe"
            element={<PlaceholderPage title="Manajemen Pakaian" />}
          />
          {/* Contoh jika ada sub-rute, misal halaman tambah pakaian */}
          {/* <Route path="wardrobe/add" element={<AddPakaianPage />} />  */}
          <Route
            path="inspiration"
            element={<PlaceholderPage title="Inspirasi Outfit" />}
          />
          <Route
            path="planner"
            element={<PlaceholderPage title="Outfit Planner" />}
          />
          <Route
            path="community"
            element={<PlaceholderPage title="Komunitas" />}
          />
          <Route
            path="settings"
            element={<PlaceholderPage title="Pengaturan Akun" />}
          />
        </Route>

        {/* Rute 404 (jika path sama sekali tidak cocok) */}
        <Route path="*" element={<PathError />} />
      </Routes>
    </Router>
  );
}

export default App;
