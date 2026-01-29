import { Link } from "react-router-dom";

export function DashboardMessagesPage() {
  return (
    <div className="container-page py-8">
      <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sélectionnez un trajet dans vos réservations ou vos trajets pour ouvrir la conversation
        correspondante.
      </p>
      <p className="mt-4 text-sm text-slate-600">
        Par exemple, ouvrez <Link className="text-brand-blue hover:underline" to="/dashboard/bookings">Mes
        réservations</Link>, puis cliquez sur &quot;Voir le trajet&quot; pour accéder au chat
        intégré à la page de détail du trajet.
      </p>
    </div>
  );
}

