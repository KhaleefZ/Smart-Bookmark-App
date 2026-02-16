import { createClient } from "@/lib/supabase/server";
import Dashboard from "@/components/Dashboard";
import LoginButton from "@/components/LoginButton";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-violet-100/40 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Nav */}
        <nav className="relative w-full px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Smart Bookmarks
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="hidden sm:inline text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hidden sm:inline text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              How it Works
            </a>
            <LoginButton />
          </div>
        </nav>

        {/* Hero */}
        <div className="relative flex-1 flex items-center justify-center px-4 py-16 sm:py-0">
          <div className="text-center space-y-10 max-w-3xl mx-auto animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/80 rounded-full text-sm text-blue-700 font-medium shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Real-time sync across all tabs
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1]">
                <span className="text-gray-900">Your bookmarks,</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                  beautifully organized.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
                A lightning-fast bookmark manager that syncs in real-time.
                Save, access, and manage your links from anywhere.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <LoginButton />
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free forever
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No setup
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Google sign-in
                </div>
              </div>
            </div>

            {/* App Preview Mock */}
            <div className="relative mx-auto max-w-2xl pt-8">
              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/50 p-1 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-t-xl border-b border-gray-100">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-white rounded-md text-xs text-gray-400 border border-gray-100 w-64 text-center">
                      smart-bookmarks.vercel.app
                    </div>
                  </div>
                </div>
                {/* Mock content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600" />
                    <div className="h-4 w-32 bg-gray-200 rounded-md" />
                    <div className="ml-auto h-8 w-20 bg-gray-100 rounded-lg" />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="h-10 flex-1 bg-white rounded-lg border border-gray-100" />
                      <div className="h-10 flex-1 bg-white rounded-lg border border-gray-100" />
                    </div>
                    <div className="h-10 w-32 bg-blue-500 rounded-lg ml-auto" />
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
                      <div className="w-9 h-9 rounded-lg bg-gray-100" />
                      <div className="flex-1 space-y-2">
                        <div className={`h-3 bg-gray-200 rounded-md ${i === 1 ? 'w-40' : i === 2 ? 'w-32' : 'w-36'}`} />
                        <div className={`h-2.5 bg-blue-100 rounded-md ${i === 1 ? 'w-24' : i === 2 ? 'w-28' : 'w-20'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Glow effect behind preview */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-200/30 via-indigo-200/30 to-violet-200/30 blur-3xl scale-110" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="relative py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-sm text-indigo-600 font-medium mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Features
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything you need,
                <br />
                <span className="text-gray-400">nothing you don&apos;t.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  title: "Private & Secure",
                  desc: "Row-level security ensures your bookmarks are truly private. Only you can see, add, or delete them.",
                  color: "blue",
                },
                {
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  title: "Lightning Fast Sync",
                  desc: "Powered by Supabase Realtime. Add a bookmark in one tab, see it appear instantly in another.",
                  color: "indigo",
                },
                {
                  icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
                  title: "Works Everywhere",
                  desc: "Responsive design that works beautifully on desktop, tablet, and mobile devices.",
                  color: "violet",
                },
                {
                  icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
                  title: "Google OAuth",
                  desc: "Sign in securely with your Google account. No new passwords to remember.",
                  color: "emerald",
                },
                {
                  icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
                  title: "Easy Management",
                  desc: "Add bookmarks with a title and URL. Delete them with one click when you no longer need them.",
                  color: "rose",
                },
                {
                  icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
                  title: "Open Source",
                  desc: "Built with Next.js, Supabase, and Tailwind CSS. View the source code on GitHub.",
                  color: "amber",
                },
              ].map((feat, i) => {
                const colorMap: Record<string, string> = {
                  blue: "bg-blue-50 text-blue-600",
                  indigo: "bg-indigo-50 text-indigo-600",
                  violet: "bg-violet-50 text-violet-600",
                  emerald: "bg-emerald-50 text-emerald-600",
                  rose: "bg-rose-50 text-rose-600",
                  amber: "bg-amber-50 text-amber-600",
                };
                const borderMap: Record<string, string> = {
                  blue: "hover:border-blue-200 hover:shadow-blue-500/5",
                  indigo: "hover:border-indigo-200 hover:shadow-indigo-500/5",
                  violet: "hover:border-violet-200 hover:shadow-violet-500/5",
                  emerald: "hover:border-emerald-200 hover:shadow-emerald-500/5",
                  rose: "hover:border-rose-200 hover:shadow-rose-500/5",
                  amber: "hover:border-amber-200 hover:shadow-amber-500/5",
                };
                return (
                  <div
                    key={i}
                    className={`bg-white border border-gray-100 rounded-2xl p-6 text-left hover:shadow-xl transition-all duration-300 ${borderMap[feat.color]}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[feat.color]}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feat.icon} />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{feat.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative py-24 px-4 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full text-sm text-violet-600 font-medium mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How it Works
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Up and running in 3 steps
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Sign in with Google",
                  desc: "One click to authenticate. No forms, no passwords, no friction.",
                  icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
                },
                {
                  step: "2",
                  title: "Save your bookmarks",
                  desc: "Paste a URL, add a title, and hit save. It's that simple.",
                  icon: "M12 4v16m8-8H4",
                },
                {
                  step: "3",
                  title: "Access from anywhere",
                  desc: "Your bookmarks sync in real-time across all your browser tabs.",
                  icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                },
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <div className="relative inline-flex mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to get started?
                </h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Join and start organizing your bookmarks today.
                </p>
                <LoginButton />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-8 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-400">Smart Bookmarks</span>
            </div>
            <p className="text-xs text-gray-400">
              Built with Next.js, Supabase & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <Dashboard
      userEmail={user.email || ""}
      userAvatar={user.user_metadata?.avatar_url}
      userName={user.user_metadata?.full_name}
    />
  );
}
