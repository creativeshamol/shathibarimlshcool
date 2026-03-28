import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { GraduationCap, LogOut, Bell, Award, Plus, Trash2, Loader2, ToggleLeft, ToggleRight, Upload, FileText, Image } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Notice = Tables<"notices"> & { file_url?: string | null };
type Result = Tables<"results">;

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"notices" | "results">("notices");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeFile, setNoticeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  // Result form
  const [resultForm, setResultForm] = useState({
    student_name: "", roll_number: "", class_name: "", section: "",
    exam_name: "", year: "", gpa: "", grade: "",
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    const [{ data: n }, { data: r }] = await Promise.all([
      supabase.from("notices").select("*").order("created_at", { ascending: false }),
      supabase.from("results").select("*").order("created_at", { ascending: false }),
    ]);
    setNotices((n as Notice[]) || []);
    setResults(r || []);
    setLoadingData(false);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("notice-attachments")
      .upload(fileName, file);
    if (error) {
      toast.error("ফাইল আপলোড ব্যর্থ হয়েছে");
      return null;
    }
    return fileName;
  };

  const addNotice = async () => {
    if (!noticeTitle.trim()) return;
    setSaving(true);

    let fileUrl: string | null = null;
    if (noticeFile) {
      fileUrl = await uploadFile(noticeFile);
      if (!fileUrl && noticeFile) { setSaving(false); return; }
    }

    const { error } = await supabase.from("notices").insert({
      title: noticeTitle.trim(),
      content: noticeContent.trim() || null,
      created_by: user!.id,
      file_url: fileUrl,
    } as any);
    setSaving(false);
    if (error) { toast.error("নোটিশ যোগ করা যায়নি"); return; }
    toast.success("নোটিশ সফলভাবে যোগ হয়েছে!");
    setNoticeTitle(""); setNoticeContent(""); setNoticeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchData();
  };

  const toggleNotice = async (id: string, currentActive: boolean) => {
    await supabase.from("notices").update({ is_active: !currentActive }).eq("id", id);
    fetchData();
  };

  const deleteNotice = async (id: string, fileUrl?: string | null) => {
    if (fileUrl) {
      await supabase.storage.from("notice-attachments").remove([fileUrl]);
    }
    await supabase.from("notices").delete().eq("id", id);
    toast.success("নোটিশ মুছে ফেলা হয়েছে");
    fetchData();
  };

  const addResult = async () => {
    const { student_name, roll_number, class_name, exam_name, year } = resultForm;
    if (!student_name || !roll_number || !class_name || !exam_name || !year) {
      toast.error("সকল প্রয়োজনীয় তথ্য পূরণ করুন"); return;
    }
    setSaving(true);
    const { error } = await supabase.from("results").insert({
      student_name, roll_number, class_name,
      section: resultForm.section || null,
      exam_name, year,
      gpa: resultForm.gpa ? parseFloat(resultForm.gpa) : null,
      grade: resultForm.grade || null,
      created_by: user!.id,
    });
    setSaving(false);
    if (error) { toast.error("রেজাল্ট যোগ করা যায়নি"); return; }
    toast.success("রেজাল্ট সফলভাবে যোগ হয়েছে!");
    setResultForm({ student_name: "", roll_number: "", class_name: "", section: "", exam_name: "", year: "", gpa: "", grade: "" });
    fetchData();
  };

  const deleteResult = async (id: string) => {
    await supabase.from("results").delete().eq("id", id);
    toast.success("রেজাল্ট মুছে ফেলা হয়েছে");
    fetchData();
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

  if (loading || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-section-alt">
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">অ্যাডমিন প্যানেল</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary">হোম</a>
            <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4" /> লগআউট
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex gap-2 mb-8">
          <Button variant={tab === "notices" ? "default" : "outline"} onClick={() => setTab("notices")}>
            <Bell className="w-4 h-4" /> নোটিশ ব্যবস্থাপনা
          </Button>
          <Button variant={tab === "results" ? "default" : "outline"} onClick={() => setTab("results")}>
            <Award className="w-4 h-4" /> রেজাল্ট ব্যবস্থাপনা
          </Button>
        </div>

        {tab === "notices" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" /> নতুন নোটিশ যোগ করুন
              </h2>
              <div className="space-y-3">
                <Input value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} placeholder="নোটিশের শিরোনাম" />
                <Textarea value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)} placeholder="বিস্তারিত (ঐচ্ছিক)" rows={3} />
                
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={(e) => setNoticeFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="notice-file"
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} type="button">
                    <Upload className="w-4 h-4" /> ফাইল আপলোড (PDF/ছবি)
                  </Button>
                  {noticeFile && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      {noticeFile.name.endsWith(".pdf") ? <FileText className="w-3.5 h-3.5" /> : <Image className="w-3.5 h-3.5" />}
                      {noticeFile.name}
                    </span>
                  )}
                </div>

                <Button onClick={addNotice} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  নোটিশ যোগ করুন
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">সকল নোটিশ ({notices.length})</h2>
              {loadingData ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : notices.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">কোনো নোটিশ নেই</p>
              ) : (
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.id} className="flex items-start gap-3 p-4 rounded-xl border bg-section-alt">
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${n.is_active ? "text-foreground" : "text-muted-foreground line-through"}`}>{n.title}</p>
                        {n.content && <p className="text-sm text-muted-foreground mt-1">{n.content}</p>}
                        {n.file_url && (
                          <span className="inline-flex items-center gap-1 text-xs text-primary mt-1">
                            {isImage(n.file_url) ? <Image className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                            ফাইল সংযুক্ত
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">{new Date(n.created_at).toLocaleDateString("bn-BD")}</p>
                      </div>
                      <button onClick={() => toggleNotice(n.id, n.is_active)} className="text-muted-foreground hover:text-primary shrink-0">
                        {n.is_active ? <ToggleRight className="w-6 h-6 text-primary" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                      <button onClick={() => deleteNotice(n.id, n.file_url)} className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "results" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" /> নতুন রেজাল্ট যোগ করুন
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input value={resultForm.student_name} onChange={(e) => setResultForm({ ...resultForm, student_name: e.target.value })} placeholder="শিক্ষার্থীর নাম *" />
                <Input value={resultForm.roll_number} onChange={(e) => setResultForm({ ...resultForm, roll_number: e.target.value })} placeholder="রোল নম্বর *" />
                <Input value={resultForm.class_name} onChange={(e) => setResultForm({ ...resultForm, class_name: e.target.value })} placeholder="শ্রেণি *" />
                <Input value={resultForm.section} onChange={(e) => setResultForm({ ...resultForm, section: e.target.value })} placeholder="শাখা" />
                <Input value={resultForm.exam_name} onChange={(e) => setResultForm({ ...resultForm, exam_name: e.target.value })} placeholder="পরীক্ষার নাম *" />
                <Input value={resultForm.year} onChange={(e) => setResultForm({ ...resultForm, year: e.target.value })} placeholder="সাল *" />
                <Input value={resultForm.gpa} onChange={(e) => setResultForm({ ...resultForm, gpa: e.target.value })} placeholder="জিপিএ" type="number" step="0.01" />
                <Input value={resultForm.grade} onChange={(e) => setResultForm({ ...resultForm, grade: e.target.value })} placeholder="গ্রেড (A+, A, B...)" />
              </div>
              <Button onClick={addResult} disabled={saving} className="mt-4">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                রেজাল্ট যোগ করুন
              </Button>
            </div>

            <div className="bg-card rounded-2xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">সকল রেজাল্ট ({results.length})</h2>
              {loadingData ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : results.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">কোনো রেজাল্ট নেই</p>
              ) : (
                <div className="space-y-3">
                  {results.map((r) => (
                    <div key={r.id} className="flex items-start gap-3 p-4 rounded-xl border bg-section-alt">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{r.student_name}</p>
                        <p className="text-sm text-muted-foreground">রোল: {r.roll_number} | শ্রেণি: {r.class_name} | {r.exam_name} ({r.year})</p>
                        {(r.gpa || r.grade) && <p className="text-sm text-primary font-medium mt-1">জিপিএ: {r.gpa} {r.grade && `(${r.grade})`}</p>}
                      </div>
                      <button onClick={() => deleteResult(r.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
