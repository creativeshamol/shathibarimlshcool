import { useEffect, useRef, useState } from "react";
import { BookOpen, FlaskConical, Monitor, Trophy, Dumbbell, Music } from "lucide-react";

const features = [
  { icon: BookOpen, title: "সমৃদ্ধ পাঠাগার", desc: "হাজারো বইয়ের সংগ্রহ সমৃদ্ধ আমাদের লাইব্রেরি।" },
  { icon: FlaskConical, title: "বিজ্ঞানাগার", desc: "আধুনিক যন্ত্রপাতি সজ্জিত বিজ্ঞান পরীক্ষাগার।" },
  { icon: Monitor, title: "কম্পিউটার ল্যাব", desc: "তথ্য প্রযুক্তি শিক্ষার জন্য আধুনিক কম্পিউটার ল্যাব।" },
  { icon: Trophy, title: "সহশিক্ষা কার্যক্রম", desc: "বিতর্ক, বিজ্ঞান মেলা ও সাংস্কৃতিক অনুষ্ঠান।" },
  { icon: Dumbbell, title: "খেলাধুলা", desc: "ক্রিকেট, ফুটবল ও অন্যান্য খেলাধুলার সুবিধা।" },
  { icon: Music, title: "সাংস্কৃতিক কার্যক্রম", desc: "বার্ষিক সাংস্কৃতিক অনুষ্ঠান ও জাতীয় দিবস উদযাপন।" },
];

const FeaturesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="features" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <div className={`text-center mb-12 ${visible ? "animate-reveal" : "opacity-0"}`}>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-sm font-medium text-primary mb-4">
            সুবিধাসমূহ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            আমাদের বিদ্যালয়ের সুযোগ-সুবিধা
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group flex gap-4 p-5 rounded-xl border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 active:scale-[0.98] ${
                visible ? `animate-reveal` : "opacity-0"
              }`}
              style={{ animationDelay: `${(i + 1) * 70}ms` }}
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
