"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, isOwner } from "@/common/lib";
import { AppLayout, PageLoading } from "@/shared/components";
import { Sidebar } from "../components";

export function OwnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || !isOwner()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return <PageLoading className="min-h-screen" />;
  }

  return <AppLayout sidebar={<Sidebar role="owner" />}>{children}</AppLayout>;
}
