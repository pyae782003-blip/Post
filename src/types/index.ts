export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostFormData {
  title: string;
  content: string;
  author: string;
  imageUrl?: string | null;
  category: string;
}
