"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type  Mode = "signup" | "login";
export default function Accountpage(){
        const router = useRouter();
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [mode, setMode] = useState<Mode>("login");

async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            alert(error.message);
        } else {
            router.replace("/");
        }
    } else {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) {
            alert(error.message);
        } else {
            alert("Account Created Successfully!"); 
        }
    }
}
return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-black">
      <section className="w-full max-w-md rounded-2xl border border-gray-300 bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold">  {mode === "login" ? "Sign in" : "Create account"}</h1>
        <p className="mb-6 text-sm text-gray-500">{mode === "login" ? "Sign in to return to your chessboard." : "Create an account to start playing."}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required
              value={email} onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-emerald-400" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
            <input id="password" name="password" type="password" minLength={6} required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password} onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-emerald-400" />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800"
          >
             {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
             type="button"
             onClick={() =>
             setMode(mode === "login" ? "signup" : "login")
             }
             className="mt-5 w-full text-sm text-black hover:underline"
             >
            {mode === "login"
             ? "New here? Create account"
             : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}