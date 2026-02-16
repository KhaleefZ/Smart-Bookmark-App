"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AddBookmarkForm from "./AddBookmarkForm";
import BookmarkList from "./BookmarkList";
import LogoutButton from "./LogoutButton";
import type { Bookmark } from "@/lib/types";

interface DashboardProps {
  userEmail: string;
  userAvatar?: string;
  userName?: string;
}

export default function Dashboard({
  userEmail,
  userAvatar,
  userName,
}: DashboardProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBookmarks(data);
      }
      setLoading(false);
    };

    fetchBookmarks();

    // Real-time subscription for cross-tab sync
    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
        },
        async (payload) => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user && payload.new.user_id === user.id) {
            setBookmarks((prev) => {
              // Avoid duplicates (already added optimistically)
              if (prev.some((b) => b.id === payload.new.id)) return prev;
              return [payload.new as Bookmark, ...prev];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleBookmarkAdded = (bookmark: Bookmark) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === bookmark.id)) return prev;
      return [bookmark, ...prev];
    });
  };

  const handleBookmarkDeleted = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Search / filter
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = bookmarks.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q);
  });

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Smart Bookmarks
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Search bar in header for desktop */}
            {!loading && bookmarks.length > 0 && (
              <div className="relative hidden md:block">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white placeholder-gray-400 transition-all"
                />
              </div>
            )}
            <div className="flex items-center gap-2.5 bg-gray-50 rounded-full pl-1 pr-4 py-1">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full ring-2 ring-white"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {(userName || userEmail).charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {userName || userEmail}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 animate-fade-in">
          {/* Welcome / Stats Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {getGreeting()}{userName ? `, ${userName.split(" ")[0]}` : ""}! 👋
              </h2>
              <p className="text-gray-400 mt-1">
                Manage your bookmarks in one place
              </p>
            </div>
            {!loading && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-xl">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-blue-700 leading-none">
                      {bookmarks.length}
                    </span>
                    <span className="text-[11px] text-blue-500 font-medium">
                      Bookmark{bookmarks.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                {bookmarks.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/50 rounded-xl">
                    <div className="relative">
                      <span className="flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-green-700 leading-none">
                        Live
                      </span>
                      <span className="text-[11px] text-green-500 font-medium">
                        Real-time
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile search */}
          {!loading && bookmarks.length > 0 && (
            <div className="relative md:hidden">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all"
              />
            </div>
          )}

          {/* Add Bookmark Section */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Add New Bookmark
                  </h2>
                  <p className="text-xs text-gray-400">Save a link with a title</p>
                </div>
              </div>
            </div>
            <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />
          </section>

          {/* Bookmarks List Section */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Bookmarks
                  </h2>
                  <p className="text-xs text-gray-400">
                    {searchQuery ? `Showing results for "${searchQuery}"` : "All your saved links"}
                  </p>
                </div>
              </div>
              {searchQuery && filteredBookmarks.length !== bookmarks.length && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
            <BookmarkList
              bookmarks={filteredBookmarks}
              loading={loading}
              onDelete={handleBookmarkDeleted}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-8 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            Smart Bookmarks — Real-time bookmark manager
          </p>
          <p className="text-xs text-gray-300">
            Powered by Next.js & Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}
