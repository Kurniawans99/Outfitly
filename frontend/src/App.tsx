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
import UserProfile from "./pages/UserProfile";

import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { DashboardOverviewPage } from "./pages/Dashboard";
import { PlaceholderPage } from "./components/ui/place-holder";

import { Toaster } from "@/components/ui/sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";

import { ProtectedRoute, PublicRoute } from "./components/auth/ProtectedRoutes";
import coba from "./pages/coba";

// Layout Utama untuk Halaman Dashboard (tetap sama)
function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  coba;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-64 md:hidden bg-slate-50 border-r border-slate-200"
        >
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex flex-col">
        <Header setMobileSidebarOpen={setMobileSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
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
        {/* Rute Publik (hanya tersedia jika user tidak terautentikasi) */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Rute Landing Page (Publik) */}
        <Route path="/" element={<LandingPage />} />

        {/* Rute Terlindungi */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Halaman default saat mengunjungi /dashboard */}
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverviewPage />} />
            <Route
              path="wardrobe"
              element={<PlaceholderPage title="Manajemen Pakaian" />}
            />
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
            {/* Tambahkan rute terlindungi lainnya di dalam sini jika perlu */}
          </Route>
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Rute 404 (jika path sama sekali tidak cocok) */}
        <Route path="*" element={<PathError />} />
      </Routes>
    </Router>
  );
}

export default App;
