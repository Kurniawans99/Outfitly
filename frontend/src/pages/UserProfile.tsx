// src/components/features/profile/UserProfilePage.tsx
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileLoadingSkeleton } from "@/components/ui/features/profiles/components/LoadingSkeleton";
import { ProfileHeader } from "@/components/ui/features/profiles/components/ProfileHeader";
import { ProfileStats } from "@/components/ui/features/profiles/components/ProfileStats";
import { AboutTab } from "@/components/ui/features/profiles/components/AboutTab";
import { OutfitsTab } from "@/components/ui/features/profiles/components/OutfitsTab";
import { ActivityTab } from "@/components/ui/features/profiles/components/ActivityTab";
import { ProfileSidebar } from "@/components/ui/features/profiles/components/ProfileSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { ProfileDataState } from "@/services/profile/profile.types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UserProfilePage = () => {
  const {
    isEditing,
    activeTab,
    profileData,
    editData,
    stats,
    isLoading,
    isUploading,
    setActiveTab,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleAvatarUpload,
    handleCoverPhotoUpload,
  } = useUserProfile();

  if (isLoading && !profileData.name) {
    return <ProfileLoadingSkeleton />;
  }

  const handleHeaderInputChange = (
    field: "name" | "username",
    value: string
  ) => {
    handleInputChange(field, value);
  };

  const handleAboutTabInputChange = (
    field: keyof Omit<
      ProfileDataState,
      "avatarUrl" | "coverPhotoUrl" | "joinDate" | "name" | "username"
    >,
    value: string
  ) => {
    handleInputChange(field, value);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          {" "}
          <Link to="/dashboard">
            {/* === PERUBAHAN WARNA DI SINI === */}
            <Button
              variant="outline"
              className="flex items-center group bg-sky-600 hover:bg-sky-700 hover:text-white text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 ease-in-out group-hover:-translate-x-1" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>

        <ProfileHeader
          profileData={profileData}
          editData={editData}
          isEditing={isEditing}
          isUploading={isUploading}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onInputChange={handleHeaderInputChange}
          onAvatarUpload={handleAvatarUpload}
          onCoverPhotoUpload={handleCoverPhotoUpload}
        />

        <ProfileStats stats={stats} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border border-slate-200 p-1 h-auto">
            {/* === PERUBAHAN WARNA DI SINI === */}
            <TabsTrigger
              value="about"
              className="py-2 data-[state=active]:bg-sky-600 data-[state=active]:text-white"
            >
              Tentang
            </TabsTrigger>
            <TabsTrigger
              value="outfits"
              className="py-2 data-[state=active]:bg-sky-600 data-[state=active]:text-white"
            >
              My Outfits
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="py-2 data-[state=active]:bg-sky-600 data-[state=active]:text-white"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <TabsContent value="about">
                <AboutTab
                  profileData={profileData}
                  editData={editData}
                  isEditing={isEditing}
                  onInputChange={handleAboutTabInputChange}
                />
              </TabsContent>
              <TabsContent value="outfits">
                <OutfitsTab />
              </TabsContent>
              <TabsContent value="activity">
                <ActivityTab />
              </TabsContent>
            </div>
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;
