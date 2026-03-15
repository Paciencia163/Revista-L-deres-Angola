import { MessageCircle, Linkedin, Twitter, Link2, Check } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  title: string;
  url?: string;
  className?: string;
}

export const SocialShare = ({ title, url, className = "" }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
      color: "hover:bg-[#25D366]/10 hover:text-[#25D366]",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
      color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Twitter,
      color: "hover:bg-foreground/10 hover:text-foreground",
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs uppercase tracking-wider text-muted-foreground mr-1">Partilhar</span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Partilhar no ${link.label}`}
          className={`w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 ${link.color}`}
        >
          <link.icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copiar link"
        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
