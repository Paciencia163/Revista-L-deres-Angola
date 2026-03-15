import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  sections: [
    { label: "Líderes", href: "#lideres" },
    { label: "Negócios", href: "#negocios" },
    { label: "Inovação", href: "#inovacao" },
    { label: "Entrevistas", href: "#entrevistas" },
    { label: "Opinião", href: "#opiniao" },
  ],
  company: [
    { label: "Sobre Nós", href: "#" },
    { label: "Equipa Editorial", href: "#" },
    { label: "Anunciar", href: "#" },
    { label: "Contactos", href: "#" },
    { label: "Carreiras", href: "#" },
  ],
  legal: [
    { label: "Termos de Uso", href: "#" },
    { label: "Política de Privacidade", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-sans">
                Revista
              </span>
              <span className="text-2xl font-serif font-bold text-gradient-gold">
                Líderes Angola
              </span>
            </a>
            <p className="body-text mt-4">
              A revista de referência para líderes, executivos e empreendedores angolanos.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Secções</h4>
            <ul className="space-y-3">
              {footerLinks.sections.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="block text-foreground">Email</span>
                angolajobssummit@gmail.com
              </li>
              <li>
                <span className="block text-foreground">Telefone</span>
                +244 922 812 224
              </li>
              <li>
                <span className="block text-foreground">Endereço</span>
                Luanda, Angola
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Revista Líderes Angola. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
