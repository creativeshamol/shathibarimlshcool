import { useEffect, useRef, useState } from "react";
import { Award, Target, Heart } from "lucide-react";

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="section-padding bg-section-alt" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <div className={`text-center mb-12 ${visible ? "animate-reveal" : "opacity-0"}`}>
          <span className="inline-block px-3 py-1 rounded-full bg-gold-light text-sm font-medium text-accent-foreground mb-4">
            আমাদের সম্পর্কে
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            শিক্ষার আলোয় সমৃদ্ধ ইতিহাস
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            শাটিবাড়ী এম.এল. উচ্চ বিদ্যালয় দীর্ঘদিন ধরে মানসম্মত শিক্ষা প্রদান করে আসছে। আমাদের লক্ষ্য প্রতিটি শিক্ষার্থীকে আদর্শ ও দক্ষ নাগরিক হিসেবে গড়ে তোলা।
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Award,
              title: "আমাদের লক্ষ্য",
              desc: "প্রতিটি শিক্ষার্থীর মধ্যে জ্ঞান ও নৈতিকতার বীজ বপন করে সুনাগরিক তৈরি করা।",
            },
            {
              icon: Target,
              title: "আমাদের উদ্দেশ্য",
              desc: "আধুনিক শিক্ষা পদ্ধতির সাথে নৈতিক মূল্যবোধের সমন্বয়ে শিক্ষার্থীদের সর্বাঙ্গীণ বিকাশ।",
            },
            {
              icon: Heart,
              title: "আমাদের মূল্যবোধ",
              desc: "সততা, শৃঙ্খলা, পরস্পরের প্রতি শ্রদ্ধা এবং জ্ঞান অর্জনের প্রতি অনুরাগ।",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`bg-card rounded-xl p-6 shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] ${
                visible ? `animate-reveal animate-reveal-delay-${i + 1}` : "opacity-0"
              }`}
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
