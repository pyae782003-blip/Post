"use client";

import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Post, PostFormData } from "@/types";
import PostCard from "@/components/PostCard";
import PostModal from "@/components/PostModal";
import DeleteDialog from "@/components/DeleteDialog";
import Navbar from "@/components/Navbar";
import { Search, Loader2, MessageSquare, Filter } from "lucide-react";

const CATEGORIES = [
  "All",
  "General",
  "Technology",
  "Design",
  "Discussion",
  "Question",
  "Announcement",
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");

  // ── Fetch posts ──────────────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPosts(data);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ── Create ───────────────────────────────────────────────────────────
  const handleCreate = async (data: PostFormData) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    const newPost: Post = await res.json();
    setPosts((prev) => [newPost, ...prev]);
    toast.success("Post published!");
  };

  // ── Update ───────────────────────────────────────────────────────────
  const handleUpdate = async (data: PostFormData) => {
    if (!editPost) return;
    const res = await fetch(`/api/posts/${editPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    const updated: Post = await res.json();
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    toast.success("Post updated!");
    setEditPost(null);
  };

  // ── Delete ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/posts/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleteId(null);
    }
  };

  // ── Derived state ────────────────────────────────────────────────────
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openEdit = (post: Post) => {
    setEditPost(post);
    setIsModalOpen(true);
  };

  const openDelete = (id: string) => {
    const post = posts.find((p) => p.id === id);
    setDeleteTitle(post?.title ?? "");
    setDeleteId(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditPost(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "var(--toast-bg, #fff)",
            color: "var(--toast-color, #1e293b)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            fontSize: "14px",
          },
          className: "dark:bg-slate-900 dark:text-slate-200",
        }}
      />

      <Navbar
        postCount={posts.length}
        onNewPost={() => {
          setEditPost(null);
          setIsModalOpen(true);
        }}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero / Intro */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Community Board
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Share ideas, ask questions, and engage with the community.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-slate-400 dark:text-slate-600 animate-spin" />
            <p className="text-slate-400 dark:text-slate-500 text-sm">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-slate-400 dark:text-slate-600" />
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">No posts found</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                {search
                  ? "Try a different search term"
                  : "Be the first to post something!"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-16 py-6 transition-colors">
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Forum — Built with Next.js, Prisma & Neon
        </p>
      </footer>

      {/* Modals */}
      <PostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editPost ? handleUpdate : handleCreate}
        editPost={editPost}
      />
      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={deleteTitle}
      />
    </div>
  );
}
