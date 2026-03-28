import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Calendar, ArrowRight, Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Notice = Tables<"notices">;

const NoticeSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("notices")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (data) setNotices(data);
    };
    fetch();
  }, []);

  return (
    <section id="notice" className="section-padding bg-section-alt" ref={ref}>
      <div className="container mx-auto max-w-3xl">
        <div className={`text-center mb-10 ${visible ? "animate-reveal" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-light text-sm font-medium text-accent-foreground mb-4">
            <Bell className="w-3.5 h-3.5" />
            নোটিশ বোর্ড
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">সর্বশেষ বিজ্ঞপ্তি</h2>
        </div>

        {notices.length === 0 ? (
          <p className={`text-center text-muted-foreground ${visible ? "animate-reveal" : "opacity-0"}`}>
            বর্তমানে কোনো নোটিশ নেই
          </p>
        ) : (
          <div className="space-y-3">
            {notices.map((n, i) => (
              <Link
                to={`/notice/${n.id}`}
                key={n.id}
                className={`group flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-card border hover:border-primary/25 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.99] ${
                  visible ? "animate-reveal" : "opacity-0"
                }`}
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground text-sm shrink-0 pt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(n.created_at).toLocaleDateString("bn-BD")}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="sm:hidden text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString("bn-BD")}</span>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{n.title}</h3>
                  {n.content && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{n.content}</p>}
                  {(n as any).file_url && (
                    <span className="inline-flex items-center gap-1 text-xs text-primary mt-1.5">
                      <Paperclip className="w-3 h-3" /> ফাইল সংযুক্ত
                    </span>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NoticeSection;
