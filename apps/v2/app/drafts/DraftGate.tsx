"use client";

import { useActionState } from "react";
import type { DraftKind } from "@/lib/draft-access";
import { unlockDraft, type UnlockState } from "./actions";

export function DraftGate({ kind, slug }: { kind: DraftKind; slug: string }) {
  const [state, action, pending] = useActionState<UnlockState, FormData>(
    unlockDraft.bind(null, kind, slug),
    { error: null },
  );

  return (
    <form action={action} className="w-full max-w-[360px] flex flex-col gap-4">
      <div className="text-[10.5px] tracking-[0.18em] uppercase text-v3-text-mute">Private draft</div>
      <h1 className="font-serif font-light text-[28px] tracking-[-0.015em] m-0 text-v3-text leading-[1.1]">
        This {kind} isn&apos;t published yet.
      </h1>
      <p className="m-0 text-v3-text-2">Enter the password to read it.</p>
      <input
        name="password"
        type="password"
        autoFocus
        required
        autoComplete="off"
        placeholder="Password"
        className="bg-v3-bg-2 border border-v3-border rounded-md px-[14px] py-[10px] text-v3-text font-mono text-[13px] outline-none transition-colors duration-200 focus:border-v3-accent placeholder:text-v3-text-dim"
      />
      {state.error && <div className="text-[11.5px] text-red-400">{state.error}</div>}
      <button
        type="submit"
        disabled={pending}
        className="bg-transparent border border-v3-border rounded-md px-[18px] py-[10px] cursor-pointer font-mono text-v3-text transition-all duration-200 hover:border-v3-accent hover:bg-[rgba(183,148,246,0.04)] disabled:opacity-60 disabled:cursor-default"
      >
        {pending ? "Checking…" : "Unlock →"}
      </button>
    </form>
  );
}
