"use client"; 

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-neutral-200 bg-white text-black">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3"
      >
        <Link href="/" className="text-lg font-bold">
          Chess Coach
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:underline">
            Play
          </Link>
          <Link href="/history" className="hover:underline">
            History
          </Link>
          <Link
            href="/account"
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800"
          >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}