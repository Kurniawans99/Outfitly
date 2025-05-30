export interface ProfileDataState {
  name: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
  website: string;
  instagram: string;
  twitter: string;
  avatarUrl: string;
  coverPhotoUrl: string;
}

export interface UserStatsState {
  outfits: number;
  followers: number;
  following: number;
  likes: number;
}

export interface OutfitData {
  id: number;
  image: string;
  title: string;
  likes: number;
  views: number;
}

// Tipe dari API Response
export interface ApiUserSocialMedia {
  instagram?: string;
  twitter?: string;
  tiktok?: string; 
  website?: string;
}

export interface ApiUserAvatar {
  url?: string;
  publicId?: string;
}

export interface ApiUserStats {
  totalOutfits?: number;
  followersCount?: number;
  followingCount?: number;
  totalLikes?: number;
  totalViews?: number;
  avgLikesPerOutfit?: number;
}

export interface ApiUserData {
  _id: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: ApiUserAvatar;
  coverPhoto?: ApiUserAvatar;
  createdAt: string;
  socialMedia?: ApiUserSocialMedia;
  stats?: ApiUserStats;
  // stylePreferences?: any; 
 
}

export interface ApiResponse<T = ApiUserData> { 
  success: boolean;
  user?: T;
  message?: string;
}

// Payload untuk update profile
export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

// Props umum untuk input yang bisa diedit
export interface EditableFieldProps<T extends keyof ProfileDataState> {
  isEditing: boolean;
  value: ProfileDataState[T];
  editValue: ProfileDataState[T];
  field: T;
  onChange: (field: T, value: string) => void;
  placeholder?: string;
  multiline?: boolean; 
  inputType?: string; 
  icon?: React.ReactNode; 
  label?: string; 
  className?: string; 
  viewClassName?: string; 
  inputClassName?: string; 
}