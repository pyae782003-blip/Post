"use client";

import { useState, useEffect } from "react";
import { Post, PostFormData } from "@/types";
import { X, Loader2, PenLine } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => Promise<void>;
  editPost?: Post | null;
}

const CATEGORIES = [
  "General",
  "Technology",
  "Design",
  "Discussion",
  "Question",
  "Announcement",
];

const initialForm: PostFormData = {
  title: "",
  content: "",
  author: "",
  imageUrl: null,
  category: "General",
};

export default function PostModal({
  isOpen,
  onClose,
  onSubmit,
  editPost,
}: PostModalProps) {
  const [form, setForm] = useState<PostFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<PostFormData>>({});

  useEffect(() => {
    if (editPost) {
      setForm({
        title: editPost.title,
        content: editPost.content,
        author: editPost.author,
        imageUrl: editPost.imageUrl,
        category: editPost.category,
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [editPost, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<PostFormData> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (form.title.length > 120)
      newErrors.title = "Title must be under 120 characters";
    if (!form.content.trim()) newErrors.content = "Content is required";
    if (!form.author.trim()) newErrors.author = "Author name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PostFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
              <PenLine className="w-4 h-4 text-white dark:text-slate-900" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {editPost ? "Edit Post" : "Create New Post"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-red-400 dark:text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all ${
                errors.title ? "border-red-300 dark:border-red-500/50" : "border-slate-200 dark:border-slate-800"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Author + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Author <span className="text-red-400 dark:text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Your name"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all ${
                  errors.author ? "border-red-300 dark:border-red-500/50" : "border-slate-200 dark:border-slate-800"
                }`}
              />
              {errors.author && (
                <p className="mt-1 text-xs text-red-500">{errors.author}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Image (Optional)
            </label>
            <ImageUpload 
              value={form.imageUrl || null} 
              onChange={(url) => setForm(prev => ({ ...prev, imageUrl: url }))} 
              onRemove={() => setForm(prev => ({ ...prev, imageUrl: null }))}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Content <span className="text-red-400 dark:text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              rows={5}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all resize-none ${
                errors.content ? "border-red-300 dark:border-red-500/50" : "border-slate-200 dark:border-slate-800"
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-500">{errors.content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-700 dark:hover:bg-white disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editPost ? "Save Changes" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
