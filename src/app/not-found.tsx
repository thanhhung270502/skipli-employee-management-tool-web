import { Button, ErrorPageLayout } from "@/shared/components";

export default function NotFound() {
  return (
    <ErrorPageLayout
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      actions={
        <>
          <Button href="/" variant="primary" className="w-auto">
            Go home
          </Button>
          <Button href="/login" variant="ghost" className="w-auto">
            Sign in
          </Button>
        </>
      }
    />
  );
}
