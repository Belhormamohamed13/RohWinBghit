export function TrustSafetyPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Confiance & sécurité</h1>
      <p className="mt-2 text-sm text-slate-600">
        RohWinBghit renforce la confiance via profils, avis, vérifications, messagerie sécurisée,
        et modération.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">Profils et avis</div>
          <p className="mt-2 text-sm text-slate-600">
            Notes, commentaires et historique rendent l’expérience plus transparente.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">Vérification</div>
          <p className="mt-2 text-sm text-slate-600">
            Email et téléphone (SMS) pour limiter les comptes frauduleux.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">Signalements</div>
          <p className="mt-2 text-sm text-slate-600">
            Les utilisateurs peuvent signaler un comportement inapproprié; les admins traitent les
            litiges.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">Paiements</div>
          <p className="mt-2 text-sm text-slate-600">
            Cash et paiement en ligne simulé (CIB/BaridiMob) avec suivi des statuts.
          </p>
        </div>
      </div>
    </div>
  );
}

