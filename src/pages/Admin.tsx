import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/magazine/ImageUpload";
import { 
  LayoutDashboard, FileText, FolderOpen, Tag, BookOpen, 
  MessageSquare, LogOut, Plus, Pencil, Trash2, Eye, EyeOff, Image, Users, UserCheck, Video
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tab = "articles" | "categories" | "editions" | "comments" | "banners" | "subscribers" | "leaders" | "interviews";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("articles");
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editions, setEditions] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "", slug: "", excerpt: "", content: "", author_name: "Redação",
    category_id: "", edition_id: "", is_featured: false, is_published: false,
    cover_image_url: "",
  });
  const [catForm, setCatForm] = useState({ name: "", slug: "", description: "", color: "#C8A02B" });
  const [edForm, setEdForm] = useState({ title: "", edition_number: 1, description: "", cover_image_url: "", is_published: false });
  const [bannerForm, setBannerForm] = useState({ title: "", image_url: "", link_url: "", position: "homepage", is_active: true, display_order: 0 });
  const [leaderForm, setLeaderForm] = useState({ name: "", role: "", sector: "", quote: "", bio: "", photo_url: "", display_order: 0, is_published: false });
  const [interviewForm, setInterviewForm] = useState({ title: "", interviewee_name: "", interviewee_role: "", interviewee_photo_url: "", quote: "", video_url: "", video_duration: "", tags: "" as string, is_published: false, display_order: 0 });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    const [artRes, catRes, edRes, comRes, banRes, subRes, leadRes, intRes] = await Promise.all([
      supabase.from('articles' as any).select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories' as any).select('*').order('name'),
      supabase.from('editions' as any).select('*').order('edition_number', { ascending: false }),
      supabase.from('comments' as any).select('*, articles(title)').order('created_at', { ascending: false }),
      supabase.from('banners' as any).select('*').order('display_order'),
      supabase.from('subscribers' as any).select('*').order('created_at', { ascending: false }),
      supabase.from('leader_profiles' as any).select('*').order('display_order'),
      supabase.from('interviews' as any).select('*').order('display_order'),
    ]);
    if (artRes.data) setArticles(artRes.data as any[]);
    if (catRes.data) setCategories(catRes.data as any[]);
    if (edRes.data) setEditions(edRes.data as any[]);
    if (comRes.data) setComments(comRes.data as any[]);
    if (banRes.data) setBanners(banRes.data as any[]);
    if (subRes.data) setSubscribers(subRes.data as any[]);
    if (leadRes.data) setLeaders(leadRes.data as any[]);
    if (intRes.data) setInterviews(intRes.data as any[]);
  };

  const handleSaveArticle = async () => {
    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const data = { ...formData, slug, published_at: formData.is_published ? new Date().toISOString() : null };
    if (!data.category_id) delete (data as any).category_id;
    if (!data.edition_id) delete (data as any).edition_id;
    if (editingItem) {
      const { error } = await supabase.from('articles' as any).update(data).eq('id', editingItem.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from('articles' as any).insert(data as any);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Sucesso", description: "Artigo guardado!" });
    resetForm(); fetchAll();
  };

  const handleSaveCategory = async () => {
    const slug = catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const data = { ...catForm, slug };
    if (editingItem) {
      const { error } = await supabase.from('categories' as any).update(data).eq('id', editingItem.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from('categories' as any).insert(data as any);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Sucesso", description: "Categoria guardada!" });
    resetForm(); fetchAll();
  };

  const handleSaveEdition = async () => {
    const data = { ...edForm, published_at: edForm.is_published ? new Date().toISOString() : null };
    if (editingItem) {
      const { error } = await supabase.from('editions' as any).update(data).eq('id', editingItem.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from('editions' as any).insert(data as any);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Sucesso", description: "Edição guardada!" });
    resetForm(); fetchAll();
  };

  const handleSaveBanner = async () => {
    if (editingItem) {
      const { error } = await supabase.from('banners' as any).update(bannerForm).eq('id', editingItem.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from('banners' as any).insert(bannerForm as any);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Sucesso", description: "Banner guardado!" });
    resetForm(); fetchAll();
  };

  const handleSaveLeader = async () => {
    if (editingItem) {
      const { error } = await supabase.from('leader_profiles' as any).update(leaderForm).eq('id', editingItem.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from('leader_profiles' as any).insert(leaderForm as any);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Sucesso", description: "Perfil guardado!" });
    resetForm(); fetchAll();
  };

  const handleSaveInterview = async () => {
    const data = {
      ...interviewForm,
      tags: interviewForm.tags ? interviewForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    };
    if (editingItem) {
      const { error } = await supabase.from('interviews' as any).update(data).eq('id', editingItem.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from('interviews' as any).insert(data as any);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Sucesso", description: "Entrevista guardada!" });
    resetForm(); fetchAll();
  };

  const handleDelete = async (table: string, id: string) => {
    const { error } = await supabase.from(table as any).delete().eq('id', id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Eliminado" }); fetchAll();
  };

  const handleApproveComment = async (id: string, approved: boolean) => {
    await supabase.from('comments' as any).update({ is_approved: approved }).eq('id', id);
    fetchAll();
  };

  const resetForm = () => {
    setShowForm(false); setEditingItem(null);
    setFormData({ title: "", slug: "", excerpt: "", content: "", author_name: "Redação", category_id: "", edition_id: "", is_featured: false, is_published: false, cover_image_url: "" });
    setCatForm({ name: "", slug: "", description: "", color: "#C8A02B" });
    setEdForm({ title: "", edition_number: 1, description: "", cover_image_url: "", is_published: false });
    setBannerForm({ title: "", image_url: "", link_url: "", position: "homepage", is_active: true, display_order: 0 });
    setLeaderForm({ name: "", role: "", sector: "", quote: "", bio: "", photo_url: "", display_order: 0, is_published: false });
    setInterviewForm({ title: "", interviewee_name: "", interviewee_role: "", interviewee_photo_url: "", quote: "", video_url: "", video_duration: "", tags: "", is_published: false, display_order: 0 });
  };

  const editArticle = (a: any) => {
    setEditingItem(a);
    setFormData({ title: a.title, slug: a.slug, excerpt: a.excerpt || "", content: a.content || "", author_name: a.author_name, category_id: a.category_id || "", edition_id: a.edition_id || "", is_featured: a.is_featured, is_published: a.is_published, cover_image_url: a.cover_image_url || "" });
    setShowForm(true);
  };
  const editCategory = (c: any) => { setEditingItem(c); setCatForm({ name: c.name, slug: c.slug, description: c.description || "", color: c.color || "#C8A02B" }); setShowForm(true); };
  const editEdition = (e: any) => { setEditingItem(e); setEdForm({ title: e.title, edition_number: e.edition_number, description: e.description || "", cover_image_url: e.cover_image_url || "", is_published: e.is_published }); setShowForm(true); };
  const editBanner = (b: any) => { setEditingItem(b); setBannerForm({ title: b.title, image_url: b.image_url, link_url: b.link_url || "", position: b.position, is_active: b.is_active, display_order: b.display_order }); setShowForm(true); };
  const editLeader = (l: any) => { setEditingItem(l); setLeaderForm({ name: l.name, role: l.role, sector: l.sector, quote: l.quote || "", bio: l.bio || "", photo_url: l.photo_url || "", display_order: l.display_order, is_published: l.is_published }); setShowForm(true); };
  const editInterview = (i: any) => { setEditingItem(i); setInterviewForm({ title: i.title, interviewee_name: i.interviewee_name, interviewee_role: i.interviewee_role || "", interviewee_photo_url: i.interviewee_photo_url || "", quote: i.quote || "", video_url: i.video_url || "", video_duration: i.video_duration || "", tags: (i.tags || []).join(', '), is_published: i.is_published, display_order: i.display_order }); setShowForm(true); };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary animate-pulse text-xl">A carregar...</div></div>;

  const tabs = [
    { id: "articles" as Tab, label: "Artigos", icon: FileText, count: articles.length },
    { id: "categories" as Tab, label: "Categorias", icon: Tag, count: categories.length },
    { id: "editions" as Tab, label: "Edições", icon: BookOpen, count: editions.length },
    { id: "leaders" as Tab, label: "Líderes", icon: UserCheck, count: leaders.length },
    { id: "interviews" as Tab, label: "Entrevistas", icon: Video, count: interviews.length },
    { id: "banners" as Tab, label: "Banners", icon: Image, count: banners.length },
    { id: "comments" as Tab, label: "Comentários", icon: MessageSquare, count: comments.length },
    { id: "subscribers" as Tab, label: "Subscritores", icon: Users, count: subscribers.length },
  ];

  const inputClass = "w-full h-12 px-4 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  const textareaClass = "w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[120px]";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-sans">Admin</span>
            <h1 className="text-xl font-serif font-bold text-gradient-gold">Líderes Angola</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Ver Site</a>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/admin/login"); }}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-73px)] p-4 hidden md:block">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); resetForm(); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <span className="flex items-center gap-3"><tab.icon className="w-4 h-4" />{tab.label}</span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{tab.count}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex gap-2 mb-6 md:hidden overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); resetForm(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold text-foreground capitalize">{tabs.find(t => t.id === activeTab)?.label}</h2>
            {!["comments", "subscribers"].includes(activeTab) && (
              <Button variant="gold" size="sm" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                <Plus className="w-4 h-4 mr-2" /> {showForm ? "Cancelar" : "Novo"}
              </Button>
            )}
          </div>

          {/* Article Form */}
          {showForm && activeTab === "articles" && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
              <input placeholder="Título" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} />
              <input placeholder="Slug (auto)" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className={inputClass} />
              <input placeholder="Autor" value={formData.author_name} onChange={(e) => setFormData({ ...formData, author_name: e.target.value })} className={inputClass} />
              <ImageUpload value={formData.cover_image_url} onChange={(url) => setFormData({ ...formData, cover_image_url: url })} folder="articles" label="Imagem de capa do artigo" />
              <textarea placeholder="Excerto" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className={textareaClass} />
              <textarea placeholder="Conteúdo (suporta markdown)" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className={textareaClass} rows={10} />
              <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className={inputClass}>
                <option value="">Selecionar Categoria</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={formData.edition_id} onChange={(e) => setFormData({ ...formData, edition_id: e.target.value })} className={inputClass}>
                <option value="">Selecionar Edição</option>
                {editions.map((e) => <option key={e.id} value={e.id}>#{e.edition_number} - {e.title}</option>)}
              </select>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="accent-primary" /> Destaque
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="accent-primary" /> Publicado
                </label>
              </div>
              <Button variant="gold" onClick={handleSaveArticle}>{editingItem ? "Atualizar" : "Criar"} Artigo</Button>
            </div>
          )}

          {/* Category Form */}
          {showForm && activeTab === "categories" && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
              <input placeholder="Nome" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className={inputClass} />
              <input placeholder="Slug (auto)" value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} className={inputClass} />
              <textarea placeholder="Descrição" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className={textareaClass} />
              <div className="flex items-center gap-3">
                <label className="text-sm text-foreground">Cor:</label>
                <input type="color" value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })} />
              </div>
              <Button variant="gold" onClick={handleSaveCategory}>{editingItem ? "Atualizar" : "Criar"} Categoria</Button>
            </div>
          )}

          {/* Edition Form */}
          {showForm && activeTab === "editions" && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
              <input placeholder="Título" value={edForm.title} onChange={(e) => setEdForm({ ...edForm, title: e.target.value })} className={inputClass} />
              <input type="number" placeholder="Número da Edição" value={edForm.edition_number} onChange={(e) => setEdForm({ ...edForm, edition_number: parseInt(e.target.value) })} className={inputClass} />
              <ImageUpload value={edForm.cover_image_url} onChange={(url) => setEdForm({ ...edForm, cover_image_url: url })} folder="editions" label="Capa da edição" />
              <textarea placeholder="Descrição" value={edForm.description} onChange={(e) => setEdForm({ ...edForm, description: e.target.value })} className={textareaClass} />
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={edForm.is_published} onChange={(e) => setEdForm({ ...edForm, is_published: e.target.checked })} className="accent-primary" /> Publicada
              </label>
              <Button variant="gold" onClick={handleSaveEdition}>{editingItem ? "Atualizar" : "Criar"} Edição</Button>
            </div>
          )}

          {/* Banner Form */}
          {showForm && activeTab === "banners" && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
              <input placeholder="Título do banner" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} className={inputClass} />
              <ImageUpload value={bannerForm.image_url} onChange={(url) => setBannerForm({ ...bannerForm, image_url: url })} folder="banners" label="Imagem do banner" />
              <input placeholder="Link de destino (opcional)" value={bannerForm.link_url} onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })} className={inputClass} />
              <select value={bannerForm.position} onChange={(e) => setBannerForm({ ...bannerForm, position: e.target.value })} className={inputClass}>
                <option value="homepage">Página Inicial</option>
                <option value="sidebar">Barra Lateral</option>
                <option value="article">Página de Artigo</option>
              </select>
              <input type="number" placeholder="Ordem de exibição" value={bannerForm.display_order} onChange={(e) => setBannerForm({ ...bannerForm, display_order: parseInt(e.target.value) || 0 })} className={inputClass} />
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={bannerForm.is_active} onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })} className="accent-primary" /> Ativo
              </label>
              <Button variant="gold" onClick={handleSaveBanner}>{editingItem ? "Atualizar" : "Criar"} Banner</Button>
            </div>
          )}

          {/* Leader Form */}
          {showForm && activeTab === "leaders" && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
              <input placeholder="Nome completo" value={leaderForm.name} onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })} className={inputClass} />
              <input placeholder="Cargo (ex: CEO, Fundador)" value={leaderForm.role} onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })} className={inputClass} />
              <input placeholder="Sector (ex: Tecnologia, Finanças)" value={leaderForm.sector} onChange={(e) => setLeaderForm({ ...leaderForm, sector: e.target.value })} className={inputClass} />
              <ImageUpload value={leaderForm.photo_url} onChange={(url) => setLeaderForm({ ...leaderForm, photo_url: url })} folder="leaders" label="Foto do líder" />
              <textarea placeholder="Citação inspiradora" value={leaderForm.quote} onChange={(e) => setLeaderForm({ ...leaderForm, quote: e.target.value })} className={textareaClass} />
              <textarea placeholder="Biografia (opcional)" value={leaderForm.bio} onChange={(e) => setLeaderForm({ ...leaderForm, bio: e.target.value })} className={textareaClass} />
              <input type="number" placeholder="Ordem de exibição" value={leaderForm.display_order} onChange={(e) => setLeaderForm({ ...leaderForm, display_order: parseInt(e.target.value) || 0 })} className={inputClass} />
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={leaderForm.is_published} onChange={(e) => setLeaderForm({ ...leaderForm, is_published: e.target.checked })} className="accent-primary" /> Publicado
              </label>
              <Button variant="gold" onClick={handleSaveLeader}>{editingItem ? "Atualizar" : "Criar"} Perfil</Button>
            </div>
          )}

          {/* Interview Form */}
          {showForm && activeTab === "interviews" && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
              <input placeholder="Título da entrevista" value={interviewForm.title} onChange={(e) => setInterviewForm({ ...interviewForm, title: e.target.value })} className={inputClass} />
              <input placeholder="Nome do entrevistado" value={interviewForm.interviewee_name} onChange={(e) => setInterviewForm({ ...interviewForm, interviewee_name: e.target.value })} className={inputClass} />
              <input placeholder="Cargo do entrevistado" value={interviewForm.interviewee_role} onChange={(e) => setInterviewForm({ ...interviewForm, interviewee_role: e.target.value })} className={inputClass} />
              <ImageUpload value={interviewForm.interviewee_photo_url} onChange={(url) => setInterviewForm({ ...interviewForm, interviewee_photo_url: url })} folder="interviews" label="Foto do entrevistado" />
              <textarea placeholder="Citação em destaque" value={interviewForm.quote} onChange={(e) => setInterviewForm({ ...interviewForm, quote: e.target.value })} className={textareaClass} />
              <input placeholder="URL do vídeo (YouTube, Vimeo, etc.)" value={interviewForm.video_url} onChange={(e) => setInterviewForm({ ...interviewForm, video_url: e.target.value })} className={inputClass} />
              <input placeholder="Duração do vídeo (ex: 15:32)" value={interviewForm.video_duration} onChange={(e) => setInterviewForm({ ...interviewForm, video_duration: e.target.value })} className={inputClass} />
              <input placeholder="Tags (separadas por vírgula)" value={interviewForm.tags} onChange={(e) => setInterviewForm({ ...interviewForm, tags: e.target.value })} className={inputClass} />
              <input type="number" placeholder="Ordem de exibição" value={interviewForm.display_order} onChange={(e) => setInterviewForm({ ...interviewForm, display_order: parseInt(e.target.value) || 0 })} className={inputClass} />
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={interviewForm.is_published} onChange={(e) => setInterviewForm({ ...interviewForm, is_published: e.target.checked })} className="accent-primary" /> Publicada
              </label>
              <Button variant="gold" onClick={handleSaveInterview}>{editingItem ? "Atualizar" : "Criar"} Entrevista</Button>
            </div>
          )}

          {/* Article List */}
          {activeTab === "articles" && !showForm && (
            <div className="space-y-3">
              {articles.length === 0 && <p className="text-muted-foreground text-center py-12">Nenhum artigo criado ainda.</p>}
              {articles.map((a) => (
                <div key={a.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {a.cover_image_url && <img src={a.cover_image_url} alt="" className="w-16 h-12 object-cover rounded hidden sm:block" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {a.is_published ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                        {a.categories?.name && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{a.categories.name}</span>}
                        {a.is_featured && <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">Destaque</span>}
                      </div>
                      <h3 className="font-serif font-medium text-foreground truncate">{a.title}</h3>
                      <p className="text-xs text-muted-foreground">{a.author_name} • {new Date(a.created_at).toLocaleDateString('pt-PT')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => editArticle(a)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete('articles', a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category List */}
          {activeTab === "categories" && !showForm && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                    <h3 className="font-serif font-medium text-foreground">{c.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{c.description}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => editCategory(c)}><Pencil className="w-3 h-3 mr-1" /> Editar</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete('categories', c.id)}><Trash2 className="w-3 h-3 mr-1 text-destructive" /> Eliminar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edition List */}
          {activeTab === "editions" && !showForm && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {editions.length === 0 && <p className="text-muted-foreground text-center py-12 col-span-full">Nenhuma edição criada ainda.</p>}
              {editions.map((e) => (
                <div key={e.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  {e.cover_image_url && <img src={e.cover_image_url} alt={e.title} className="w-full h-40 object-cover" />}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {e.is_published ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs text-muted-foreground">Edição #{e.edition_number}</span>
                    </div>
                    <h3 className="font-serif font-medium text-foreground">{e.title}</h3>
                    <div className="flex gap-2 mt-3">
                      <Button variant="ghost" size="sm" onClick={() => editEdition(e)}><Pencil className="w-3 h-3 mr-1" /> Editar</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete('editions', e.id)}><Trash2 className="w-3 h-3 mr-1 text-destructive" /> Eliminar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Banner List */}
          {activeTab === "banners" && !showForm && (
            <div className="grid sm:grid-cols-2 gap-4">
              {banners.length === 0 && <p className="text-muted-foreground text-center py-12 col-span-full">Nenhum banner criado ainda.</p>}
              {banners.map((b) => (
                <div key={b.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <img src={b.image_url} alt={b.title} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      {b.is_active ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs text-muted-foreground capitalize">{b.position}</span>
                    </div>
                    <h3 className="font-serif font-medium text-foreground">{b.title}</h3>
                    <div className="flex gap-2 mt-3">
                      <Button variant="ghost" size="sm" onClick={() => editBanner(b)}><Pencil className="w-3 h-3 mr-1" /> Editar</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete('banners', b.id)}><Trash2 className="w-3 h-3 mr-1 text-destructive" /> Eliminar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leader List */}
          {activeTab === "leaders" && !showForm && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaders.length === 0 && <p className="text-muted-foreground text-center py-12 col-span-full">Nenhum perfil de líder criado ainda.</p>}
              {leaders.map((l) => (
                <div key={l.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  {l.photo_url && <img src={l.photo_url} alt={l.name} className="w-full h-40 object-cover" />}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {l.is_published ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{l.sector}</span>
                    </div>
                    <h3 className="font-serif font-medium text-foreground">{l.name}</h3>
                    <p className="text-xs text-muted-foreground">{l.role}</p>
                    {l.quote && <p className="text-xs text-muted-foreground italic mt-2 line-clamp-2">"{l.quote}"</p>}
                    <div className="flex gap-2 mt-3">
                      <Button variant="ghost" size="sm" onClick={() => editLeader(l)}><Pencil className="w-3 h-3 mr-1" /> Editar</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete('leader_profiles', l.id)}><Trash2 className="w-3 h-3 mr-1 text-destructive" /> Eliminar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interview List */}
          {activeTab === "interviews" && !showForm && (
            <div className="space-y-3">
              {interviews.length === 0 && <p className="text-muted-foreground text-center py-12">Nenhuma entrevista criada ainda.</p>}
              {interviews.map((i) => (
                <div key={i.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {i.interviewee_photo_url && <img src={i.interviewee_photo_url} alt="" className="w-14 h-14 object-cover rounded-full hidden sm:block" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {i.is_published ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                        {i.video_url && <Video className="w-3 h-3 text-primary" />}
                        {i.video_duration && <span className="text-xs text-muted-foreground">{i.video_duration}</span>}
                      </div>
                      <h3 className="font-serif font-medium text-foreground truncate">{i.title}</h3>
                      <p className="text-xs text-muted-foreground">{i.interviewee_name} • {i.interviewee_role}</p>
                      {i.tags?.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {i.tags.map((t: string) => <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{t}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => editInterview(i)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete('interviews', i.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment List */}
          {activeTab === "comments" && (
            <div className="space-y-3">
              {comments.length === 0 && <p className="text-muted-foreground text-center py-12">Nenhum comentário ainda.</p>}
              {comments.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${c.is_approved ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"}`}>
                      {c.is_approved ? "Aprovado" : "Pendente"}
                    </span>
                    <span className="text-xs text-muted-foreground">em "{c.articles?.title}"</span>
                  </div>
                  <p className="text-sm text-foreground">{c.content}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">{c.author_name} • {new Date(c.created_at).toLocaleDateString('pt-PT')}</span>
                    <div className="flex gap-2">
                      {!c.is_approved && <Button variant="ghost" size="sm" onClick={() => handleApproveComment(c.id, true)} className="text-green-500">Aprovar</Button>}
                      {c.is_approved && <Button variant="ghost" size="sm" onClick={() => handleApproveComment(c.id, false)} className="text-amber-500">Rejeitar</Button>}
                      <Button variant="ghost" size="sm" onClick={() => handleDelete('comments', c.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subscriber List */}
          {activeTab === "subscribers" && (
            <div className="space-y-3">
              {subscribers.length === 0 && <p className="text-muted-foreground text-center py-12">Nenhum subscritor ainda.</p>}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-sm text-muted-foreground font-sans">Email</th>
                      <th className="text-left px-4 py-3 text-sm text-muted-foreground font-sans">Data</th>
                      <th className="text-left px-4 py-3 text-sm text-muted-foreground font-sans">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-sm text-foreground">{s.email}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString('pt-PT')}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded ${s.is_active ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}>
                            {s.is_active ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
