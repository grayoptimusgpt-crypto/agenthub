"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Github, Chrome, Wallet, Loader2, LogOut, User } from "lucide-react";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "wallet">("select");
  const [error, setError] = useState<string | null>(null);

  const handleSocial = async (provider: string) => {
    setLoading(provider);
    setError(null);
    try {
      await signIn(provider, { callbackUrl });
    } catch (err) {
      setError("Authentication failed. Please try again.");
      setLoading(null);
    }
  };

  const handleWalletSignIn = async () => {
    const eth = window.ethereum;
    if (!eth) {
      alert("Please install MetaMask or another Web3 wallet");
      return;
    }

    try {
      setLoading("wallet");
      setError(null);
      
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      const address = accounts[0];

      const message = `Sign in to AgentHub

Address: ${address}
Timestamp: ${Date.now()}
Nonce: ${Math.random().toString(36).slice(2)}`;

      const signature = (await eth.request({
        method: "personal_sign",
        params: [message, address],
      })) as string;

      await signIn("credentials", {
        address,
        message,
        signature,
        callbackUrl,
      });
    } catch (err) {
      console.error("Wallet sign-in failed:", err);
      setError("Sign-in failed. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={() => handleSocial("github")}
        disabled={!!loading}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition disabled:opacity-50"
      >
        {loading === "github" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
        Continue with GitHub
      </button>

      <button
        onClick={() => handleSocial("google")}
        disabled={!!loading}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition disabled:opacity-50"
      >
        {loading === "google" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5" />}
        Continue with Google
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#050510] text-white/30">or</span>
        </div>
      </div>

      <button
        onClick={() => setStep("wallet")}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 font-medium hover:bg-purple-500/20 transition"
      >
        <Wallet className="w-5 h-5" />
        Continue with Wallet (Base)
      </button>

      {step === "wallet" && (
        <div className="space-y-4 mt-6 p-6 rounded-xl border border-purple-500/30 bg-purple-500/5">
          <button
            onClick={handleWalletSignIn}
            disabled={loading === "wallet"}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 font-medium hover:bg-purple-500/20 transition disabled:opacity-50"
          >
            {loading === "wallet" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
            {loading === "wallet" ? "Signing..." : "Connect Wallet"}
          </button>
          
          <button
            onClick={() => setStep("select")}
            className="w-full text-center py-2 text-white/40 hover:text-white transition text-sm"
          >
            ← Back to other options
          </button>

          <p className="text-xs text-white/30 text-center">
            By connecting your wallet, you agree to sign a message to verify your identity. No transaction will be made.
          </p>
        </div>
      )}
    </div>
  );
}

function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-white/10 hover:bg-white/5 transition"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-500 transition"
    >
      Sign In
    </Link>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">A</div>
            <span className="text-xl font-bold">AgentHub</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-white/50">Sign in to manage your services</p>
        </div>

        <Suspense fallback={<div className="text-center text-white/40">Loading...</div>}>
          <SignInForm />
        </Suspense>

        <p className="text-center text-white/30 text-sm mt-8">
          By signing in, you agree to our{" "}
          <a href="#" className="text-purple-400 hover:underline">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}

export { AuthButton };
