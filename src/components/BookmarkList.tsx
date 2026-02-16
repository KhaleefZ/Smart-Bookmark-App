"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/lib/types";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function BookmarkList({ bookmarks, loading, onDelete }: BookmarkListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
      console.error("Error deleting bookmark:", error);
    } else {
      onDelete(id);
    }
    setDeletingId(null);
  };

  // Extract domain from URL for favicon
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
        </div>
        <p className="text-sm text-gray-400">Loading your bookmarks...</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 mb-6">
          <svg
            className="w-10 h-10 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No bookmarks yet
        </h3>
        <p className="text-gray-400 max-w-sm mx-auto">
          Start saving your favorite links! Add your first bookmark using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
        </p>
      </div>
      {bookmarks.map((bookmark, index) => (
        <div
          key={bookmark.id}
          className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-100 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Favicon */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
            {getFavicon(bookmark.url) ? (
              <img
                src={getFavicon(bookmark.url)!}
                alt=""
                className="w-5 h-5"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate text-[15px]">
              {bookmark.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:text-blue-700 hover:underline truncate inline-flex items-center gap-1 group/link"
              >
                {getDomain(bookmark.url)}
                <svg className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">
                {new Date(bookmark.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={() => handleDelete(bookmark.id)}
            disabled={deletingId === bookmark.id}
            className="shrink-0 opacity-0 group-hover:opacity-100 p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer"
            title="Delete bookmark"
          >
            {deletingId === bookmark.id ? (
              <div className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-red-500 animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
