import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        localization={{ locale: "es-ES" }}
        appearance={{
          elements: { 
            card: "shadow-lg p-6 rounded-xl",
           },
          variables: { colorPrimary: "#10b981" },
        }}
      />
    </div>
  );
}
