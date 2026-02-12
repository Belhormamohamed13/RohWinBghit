import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'À propos', to: '/about' },
      { label: 'Fonctionnement', to: '/how-it-works' },
      { label: 'Recrutement', to: '/careers' },
      { label: 'Presse', to: '/press' },
    ],
    support: [
      { label: 'Centre d\'Aide', to: '/help' },
      { label: 'Sécurité', to: '/safety' },
      { label: 'Conditions', to: '/terms' },
      { label: 'Confidentialité', to: '/privacy' },
    ],
    community: [
      { label: 'Devenir Conducteur', to: '/register' },
      { label: 'Règles d\'Élite', to: '/guidelines' },
      { label: 'Impact CO2', to: '/eco-friendly' },
    ],
  };

  const socialLinks = [
    { icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png', label: 'Facebook' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/733/733579.png', label: 'Twitter' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png', label: 'Instagram' },
    { icon: 'https://cdn-icons-png.flaticon.com/512/145/145807.png', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12 mb-20">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all">
                <span className="material-symbols-outlined text-slate-900 font-black text-2xl italic">drive_eta</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-widest leading-none">RohWin<span className="text-primary">Bghit</span></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">L'intelligence Collective</span>
              </div>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm font-medium">
              La première plateforme de mobilité partagée en Algérie.
              Nous connectons les wilayas avec style, sécurité et économie.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white/5 hover:bg-primary rounded-xl flex items-center justify-center transition-all group shadow-inner border border-white/5">
                  <img src={social.icon} alt={social.label} className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:brightness-0 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8">Navigation</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-primary text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 group">
                    <span className="h-[2px] w-0 bg-primary group-hover:w-3 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8">Communauté</h3>
            <ul className="space-y-4">
              {footerLinks.community.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-primary text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 group">
                    <span className="h-[2px] w-0 bg-primary group-hover:w-3 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8">Assistance</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5 group-hover:bg-primary group-hover:text-slate-900 transition-all">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black tracking-widest leading-none">EMAIL</p>
                  <p className="text-xs font-black text-white mt-1">info@rohwin.dz</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5 group-hover:bg-primary group-hover:text-slate-900 transition-all">
                  <span className="material-symbols-outlined text-lg">call</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black tracking-widest leading-none">SUPPORT 24/7</p>
                  <p className="text-xs font-black text-white mt-1">+213 555 123 456</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              © {currentYear} ROHWINBGHIT. MADE WITH ❤️ IN DZ.
            </p>
          </div>

          <div className="flex items-center gap-8">
            {footerLinks.support.slice(2).map(link => (
              <Link key={link.to} to={link.to} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">{link.label}</Link>
            ))}
            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
            <span className="text-[10px] font-black text-primary">v2.4.0 (PREMIUM)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
