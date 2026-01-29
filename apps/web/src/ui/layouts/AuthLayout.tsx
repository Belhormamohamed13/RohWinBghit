import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useMeQuery } from "../../store/api/usersApi";

export function AuthLayout() {
  const { data, isLoading, isError, error } = useMeQuery();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-slate-600">
        Chargement de votre espace…
      </div>
    );
  }

  const status = (error as any)?.status ?? (error as any)?.data?.status;
  const unauthenticated = isError && status === 401;

  if (unauthenticated || !data?.data) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

