import { SignIn } from "@clerk/nextjs";
import AcmeLogo from "@/app/ui/acme-logo";

export default function SignInPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-500 text-sm normal-case',
                card: 'shadow-none',
                rootBox: 'w-full',
                formFieldInput: 'rounded-md border border-gray-200 py-[9px] px-3 text-sm',
              }
            }}
            routing="path"
            path="/sign-in"
          />
        </div>
      </div>
    </main>
  );
}