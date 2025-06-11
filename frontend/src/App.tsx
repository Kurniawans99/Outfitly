// src/App.tsx

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
import AskAI from "./pages/AskAI";

// Hapus import Sidebar karena tidak digunakan lagi
// import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { DashboardOverviewPage } from "./pages/Dashboard";
import { PlaceholderPage } from "./components/ui/place-holder";

import { Toaster } from "@/components/ui/sonner";
// Hapus import Sheet dan useState karena tidak digunakan lagi
// import { Sheet, SheetContent } from "@/components/ui/sheet";
// import { useState } from "react";

import { ProtectedRoute, PublicRoute } from "./components/auth/ProtectedRoutes";
import WardrobePage from "./pages/WardrobePage";
import { CommunityPage } from "./pages/CommunityPage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { OutfitPlannerPage } from "./pages/OutfitPlannerPage";
import { InspirationPage } from "./pages/InspirationPage";

// === PERUBAHAN DI SINI ===
// Layout Utama untuk Halaman Dashboard disederhanakan
function DashboardLayout() {
  // State `mobileSidebarOpen` tidak lagi diperlukan
  // const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    // Hapus flex, karena layout sekarang lebih sederhana (top-down)
    <div className="min-h-screen bg-slate-100">
      {/* Hapus Sidebar dan Sheet */}
      {/* Header tidak lagi memerlukan prop `setMobileSidebarOpen` */}
      <Header />
      {/* Hapus `flex-1 flex flex-col` dan `md:ml-64` dari wrapper main.
        Biarkan <Outlet/> dirender langsung di dalam <main>.
      */}
      <main className="container max-w-screen-2xl">
        <div className="px-4 pb-4 pt-8 md:px-8 md:pb-8 md:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Rute tidak berubah */}
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route path="/" element={<LandingPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<DashboardOverviewPage />} />
              <Route path="wardrobe" element={<WardrobePage />} />
              <Route path="inspiration" element={<InspirationPage />} />
              <Route path="planner" element={<OutfitPlannerPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="ai" element={<AskAI />} />
              <Route
                path="settings"
                element={<PlaceholderPage title="Pengaturan Akun" />}
              />
              <Route path="post/:postId" element={<PostDetailPage />} />
            </Route>
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          <Route path="*" element={<PathError />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
