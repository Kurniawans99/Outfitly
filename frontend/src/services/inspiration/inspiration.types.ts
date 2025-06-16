export interface Author {
  _id: string;
  name: string;
  avatar?: {
    url: string;
  };
}

export interface WardrobeItemReference {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: Author;
  likes: string[];
  createdAt: string;
}

export interface InspirationPost {
  _id: string;
  caption: string;
  author: Author;
  imageUrl: string;
  items: InspoItem[]; 
  tags: string[];
  likes: string[];
  saves: string[];
  comments: Comment[];
  likeCount: number;
  saveCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface InspoItem {
  _id: string;
  name: string;
  category: string;
  brand: string;
  imageUrl: string;
}

