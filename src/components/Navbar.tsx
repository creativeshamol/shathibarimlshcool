import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

const navLinks = [
  { label: "হোম", href: "#home" },
  { label: "পরিচিতি", href: "#about" },
  { label: "সুবিধাসমূহ", href: "#features" },
  { label: "ফলাফল", href: "#result" },
  { label: "নোটিশ", href: "#notice" },
  { label: "যোগাযোগ", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground leading-tight">
            শাটিবাড়ী এম.এল.<br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>উচ্চ বিদ্যালয়
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3.5 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors active:scale-95"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-t animate-fade-in">
          <ul className="flex flex-col p-4 gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
