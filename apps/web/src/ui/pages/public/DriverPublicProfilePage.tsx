import { Link, useParams } from "react-router-dom";

export function DriverPublicProfilePage() {
  const { userId } = useParams();

  return (
    <div className="container-page py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200" aria-hidden="true" />
            <div>
              <div className="text-xl font-semibold text-slate-900">Ahmed Benali</div>
              <div className="text-sm text-slate-600">⭐ 4.8 / 5 (15 avis) • Membre depuis 2024</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-700">
                <span className="rounded-full bg-slate-100 px-3 py-1">✓ Email vérifié</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">✓ Téléphone vérifié</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
              Contacter
            </button>
            <button className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
              Signaler
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Trajets (conducteur)
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">23</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Taux d’acceptation
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">95%</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Temps de réponse
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">~15 min</div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-900">À propos</div>
            <p className="mt-2 text-sm text-slate-700">
              Conducteur expérimenté, conduite prudente et ponctualité. Je préfère une ambiance
              calme et respectueuse.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">🚭 Non-fumeur</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">🎵 Musique</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">🇩🇿 FR/AR</span>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-900">Véhicules</div>
            <div className="mt-3 grid gap-3">
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                Renault Symbol • Blanc • 2018 • ❄ Clim
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                Hyundai Tucson • Noir • 2021 • ❄ Clim
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-semibold text-slate-900">Avis récents</div>
            <Link className="text-sm text-brand-blue hover:underline" to={`/users/${userId}/reviews`}>
              Voir tous
            </Link>
          </div>
          <div className="mt-3 grid gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-sm font-medium text-slate-900">⭐⭐⭐⭐⭐ Excellent !</div>
              <div className="mt-1 text-xs text-slate-600">Karim M. • Trajet Alger → Oran</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-sm font-medium text-slate-900">⭐⭐⭐⭐☆ Très bien</div>
              <div className="mt-1 text-xs text-slate-600">Amina B. • Trajet Oran → Constantine</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

