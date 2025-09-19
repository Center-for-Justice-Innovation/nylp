import { useState } from "react";
import { SignIn } from "./components/SignIn";
import { CaseCalculator } from "./components/CaseCalculator";

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  const handleSignIn = (email: string) => {
    setUser(email);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="size-full">
      {user ? (
        <CaseCalculator userEmail={user} onSignOut={handleSignOut} />
      ) : (
        <SignIn onSignIn={handleSignIn} />
      )}
    </div>
  );
}