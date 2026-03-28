import { GraduationCap } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary-foreground/15 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-bold">শাটিবাড়ী এম.এল. উচ্চ বিদ্যালয়</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
          <a href="/admin/login" className="hover:text-primary-foreground/80 transition-colors">অ্যাডমিন</a>
          <span>|</span>
          <p>© ২০২৬ সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
