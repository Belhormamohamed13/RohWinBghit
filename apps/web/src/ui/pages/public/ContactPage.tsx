export function ContactPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Contact</h1>
      <p className="mt-2 text-sm text-slate-600">
        Pour toute question (réservations, paiements, signalements), contactez l’équipe RohWinBghit.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">Email</div>
          <div className="mt-2 text-sm text-slate-600">support@rohwinbghit.dz</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">Sécurité & abus</div>
          <div className="mt-2 text-sm text-slate-600">trust@rohwinbghit.dz</div>
        </div>
      </div>
    </div>
  );
}

