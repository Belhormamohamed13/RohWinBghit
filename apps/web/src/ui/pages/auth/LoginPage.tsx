import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router-dom";

import { useLoginMutation } from "../../../store/api/authApi";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis")
});

type Values = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: Values) {
    try {
      const res = await login(values).unwrap();
      console.log("LOGIN SUCCESS", res);

      // accessToken est déjà stocké via axios interceptor
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN FAILED", err);
    }
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Connexion</h1>
        <p className="mt-1 text-sm text-slate-600">
          Accédez à votre tableau de bord, vos messages et vos réservations.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <div>
            <label className="text-xs font-semibold text-slate-600">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
              placeholder="nom@exemple.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Mot de passe
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <NavLink
            className="text-sm text-brand-blue hover:underline"
            to="/forgot-password"
          >
            Mot de passe oublié ?
          </NavLink>

          {/* ERROR BACKEND */}
          {error && (
            <p className="text-sm text-red-600">
              Email ou mot de passe incorrect
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-brand-green px-4 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
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
