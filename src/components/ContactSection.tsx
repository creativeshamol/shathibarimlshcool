import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <div className={`text-center mb-12 ${visible ? "animate-reveal" : "opacity-0"}`}>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-sm font-medium text-primary mb-4">
            যোগাযোগ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            আমাদের সাথে যোগাযোগ করুন
          </h2>
        </div>

        <div className={`grid md:grid-cols-2 gap-8 ${visible ? "animate-reveal animate-reveal-delay-1" : "opacity-0"}`}>
          {/* Contact Info */}
          <div className="grid sm:grid-cols-2 md:grid-cols-1 gap-4">
            {[
              { icon: MapPin, title: "ঠিকানা", desc: "শাটিবাড়ী, বাংলাদেশ" },
              { icon: Phone, title: "ফোন", desc: "01710-722811" },
              { icon: Mail, title: "ইমেইল", desc: "info@shathibarimlhs.edu.bd" },
              { icon: Clock, title: "অফিস সময়", desc: "রবি - বৃহস্পতি: সকাল ৮:০০ - বিকাল ৪:০০" },
            ].map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border hover:border-primary/20 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-0.5">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Google Map */}
          <div className={`rounded-xl overflow-hidden border shadow-sm min-h-[320px] ${visible ? "animate-reveal animate-reveal-delay-2" : "opacity-0"}`}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.0!2d89.2684!3d25.7486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e32de57e405b3b%3A0x1f6b0e8b8b8b8b8b!2sShathibari%20M.L.%20High%20School!5e0!3m2!1sbn!2sbd!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="শাটিবাড়ী এম.এল. উচ্চ বিদ্যালয় - ম্যাপ"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
