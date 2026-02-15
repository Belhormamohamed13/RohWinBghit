import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div>
            <h5 className="text-white font-display text-xl mb-6 tracking-wide">Plateforme</h5>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/trips/search" className="hover:text-primary transition-colors">Covoiturage</Link></li>
              <li><Link to="/modal/bus" className="hover:text-primary transition-colors">Bus Inter-wilayas</Link></li>
              <li><Link to="/modal/train" className="hover:text-primary transition-colors">Horaires Trains</Link></li>
              <li><Link to="/destinations" className="hover:text-primary transition-colors">Villes desservies</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-display text-xl mb-6 tracking-wide">À propos</h5>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-primary transition-colors">Qui sommes-nous ?</Link></li>
              <li><Link to="/commitments" className="hover:text-primary transition-colors">Nos engagements</Link></li>
              <li><Link to="/press" className="hover:text-primary transition-colors">Presse</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Carrières</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-display text-xl mb-6 tracking-wide">Support</h5>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/help" className="hover:text-primary transition-colors">Centre d'aide</Link></li>
              <li><Link to="/safety" className="hover:text-primary transition-colors">Règles de sécurité</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Conditions générales</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-display text-xl mb-6 tracking-wide">Suivez-nous</h5>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all">
                <span className="material-icons-round text-lg text-white group-hover:text-background-dark">facebook</span>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all">
                <span className="material-icons-round text-lg text-white group-hover:text-background-dark">camera_alt</span>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all">
                <span className="material-icons-round text-lg text-white group-hover:text-background-dark">alternate_email</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5">
          <p className="text-xs text-slate-500 mb-4 md:mb-0">© 2026 RohWinBghit Algerie. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <button className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-2 transition-colors">
              <span className="material-icons-round text-sm">language</span> FRANÇAIS (DZ)
            </button>
            <button className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-2 transition-colors">
              <span className="material-icons-round text-sm">payments</span> DZD (DA)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
