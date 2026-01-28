import { Outlet } from "react-router-dom";

import { SiteFooter } from "../shared/SiteFooter";
import { SiteHeader } from "../shared/SiteHeader";

export function PublicLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader />
      <main className="pt-16">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

