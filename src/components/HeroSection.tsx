import { useEffect, useState, useRef, useCallback } from "react";
import heroImg1 from "@/assets/hero-1.jpg";
import heroImg2 from "@/assets/hero-2.webp";
import heroImg3 from "@/assets/hero-3.webp";
import { BookOpen, Users } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { supabase } from "@/integrations/supabase/client";

const images = [heroImg1, heroImg2, heroImg3];

const fallbackScrollTexts = [
  "📢 স্কুল বন্ধ: শুক্রবার ও শনিবার",
  "📝 অর্ধবার্ষিক পরীক্ষা শীঘ্রই শুরু হবে",
  "🎓 নতুন ভর্তি চলছে - যোগাযোগ করুন",
  "📞 হটলাইন: 01710-722811",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrollTexts, setScrollTexts] = useState<string[]>(fallbackScrollTexts);

  const fetchNotices = useCallback(async () => {
    const { data } = await supabase
      .from("notices")
      .select("title")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data && data.length > 0) {
      setScrollTexts(data.map((n) => n.title));
    }
  }, []);

  useEffect(() => {
    fetchNotices();
    const channel = supabase
      .channel("hero-notices-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "notices" }, () => fetchNotices())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchNotices]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setStatsVisible(true),
      { threshold: 0.5 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const years = useCountUp(75, 1200, statsVisible);
  const students = useCountUp(1200, 1500, statsVisible);
  const teachers = useCountUp(45, 1000, statsVisible);

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center overflow-hidden">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`শাটিবাড়ী এম.এল. উচ্চ বিদ্যালয় - ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[hsl(var(--hero-overlay)/0.75)]" />

      {/* Running text - centered, slightly above middle */}
      <div className="absolute left-0 right-0 top-[18%] z-20 overflow-hidden">
        <div className="animate-reveal animate-reveal-delay-2 overflow-hidden rounded-lg bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10 py-2.5 mx-4 sm:mx-8 lg:mx-16">
          <div className="ticker-scroll">
            {[...scrollTexts, ...scrollTexts].map((t, i) => (
              <span key={i} className="inline-block text-sm sm:text-base font-semibold text-gold mx-8">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20">
        <div className="max-w-2xl">
          <div className="animate-reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 mb-6">
            <BookOpen className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">প্রতিষ্ঠিত ১৯৫০</span>
          </div>

          <h1 className="animate-hero-text text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.1] mb-5">
            শাটিবাড়ী এম.এল.
            <br />
            উচ্চ বিদ্যালয়
          </h1>

          <p className="animate-hero-text-delay text-lg sm:text-xl text-primary-foreground/80 max-w-lg mb-8 leading-relaxed">
            জ্ঞান, শৃঙ্খলা ও নৈতিকতার আলোকে গড়ে তুলছি আগামীর সুনাগরিক। শিক্ষার আলোয় এগিয়ে চলুন আমাদের সাথে।
          </p>

          <div className="animate-reveal animate-reveal-delay-3 flex flex-wrap gap-4">
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-accent-foreground font-semibold text-sm shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              আরও জানুন
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-foreground/10 text-primary-foreground font-semibold text-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-200 active:scale-[0.97]"
            >
              <Users className="w-4 h-4" />
              যোগাযোগ করুন
            </a>
          </div>

          {/* Stats with count-up */}
          <div ref={statsRef} className="animate-reveal animate-reveal-delay-4 mt-8 flex gap-8 sm:gap-12">
            {[
              { num: years, suffix: "+", label: "বছরের ঐতিহ্য" },
              { num: students, suffix: "+", label: "শিক্ষার্থী" },
              { num: teachers, suffix: "+", label: "শিক্ষক" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold text-gold tabular-nums">
                  {s.num}{s.suffix}
                </div>
                <div className="text-sm text-primary-foreground/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-gold w-8" : "bg-primary-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
