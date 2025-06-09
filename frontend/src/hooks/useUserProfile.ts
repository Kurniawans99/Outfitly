import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner"; 
import {
  ProfileDataState,
  UserStatsState,
  ApiUserData,
  UpdateProfilePayload,
} from "../services/profile/profile.types";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadAvatar,
  uploadCoverPhoto,
} from "../services/profile/profileService";

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
  avatarUrl: "/api/placeholder/128/128", 
  coverPhotoUrl: "/api/placeholder/800/200",
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
  // 2. Hapus state 'error' karena akan digantikan oleh toast
  // const [error, setError] = useState<string | null>(null); 
  const [isUploading, setIsUploading] = useState<false | 'avatar' | 'cover'>(false);

  // ... (mapApiUserDataToProfileData tetap sama) ...
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
    // setError(null); // Hapus ini
    try {
      const userData = await fetchUserProfile();
      const formattedProfile = mapApiUserDataToProfileData(userData);
      setProfileData(formattedProfile);
      setEditData({ ...formattedProfile });
      setStats({
        outfits: userData.stats?.totalOutfits || 0,
        followers: userData.stats?.followersCount || 0,
        following: userData.stats?.followingCount || 0,
        likes: userData.stats?.totalLikes || 0,
      });
    } catch (err: any) {
      console.error("Fetch profile error in hook:", err);
      // 3. Tampilkan toast error jika gagal memuat profil
      toast.error("Gagal memuat profil.", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [mapApiUserDataToProfileData]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    setIsLoading(true);

    const payload: UpdateProfilePayload = {
      // ... payload
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
      setEditData({ ...updatedProfile });
      setIsEditing(false);
      // 4. Tampilkan toast sukses setelah berhasil menyimpan
      toast.success("Profil berhasil diperbarui!");
    } catch (err: any) {
      console.error("Update profile error in hook:", err);
      // 5. Tampilkan toast error jika gagal menyimpan
      toast.error("Gagal memperbarui profil." + ";" + ` ${err.message}`);
      
      } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
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
    const toastId = toast.loading(`Mengunggah ${type}...`); // Tampilkan toast loading

    try {
      let newUrl = '';
      if (type === 'avatar') {
        const result = await uploadAvatar(file);
        newUrl = result.url;
        setProfileData(prev => ({ ...prev, avatarUrl: newUrl }));
        setEditData(prev => ({ ...prev, avatarUrl: newUrl }));
      } else if (type === 'cover') {
        const result = await uploadCoverPhoto(file);
        newUrl = result.url;
        setProfileData(prev => ({ ...prev, coverPhotoUrl: newUrl }));
        setEditData(prev => ({ ...prev, coverPhotoUrl: newUrl }));
      }
      // 6. Tampilkan toast sukses setelah berhasil upload
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Foto sampul'} berhasil diunggah!`, { id: toastId });
      
    } catch (err: any) {
      console.error(`${type} upload error:`, err);
      // 7. Tampilkan toast error jika gagal upload
      toast.error(`Gagal mengunggah ${type}.`, {
        id: toastId,
        description: err.message,
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
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
    isUploading,
    setActiveTab,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleAvatarUpload,
    handleCoverPhotoUpload,
    reloadProfile: loadProfile,
  };
};