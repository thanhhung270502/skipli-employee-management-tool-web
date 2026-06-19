"use client";
import { clearUser, getUser } from "@/common/lib";
import { Button, ErrorPageLayout } from "@/shared/components";

export default function UnauthorizedPage() {
  const user = getUser();
  const homeHref = user?.role === "employee" ? "/employee/tasks" : "/dashboard";
  const loginHref = user?.role === "employee" ? "/employee-login" : "/login";

  const handleSignOut = () => {
    clearUser();
    window.location.href = loginHref;
  };

  return (
    <ErrorPageLayout
      code="403"
      title="Access denied"
      description="You don't have permission to view this page. Sign in with the correct account or return to your dashboard."
      actions={
        <>
          <Button href={homeHref} variant="primary" className="w-auto">
            Go to dashboard
          </Button>
          <Button type="button" variant="ghost" className="w-auto" onClick={handleSignOut}>
            Sign in again
          </Button>
        </>
      }
    />
  );
}
