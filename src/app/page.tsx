"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/common/lib";
import { PageLoading, Typography } from "@/shared/components";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace("/login");
    } else if (user.role === "owner") {
      router.replace("/dashboard");
    } else {
      router.replace("/employee/tasks");
    }
  }, [router]);

  return (
    <PageLoading className="min-h-screen">
      <Typography variant="small" color="muted">
        Redirecting...
      </Typography>
    </PageLoading>
  );
}
