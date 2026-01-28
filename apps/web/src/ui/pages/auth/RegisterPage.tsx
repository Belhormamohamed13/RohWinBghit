import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink } from "react-router-dom";

import { DZ_WILAYAS } from "@rohwinbghit/shared";

const schema = z
  .object({
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    email: z.string().email("Email invalide"),
    phone: z
      .string()
      .regex(/^(?:\+213|0)[567]\d{8}$/, "Téléphone invalide (ex: +2135xxxxxxxx)"),
    password: z.string().min(8, "Mot de passe: 8 caractères minimum"),
    confirmPassword: z.string().min(8),
    wilayaCode: z.string().min(2, "Wilaya requise"),
    isDriver: z.boolean().default(false),
    isPassenger: z.boolean().default(true),
    acceptCgu: z.boolean()
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas"
  })
  .refine((v) => v.isDriver || v.isPassenger, {
    path: ["isDriver"],
    message: "Choisissez au moins un rôle (conducteur et/ou passager)"
  })
  .refine((v) => v.acceptCgu === true, {
    path: ["acceptCgu"],
    message: "Vous devez accepter les CGU"
  });

type Values = z.infer<typeof schema>;

export function RegisterPage() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      wilayaCode: "",
      isDriver: false,
      isPassenger: true,
      acceptCgu: false
    }
  });

  function onSubmit(values: Values) {
    // eslint-disable-next-line no-console
    console.log("register submit", values);
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Créer un compte</h1>
        <p className="mt-1 text-sm text-slate-600">
          Inscrivez-vous pour publier des trajets, réserver des places et discuter en sécurité.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Nom</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                {...form.register("lastName")}
              />
              {form.formState.errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.lastName.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Prénom</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                {...form.register("firstName")}
              />
              {form.formState.errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Email</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                placeholder="nom@exemple.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Téléphone</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                placeholder="+2135xxxxxxxx"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Wilaya</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
              {...form.register("wilayaCode")}
            >
              <option value="">Sélectionner…</option>
              {DZ_WILAYAS.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} — {w.nameFr}
                </option>
              ))}
            </select>
            {form.formState.errors.wilayaCode && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.wilayaCode.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Mot de passe</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Confirmation</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <fieldset className="rounded-2xl border border-slate-200 p-4">
            <legend className="px-1 text-xs font-semibold text-slate-600">Rôle</legend>
            <div className="mt-2 grid gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4" {...form.register("isDriver")} />
                Je suis conducteur
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4" {...form.register("isPassenger")} />
                Je suis passager
              </label>
              {(form.formState.errors.isDriver || form.formState.errors.isPassenger) && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.isDriver?.message ??
                    form.formState.errors.isPassenger?.message}
                </p>
              )}
            </div>
          </fieldset>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" className="mt-1 h-4 w-4" {...form.register("acceptCgu")} />
            <span>
              J’accepte les{" "}
              <NavLink className="text-brand-blue hover:underline" to="/legal/cgu">
                CGU
              </NavLink>
              .
            </span>
          </label>
          {form.formState.errors.acceptCgu && (
            <p className="text-xs text-red-600">{form.formState.errors.acceptCgu.message}</p>
          )}

          <button className="rounded-xl bg-brand-green px-4 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
            S’inscrire
          </button>

          <div className="text-sm text-slate-600">
            Déjà inscrit ?{" "}
            <NavLink className="text-brand-blue hover:underline" to="/login">
              Connectez-vous
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

