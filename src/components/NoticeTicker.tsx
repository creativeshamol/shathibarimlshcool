import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const fallbackNotices = [
  "🎓 নতুন ভর্তি আবেদন শুরু হয়েছে",
  "📞 যোগাযোগ: 01710-722811",
  "বার্ষিক পরীক্ষার সময়সূচি প্রকাশিত হয়েছে",
];

const NoticeTicker = () => {
  const [notices, setNotices] = useState<string[]>(fallbackNotices);
  const [key, setKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchNotices = useCallback(async () => {
    const { data } = await supabase
      .from("notices")
      .select("title")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data && data.length > 0) {
      setNotices(data.map((n) => n.title));
      setKey((k) => k + 1); // restart animation on update
    }
  }, []);

  useEffect(() => {
    fetchNotices();

    const channel = supabase
      .channel("notices-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notices" },
        () => fetchNotices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotices]);

  // Double for seamless infinite loop
  const scrollItems = [...notices, ...notices];

  return (
    <div className="overflow-hidden border-b border-border/50 bg-gold/10 relative z-40">
      <div className="container mx-auto flex items-center gap-3 py-2">
        <span className="shrink-0 rounded-sm bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground tracking-wide">
          আপডেট
        </span>
        <div className="overflow-hidden flex-1 group">
          <div
            key={key}
            ref={scrollRef}
            className="flex gap-10 whitespace-nowrap ticker-scroll group-hover:[animation-play-state:paused]"
          >
            {scrollItems.map((n, i) => (
              <span
                key={`${key}-${i}`}
                className="inline-block text-xs font-medium text-foreground sm:text-sm"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeTicker;
