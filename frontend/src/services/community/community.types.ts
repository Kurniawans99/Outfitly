// Tipe data untuk penulis, digunakan di Post dan Reply
export interface Author {
  _id: string;
  name: string;
  username: string;
  avatar?: {
    url: string;
  };
}

// Tipe data untuk satu balasan
export interface Reply {
  _id: string;
  content: string;
  author: Author;
  likes: string[]; // Array of user IDs
  createdAt: string;
  updatedAt: string;
}

// Tipe data untuk satu postingan lengkap
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: Author;
  tags: string[];
  likes: string[]; // Array of user IDs
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
  // Properti virtual dari backend
  likeCount: number;
  replyCount: number;
}