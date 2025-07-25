import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
        localization={{
          locale: "es-ES",
        }}
        appearance={{
          elements: {
            card: "shadow-xl p-8 rounded-2xl",
            headerTitle: "text-green-600 text-xl font-bold",
            formButtonPrimary: "bg-green-600 hover:bg-green-700",
          },
          variables: {
            colorPrimary: "#10b981", // Tailwind green-500
          },
        }}
      />
    </div>
  );
}
