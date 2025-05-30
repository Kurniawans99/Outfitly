// src/components/features/profile/components/ProfileHeader.tsx
import React, { ChangeEvent } from "react";
import { Camera, Edit3, Save, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Digunakan untuk input file
import { ProfileDataState } from "../profile.types";

interface ProfileHeaderProps {
  profileData: ProfileDataState;
  editData: ProfileDataState;
  isEditing: boolean;
  isUploading: false | "avatar" | "cover";
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (
    field: keyof Pick<ProfileDataState, "name" | "username">,
    value: string
  ) => void;
  onAvatarUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onCoverPhotoUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  editData,
  isEditing,
  isUploading,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onAvatarUpload,
  onCoverPhotoUpload,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 relative">
        <img
          src={editData.coverPhotoUrl} // Tampilkan editData.coverPhotoUrl agar perubahan terlihat langsung
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        {isEditing && (
          <Label
            htmlFor="coverPhotoInput"
            className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <Input
              id="coverPhotoInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onCoverPhotoUpload}
              disabled={isUploading === "cover"}
            />
          </Label>
        )}
        {isUploading === "cover" && (
          <p className="absolute top-4 left-4 text-white text-sm">
            Mengunggah sampul...
          </p>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={editData.avatarUrl} alt={profileData.name} />{" "}
                {/* Tampilkan editData.avatarUrl */}
                <AvatarFallback className="text-4xl">
                  {profileData.name
                    ? profileData.name.substring(0, 2).toUpperCase()
                    : "???"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Label
                  htmlFor="avatarInput"
                  className="absolute bottom-2 right-2 bg-white border border-slate-300 hover:border-slate-400 p-2 rounded-full transition-all shadow-sm cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-slate-600" />
                  <Input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarUpload}
                    disabled={isUploading === "avatar"}
                  />
                </Label>
              )}
              {isUploading === "avatar" && (
                <p className="absolute bottom-12 right-2 text-xs text-slate-600">
                  Mengunggah...
                </p>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 md:mb-4">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    type="text"
                    value={editData.name}
                    onChange={(e) => onInputChange("name", e.target.value)}
                    placeholder="Nama Lengkap"
                    className="text-2xl font-bold text-slate-900 bg-slate-50 border-slate-300 rounded-lg px-3 py-2 w-full md:w-80"
                  />
                  <Input
                    type="text"
                    value={editData.username}
                    onChange={(e) => onInputChange("username", e.target.value)}
                    placeholder="Username"
                    className="text-slate-600 bg-slate-50 border-slate-300 rounded-lg px-3 py-2 w-full md:w-60"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                    {profileData.name || "Nama Belum Diatur"}
                  </h1>
                  <p className="text-slate-600 font-medium">
                    {profileData.username
                      ? `@${profileData.username}`
                      : "Username Belum Diatur"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isUploading !== false}
                >
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
                <Button onClick={onSave} disabled={isUploading !== false}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={onEdit}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
