import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LeaderPage from "./pages/LeaderPage";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Article from "./pages/Article";
import Editions from "./pages/Editions";
import CategoryArticles from "./pages/CategoryArticles";
import Leaders from "./pages/Leaders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/artigo/:slug" element={<Article />} />
            <Route path="/edicoes" element={<Editions />} />
            <Route path="/categoria/:slug" element={<CategoryArticles />} />
            <Route path="/lider/:id" element={<LeaderPage />} />
            <Route path="/lideres" element={<Leaders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
