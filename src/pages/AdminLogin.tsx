import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error("লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
    } else {
      toast.success("সফলভাবে লগইন হয়েছে!");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-section-alt px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">অ্যাডমিন লগইন</h1>
          <p className="text-sm text-muted-foreground mt-1">শাটিবাড়ী এম.এল. উচ্চ বিদ্যালয়</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border p-6 space-y-4 shadow-lg">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">ইমেইল</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">পাসওয়ার্ড</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            লগইন করুন
          </Button>
        </form>
        <p className="text-center mt-4">
          <a href="/" className="text-sm text-primary hover:underline">← হোম পেজে ফিরে যান</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
