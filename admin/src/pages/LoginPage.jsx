import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />

      <div className="relative z-10 w-full max-w-md p-4">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "bg-surface border border-border shadow-2xl rounded-2xl w-full",
              headerTitle: "text-text-primary",
              headerSubtitle: "text-text-secondary",
              socialButtonsBlockButton:
                "bg-surface border border-border text-text-primary hover:bg-surface-hover",
              dividerLine: "bg-border",
              dividerText: "text-text-tertiary",
              formFieldLabel: "text-text-secondary",
              formFieldInput:
                "bg-background border-border text-text-primary focus:ring-primary focus:border-primary",
              footerActionLink: "text-primary hover:text-primary-hover",
              formButtonPrimary:
                "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25",
            },
          }}
        />
      </div>
    </div>
  );
}
