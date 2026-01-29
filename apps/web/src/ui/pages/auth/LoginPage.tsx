import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis")
});

type Values = z.infer<typeof schema>;

export function LoginPage() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  });

  function onSubmit(values: Values) {
    // UI is wired; API auth endpoints will be connected in the next backend step.
    // eslint-disable-next-line no-console
    console.log("login submit", values);
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Connexion</h1>
        <p className="mt-1 text-sm text-slate-600">
          Accédez à votre tableau de bord, vos messages et vos réservations.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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

          <NavLink className="text-sm text-brand-blue hover:underline" to="/forgot-password">
            Mot de passe oublié ?
          </NavLink>

          <button className="rounded-xl bg-brand-green px-4 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
            Se connecter
          </button>

          <div className="text-sm text-slate-600">
            Nouveau sur RohWinBghit ?{" "}
            <NavLink className="text-brand-blue hover:underline" to="/register">
              Créer un compte
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

