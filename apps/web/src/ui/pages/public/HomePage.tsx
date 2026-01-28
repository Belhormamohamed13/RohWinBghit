import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  from: z.string().min(2, "Ville de départ requise"),
  to: z.string().min(2, "Ville d'arrivée requise"),
  date: z.string().min(1, "Date requise"),
  seats: z.coerce.number().int().min(1).max(4)
});

type FormValues = z.infer<typeof schema>;

export function HomePage() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { from: "", to: "", date: "", seats: 1 }
  });

  function onSubmit(values: FormValues) {
    const params = new URLSearchParams({
      from: values.from,
      to: values.to,
      date: values.date,
      seats: String(values.seats)
    });
    navigate(`/search?${params.toString()}`);
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-50">
        <div className="container-page py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Voyagez malin, partagez plus
              </h1>
              <p className="mt-3 text-base text-slate-600">
                Plateforme de covoiturage inter-wilayas en Algérie — inspirée des meilleurs
                standards de confiance, simplicité et performance.
              </p>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Départ</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                      placeholder="Ex: Alger"
                      {...form.register("from")}
                    />
                    {form.formState.errors.from && (
                      <p className="mt-1 text-xs text-red-600">{form.formState.errors.from.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Arrivée</label>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                      placeholder="Ex: Oran"
                      {...form.register("to")}
                    />
                    {form.formState.errors.to && (
                      <p className="mt-1 text-xs text-red-600">{form.formState.errors.to.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Date</label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                      {...form.register("date")}
                    />
                    {form.formState.errors.date && (
                      <p className="mt-1 text-xs text-red-600">{form.formState.errors.date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Places</label>
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                      {...form.register("seats")}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-brand-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                >
                  Rechercher
                </button>
                <p className="mt-2 text-xs text-slate-500">
                  Vous paierez après acceptation (Cash ou simulation CIB/BaridiMob).
                </p>
              </form>
            </div>

            <div className="hidden md:block">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pourquoi RohWinBghit ?
                </div>
                <ul className="mt-4 grid gap-3 text-sm text-slate-700">
                  <li>
                    <span className="font-semibold text-slate-900">Économisez</span> en partageant
                    les coûts.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">Voyagez sereinement</span> avec
                    profils, avis et vérifications.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">Discutez</span> via la
                    messagerie en temps réel.
                  </li>
                </ul>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
                  Adapté au marché algérien: DZD, villes/wilayas, SMS, et prise en compte des
                  horaires (ex: Ramadan).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

