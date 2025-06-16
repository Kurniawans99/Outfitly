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
import WardrobeDetailPage from "./components/wardrobe/WardrobeDetailPage";

// === PERUBAHAN DI SINI ===
// Layout Utama untuk Halaman Dashboard disederhanakan
function DashboardLayout() {
  return (
    // Ubah `bg-slate-50` menjadi `bg-background`
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route path="/" element={<LandingPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<DashboardOverviewPage />} />
              {/* --- MODIFIED ROUTE --- */}
              <Route path="wardrobe" element={<WardrobePage />} />
              {/* --- NEW ROUTE --- */}
              <Route
                path="wardrobe/:wardrobeId"
                element={<WardrobeDetailPage />}
              />
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
