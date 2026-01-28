import { NavLink } from "react-router-dom";

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink className="text-sm text-slate-600 hover:text-slate-900" to={to}>
      {label}
    </NavLink>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">RohWinBghit</div>
            <div className="mt-2 text-sm text-slate-600">
              Plateforme de covoiturage inter-wilayas en Algérie. Paiement Cash et simulation CIB /
              BaridiMob. Messagerie et notifications en temps réel.
            </div>
          </div>

          <div className="grid gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Découvrir
            </div>
            <FooterLink to="/how-it-works" label="Comment ça marche" />
            <FooterLink to="/trust-safety" label="Confiance & sécurité" />
            <FooterLink to="/contact" label="Contact" />
          </div>

          <div className="grid gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Légal</div>
            <FooterLink to="/legal/cgu" label="CGU" />
            <FooterLink to="/legal/privacy" label="Confidentialité" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} RohWinBghit</div>
          <div>Optimisé pour “covoiturage Algérie”</div>
        </div>
      </div>
    </footer>
  );
}

