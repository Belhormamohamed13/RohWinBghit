import { NavLink } from "react-router-dom";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "text-sm font-medium transition-colors hover:text-slate-900",
          isActive ? "text-slate-900" : "text-slate-600"
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-blue" aria-hidden="true" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">RohWinBghit</div>
            <div className="text-xs text-slate-500">Covoiturage Algérie</div>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          <NavItem to="/" label="Accueil" />
          <NavItem to="/how-it-works" label="Comment ça marche" />
          <NavItem to="/trust-safety" label="Confiance & sécurité" />
          <NavItem to="/contact" label="Contact" />
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Connexion
          </NavLink>
          <NavLink
            to="/register"
            className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark"
          >
            Inscription
          </NavLink>
        </div>
      </div>
    </header>
  );
}

