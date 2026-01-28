import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Email invalide")
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" }
  });

  function onSubmit(values: Values) {
    // eslint-disable-next-line no-console
    console.log("forgot password submit", values);
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-slate-600">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-xs font-semibold text-slate-600">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>

          <button className="rounded-xl bg-brand-green px-4 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
            Envoyer
          </button>

          <NavLink className="text-sm text-brand-blue hover:underline" to="/login">
            Retour à la connexion
          </NavLink>
        </form>
      </div>
    </div>
  );
}

