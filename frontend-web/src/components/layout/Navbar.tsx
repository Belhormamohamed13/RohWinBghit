import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-primary/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-3xl font-display tracking-wider text-primary">RohWinBghit</Link>
        <div className="hidden lg:flex gap-6 text-base font-medium text-slate-300">
          <Link to="/trips/search" className="hover:text-primary transition-colors">Covoiturage</Link>
          <Link to="/modal/bus" className="hover:text-primary transition-colors">Bus</Link>
          <Link to="/modal/train" className="hover:text-primary transition-colors">Train</Link>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link to="/trips/search" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-primary transition-colors hover:bg-white/5 py-2 px-3 rounded-full">
          <span className="material-icons-round text-primary text-xl">search</span>
          <span>Rechercher</span>
        </Link>
        <Link to="/driver/" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-primary transition-colors hover:bg-white/5 py-2 px-3 rounded-full">
          <span className="material-icons-round text-primary text-xl">add_circle_outline</span>
          <span>Publier un trajet</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="h-10 w-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
          <span className="material-icons-round text-primary hover:text-inherit text-xl">person</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
