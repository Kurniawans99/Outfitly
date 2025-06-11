// src/components/features/profile/components/AboutTab.tsx
import React, { ChangeEvent } from "react";
import { ProfileDataState } from "@/services/profile/profile.types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";

interface AboutTabProps {
  profileData: ProfileDataState;
  editData: ProfileDataState;
  isEditing: boolean;
  onInputChange: (
    field: keyof Omit<
      ProfileDataState,
      "avatarUrl" | "coverPhotoUrl" | "joinDate" | "name" | "username"
    >,
    value: string
  ) => void;
}

const InfoItem: React.FC<{
  icon: React.ReactNode;
  isEditing: boolean;
  label?: string;
  value: string | undefined;
  editValue: string | undefined;
  field?: keyof ProfileDataState;
  onChange?: (value: string) => void;
  placeholder?: string;
  isLink?: boolean;
  inputType?: string;
}> = ({
  icon,
  isEditing,
  value,
  editValue,
  field,
  onChange,
  placeholder,
  isLink,
  inputType,
}) => {
  const displayValue = isEditing && field ? editValue : value;
  return (
    <div className="flex items-center gap-3 text-slate-600">
      {icon}
      {isEditing && field && onChange ? (
        <Input
          type={inputType || "text"}
          value={editValue || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-slate-50 border-slate-300 rounded px-2 py-1 flex-1 h-8"
        />
      ) : isLink && displayValue ? (
        <a
          href={
            displayValue && !displayValue.startsWith("http")
              ? `http://${displayValue}`
              : displayValue
          }
          target="_blank"
          rel="noopener noreferrer"
          // === PERUBAHAN WARNA DI SINI ===
          className="text-slate-600 hover:text-sky-600 break-all"
        >
          {displayValue || "Belum diatur"}
        </a>
      ) : (
        <span>{displayValue || "Belum diatur"}</span>
      )}
    </div>
  );
};

export const AboutTab: React.FC<AboutTabProps> = ({
  profileData,
  editData,
  isEditing,
  onInputChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tentang Saya</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editData.bio}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onInputChange("bio", e.target.value)
            }
            className="w-full h-24 bg-slate-50 border-slate-300 rounded-lg px-3 py-2 resize-none mb-6"
            placeholder="Ceritakan tentang gaya fashion Anda..."
          />
        ) : (
          <p className="text-slate-700 leading-relaxed mb-6">
            {profileData.bio || "Bio belum diisi."}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          {/* === PERUBAHAN WARNA DI SINI === */}
          <InfoItem
            icon={<MapPin className="w-4 h-4 text-sky-600" />}
            isEditing={isEditing}
            value={profileData.location}
            editValue={editData.location}
            field="location"
            onChange={(val) => onInputChange("location", val)}
            placeholder="Lokasi"
          />
          <InfoItem
            icon={<Calendar className="w-4 h-4 text-sky-600" />}
            isEditing={false}
            value={`Bergabung ${profileData.joinDate}`}
            editValue=""
          />
          <InfoItem
            icon={<Mail className="w-4 h-4 text-sky-600" />}
            isEditing={isEditing}
            value={profileData.email}
            editValue={editData.email}
            field="email"
            onChange={(val) => onInputChange("email", val)}
            placeholder="Email"
            inputType="email"
          />
          <InfoItem
            icon={<Phone className="w-4 h-4 text-sky-600" />}
            isEditing={isEditing}
            value={profileData.phone}
            editValue={editData.phone}
            field="phone"
            onChange={(val) => onInputChange("phone", val)}
            placeholder="Nomor Telepon"
            inputType="tel"
          />
        </div>

        <Separator className="my-6" />

        <div>
          <h4 className="font-medium text-slate-900 mb-3 text-md">
            Social Media & Website
          </h4>
          <div className="space-y-4">
            {/* Ikon sosial media sengaja tidak diubah untuk mempertahankan warna brand */}
            <InfoItem
              icon={<Instagram className="w-5 h-5 text-pink-600" />}
              isEditing={isEditing}
              value={profileData.instagram}
              editValue={editData.instagram}
              field="instagram"
              onChange={(val) => onInputChange("instagram", val)}
              placeholder="Username Instagram"
            />
            <InfoItem
              icon={<Twitter className="w-5 h-5 text-blue-600" />}
              isEditing={isEditing}
              value={profileData.twitter}
              editValue={editData.twitter}
              field="twitter"
              onChange={(val) => onInputChange("twitter", val)}
              placeholder="Username Twitter"
            />
            <InfoItem
              icon={<LinkIcon className="w-5 h-5 text-green-600" />}
              isEditing={isEditing}
              value={profileData.website}
              editValue={editData.website}
              field="website"
              onChange={(val) => onInputChange("website", val)}
              placeholder="URL Website Anda"
              isLink={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
