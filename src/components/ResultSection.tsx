import { useEffect, useRef, useState } from "react";
import { Award, ExternalLink } from "lucide-react";

const ResultSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="result" className="section-padding bg-section-alt" ref={ref}>
      <div className="container mx-auto max-w-3xl">
        <div className={`text-center mb-10 transition-all duration-700 ${visible ? "animate-reveal" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-sm font-medium text-primary mb-4">
            <Award className="w-3.5 h-3.5" />
            রেজাল্ট
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            পরীক্ষার ফলাফল দেখুন
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            বাংলাদেশ শিক্ষা বোর্ডের অফিসিয়াল ওয়েবসাইট থেকে আপনার পরীক্ষার ফলাফল দেখুন
          </p>
        </div>

        <div className={`text-center transition-all duration-700 ${visible ? "animate-reveal" : "opacity-0"}`} style={{ animationDelay: "150ms" }}>
          <a
            href="http://www.educationboardresults.gov.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97]"
          >
            <Award className="w-5 h-5" />
            ফলাফল দেখুন
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-muted-foreground mt-4">
            educationboardresults.gov.bd — বাংলাদেশ শিক্ষা বোর্ড
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultSection;
