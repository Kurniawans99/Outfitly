import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { format } from "date-fns";
// import { id } from 'date-fns/locale/id'; // Jika ingin format tanggal bahasa Indonesia
import {
  ProfileDataState,
  UserStatsState,
  ApiUserData,
  UpdateProfilePayload,
} from "../profile.types";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadAvatar,
  uploadCoverPhoto,
} from "../services/profileService";

const initialProfileData: ProfileDataState = {
  name: "",
  username: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  joinDate: "",
  website: "",
  instagram: "",
  twitter: "",
  avatarUrl: "/api/placeholder/128/128", // Placeholder default
  coverPhotoUrl: "/api/placeholder/800/200", // Placeholder default
};

const initialStats: UserStatsState = {
  outfits: 0,
  followers: 0,
  following: 0,
  likes: 0,
};

export const useUserProfile = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("about");
  const [profileData, setProfileData] = useState<ProfileDataState>(initialProfileData);
  const [editData, setEditData] = useState<ProfileDataState>(initialProfileData);
  const [stats, setStats] = useState<UserStatsState>(initialStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<false | 'avatar' | 'cover'>(false); // Untuk status upload

  const mapApiUserDataToProfileData = useCallback((userData: ApiUserData, currentProfileData?: ProfileDataState): ProfileDataState => {
    return {
      name: userData.name || "",
      username: userData.username || "",
      email: userData.email || "",
      phone: userData.phone || "",
      location: userData.location || "",
      bio: userData.bio || "",
      joinDate: userData.createdAt
        ? format(new Date(userData.createdAt), "MMMM yyyy") 
        : currentProfileData?.joinDate || "N/A", 
      website: userData.socialMedia?.website || "",
      instagram: userData.socialMedia?.instagram || "",
      twitter: userData.socialMedia?.twitter || "",
      avatarUrl: userData.avatar?.url || currentProfileData?.avatarUrl || initialProfileData.avatarUrl,
      coverPhotoUrl: userData.coverPhoto?.url || currentProfileData?.coverPhotoUrl || initialProfileData.coverPhotoUrl,
    };
  }, []);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await fetchUserProfile();
      const formattedProfile = mapApiUserDataToProfileData(userData);
      setProfileData(formattedProfile);
      setEditData({ ...formattedProfile }); // Inisialisasi editData setelah fetch
      setStats({
        outfits: userData.stats?.totalOutfits || 0,
        followers: userData.stats?.followersCount || 0,
        following: userData.stats?.followingCount || 0,
        likes: userData.stats?.totalLikes || 0,
      });
    } catch (err: any) {
      console.error("Fetch profile error in hook:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [mapApiUserDataToProfileData]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData }); // Selalu reset editData dari profileData saat mulai edit
  };

  const handleSave = async () => {
    setError(null);
    setIsLoading(true); // Menunjukkan proses loading saat menyimpan

    const payload: UpdateProfilePayload = {
      name: editData.name,
      username: editData.username,
      email: editData.email,
      phone: editData.phone,
      location: editData.location,
      bio: editData.bio,
      socialMedia: {
        instagram: editData.instagram,
        twitter: editData.twitter,
        website: editData.website,
      },
    };

    try {
      const updatedUserData = await updateUserProfile(payload);
      const updatedProfile = mapApiUserDataToProfileData(updatedUserData, profileData);
      setProfileData(updatedProfile);
      setEditData({ ...updatedProfile }); // Update editData juga setelah save berhasil
      setIsEditing(false);
    } catch (err: any) {
      console.error("Update profile error in hook:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData }); // Kembalikan editData ke profileData saat ini
    setError(null);
  };

  const handleInputChange = (
    field: keyof ProfileDataState,
    value: string
  ) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(type);
    setError(null);
    try {
      let newUrl = '';
      if (type === 'avatar') {
        const result = await uploadAvatar(file);
        newUrl = result.url;
        setProfileData(prev => ({ ...prev, avatarUrl: newUrl }));
        setEditData(prev => ({ ...prev, avatarUrl: newUrl })); // Update juga di editData
      } else if (type === 'cover') {
        const result = await uploadCoverPhoto(file);
        newUrl = result.url;
        setProfileData(prev => ({ ...prev, coverPhotoUrl: newUrl }));
        setEditData(prev => ({ ...prev, coverPhotoUrl: newUrl })); // Update juga di editData
      }
      
    } catch (err: any) {
      console.error(`${type} upload error:`, err);
      setError(`Failed to upload ${type}: ${err.message}`);
    } finally {
      setIsUploading(false);
      event.target.value = ""; // Reset input file
    }
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event, 'avatar');
  };

  const handleCoverPhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event, 'cover');
  };


  return {
    isEditing,
    activeTab,
    profileData,
    editData,
    stats,
    isLoading,
    error,
    isUploading,
    setActiveTab,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleAvatarUpload,
    handleCoverPhotoUpload,
    reloadProfile: loadProfile, // Eksport fungsi untuk reload jika diperlukan dari luar
  };
};