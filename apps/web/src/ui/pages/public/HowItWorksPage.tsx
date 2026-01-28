export function HowItWorksPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Comment ça marche</h1>
      <p className="mt-2 text-sm text-slate-600">
        Le fonctionnement suit un parcours simple (recherche → réservation → acceptation → paiement
        → trajet → avis).
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">1</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">Recherchez</div>
          <div className="mt-1 text-sm text-slate-600">Départ, arrivée, date, places.</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">2</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">Réservez</div>
          <div className="mt-1 text-sm text-slate-600">Envoyez une demande au conducteur.</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">3</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">Payez</div>
          <div className="mt-1 text-sm text-slate-600">
            Après acceptation: Cash ou simulation CIB/BaridiMob.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">4</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">Voyagez & notez</div>
          <div className="mt-1 text-sm text-slate-600">Laissez un avis après le trajet.</div>
        </div>
      </div>
    </div>
  );
}

