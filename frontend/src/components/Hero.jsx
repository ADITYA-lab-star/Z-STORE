import React from "react";

const Hero = () => {
  const scrollToFeatured = () => {
    const el = document.getElementById("featured-products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#05060a] text-white min-h-[92vh] flex items-center">
      {/* Animated gradient backdrop */}
      <div
        className="absolute inset-0 opacity-90 animate-gradient-shift"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #05060a 0%, #0a0f1f 25%, #1a0b2e 50%, #0a0f1f 75%, #05060a 100%)",
          backgroundSize: "300% 300%",
        }}
      />

      {/* Floating blobs */}
      <div className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-fuchsia-600/25 blur-3xl animate-blob" />
      <div
        className="absolute top-1/3 -right-24 h-[480px] w-[480px] rounded-full bg-indigo-500/25 blur-3xl animate-blob"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-cyan-400/15 blur-3xl animate-blob"
        style={{ animationDelay: "6s" }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 grid lg:grid-cols-12 gap-12 items-center">
        {/* Copy */}
        <div className="lg:col-span-7 flex flex-col gap-7">
          <div
            className="animate-fade-up inline-flex items-center self-start gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-xs font-medium text-white/80"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            New collection · Summer 2026
          </div>

          <h1
            className="animate-fade-up font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.02]"
            style={{ animationDelay: "0.15s" }}
          >
            Curated tech.
            <br />
            <span
              className="bg-clip-text text-transparent animate-shine"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #fff 0%, #c4b5fd 25%, #67e8f9 50%, #c4b5fd 75%, #fff 100%)",
                backgroundSize: "200% auto",
              }}
            >
              Designed to obsess.
            </span>
          </h1>

          <p
            className="animate-fade-up max-w-xl text-lg text-white/65 leading-relaxed"
            style={{ animationDelay: "0.3s" }}
          >
            Handpicked devices and accessories from the world's most coveted
            brands. Engineered for performance, built to last, priced to move.
          </p>

          <div
            className="animate-fade-up flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.45s" }}
          >
            <button
              onClick={scrollToFeatured}
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.04] active:scale-95 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(196,181,253,0.7)]"
            >
              <span>Shop the collection</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-6 py-3.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch the film
            </button>
          </div>

          <div
            className="animate-fade-up grid grid-cols-3 gap-6 pt-8 max-w-md border-t border-white/10 mt-2"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              { v: "120k+", l: "Happy customers" },
              { v: "4.9★", l: "Average rating" },
              { v: "48h", l: "Express delivery" },
            ].map((s) => (
              <div key={s.l} className="pt-6">
                <div className="text-2xl font-semibold tracking-tight">{s.v}</div>
                <div className="text-xs text-white/50 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating product showcase */}
        <div className="lg:col-span-5 relative h-[480px] sm:h-[560px] animate-fade-in">
          {/* Glow */}
          <div className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-gradient-to-br from-fuchsia-500/40 via-indigo-500/30 to-cyan-400/30 blur-3xl" />

          {/* Main card */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] aspect-[4/5] rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-2xl p-6 flex flex-col justify-between shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] animate-float-slow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/70 tracking-widest uppercase">
                Featured
              </span>
              <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-wider">
                NEW
              </span>
            </div>
            <div className="relative flex-1 flex items-center justify-center">
              <div className="relative h-44 w-44 rounded-3xl bg-gradient-to-br from-slate-200 to-slate-400 shadow-2xl flex items-center justify-center">
                <div className="absolute inset-3 rounded-2xl bg-gradient-to-br from-slate-700 to-black flex items-center justify-center">
                  <span className="text-4xl font-black bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
                    Z
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-white/60">Aurora Pro · 2026</div>
              <div className="flex items-baseline justify-between mt-1">
                <div className="text-2xl font-semibold">$1,299</div>
                <div className="text-xs text-emerald-300">In stock</div>
              </div>
            </div>
          </div>

          {/* Floating small cards */}
          <div
            className="absolute top-6 right-2 w-44 rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-xl p-3.5 shadow-xl animate-float-slower"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-fuchsia-400 to-indigo-500" />
              <div className="flex-1">
                <div className="text-xs font-medium">Studio Buds</div>
                <div className="text-[10px] text-white/50">+12% this week</div>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-8 left-0 w-48 rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-xl p-3.5 shadow-xl animate-float-slow"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="text-[10px] text-white/50 uppercase tracking-wider">
              Free shipping
            </div>
            <div className="text-sm font-medium mt-1">
              On every order over $99
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#05060a] pointer-events-none" />
    </section>
  );
};

export default Hero;
