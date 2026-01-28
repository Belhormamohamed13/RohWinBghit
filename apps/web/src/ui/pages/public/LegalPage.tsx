import { useParams } from "react-router-dom";

export function LegalPage() {
  const { doc } = useParams();

  const title =
    doc === "cgu" ? "Conditions Générales d’Utilisation (CGU)" : "Politique de confidentialité";

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Résumé</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Les utilisateurs doivent fournir des informations exactes et respecter la loi.</li>
          <li>Les réservations suivent un workflow: demande → acceptation → paiement → confirmation.</li>
          <li>La messagerie est réservée aux utilisateurs du trajet.</li>
          <li>Les signalements sont traités par l’équipe de modération.</li>
        </ul>
        <p className="mt-4">
          Ce document sera complété par les textes juridiques finaux adaptés à la conformité locale.
        </p>
      </div>
    </div>
  );
}

