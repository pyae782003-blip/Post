"use client";

import { Post } from "@/types";
import { formatDistanceToNow } from "@/lib/utils";
import { Edit2, Trash2, User, Clock, Tag } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  General: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Technology: "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  Design: "bg-purple-50 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  Discussion: "bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  Question: "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  Announcement: "bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400",
};

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const colorClass =
    categoryColors[post.category] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  return (
    <article className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            <Tag className="w-3 h-3" />
            {post.category}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onEdit(post)}
            className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
            title="Edit post"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-snug line-clamp-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
        {post.title}
      </h2>

      {/* Image Preview */}
      {post.imageUrl && (
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-5">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <User className="w-3.5 h-3.5" />
          <span className="font-medium text-slate-600 dark:text-slate-400">{post.author}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDistanceToNow(new Date(post.createdAt))}</span>
        </div>
      </div>
    </article>
  );
}
