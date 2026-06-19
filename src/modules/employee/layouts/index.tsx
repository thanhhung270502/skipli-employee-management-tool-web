"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, isEmployee } from "@/common/lib";
import { AppLayout, PageLoading } from "@/shared/components";
import { Sidebar } from "@/modules/owner/components";

export function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || !isEmployee()) {
      router.replace("/employee-login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return <PageLoading className="min-h-screen" />;
  }

  return <AppLayout sidebar={<Sidebar role="employee" />}>{children}</AppLayout>;
}

export { EmployeeLayout as EmployeePortalLayout };
