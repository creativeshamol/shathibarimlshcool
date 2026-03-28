import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, FileText, Image, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type Notice = Tables<"notices"> & { file_url?: string | null };

const NoticeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("notices")
        .select("*")
        .eq("id", id)
        .single();
      setNotice(data as Notice | null);
      setLoading(false);
    };
    fetchNotice();
  }, [id]);

  const getFileUrl = (path: string) => {
    const { data } = supabase.storage.from("notice-attachments").getPublicUrl(path);
    return data.publicUrl;
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  const isPdf = (url: string) => /\.pdf$/i.test(url);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground text-lg">নোটিশ পাওয়া যায়নি</p>
        <Link to="/">
          <Button variant="outline"><ArrowLeft className="w-4 h-4" /> হোমে ফিরে যান</Button>
        </Link>
      </div>
    );
  }

  const fileUrl = notice.file_url ? getFileUrl(notice.file_url) : null;

  return (
    <div className="min-h-screen bg-section-alt">
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto flex items-center gap-3 h-16 px-4">
          <Link to="/#notice">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> ফিরে যান</Button>
          </Link>
          <span className="font-semibold text-foreground">নোটিশ বিস্তারিত</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <article className="bg-card rounded-2xl border p-6 sm:p-8 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            {new Date(notice.created_at).toLocaleDateString("bn-BD", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">{notice.title}</h1>

          {notice.content && (
            <div className="prose prose-sm max-w-none text-foreground/85 mb-8 whitespace-pre-wrap">
              {notice.content}
            </div>
          )}

          {fileUrl && (
            <div className="border rounded-xl p-4 bg-section-alt">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
                {isImage(notice.file_url!) ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                সংযুক্ত ফাইল
              </div>

              {isImage(notice.file_url!) && (
                <img
                  src={fileUrl}
                  alt={notice.title}
                  className="w-full max-h-[600px] object-contain rounded-lg mb-3"
                />
              )}

              {isPdf(notice.file_url!) && (
                <iframe
                  src={fileUrl}
                  className="w-full h-[600px] rounded-lg border mb-3"
                  title={notice.title}
                />
              )}

              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" /> ডাউনলোড করুন
                </Button>
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default NoticeDetail;
