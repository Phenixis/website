"use client";

import { useEffect, useState } from "react";
import { PROFILE } from "../../data";
import type { Profile } from "../../data";
import { Btn, FormSection, Field, PageHead, TextInput, pageBodyCls, editPageCls, formBarCls, kbdCls } from "../_components/ui";

function timeAgo(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(PROFILE);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { if (data) setProfile(data); });
  }, []);

  const update = (key: keyof Profile, val: string) =>
    setProfile((prev) => ({ ...prev, [key]: val }));

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSavedAt(new Date());
  };

  const statusLabel = saving
    ? "Saving…"
    : savedAt
    ? `Saved ${timeAgo(savedAt)}`
    : "Unsaved changes";

  return (
    <>
      <PageHead
        title="Settings"
        sub="Profile and site metadata."
      />
      <div className={pageBodyCls}>
        <div className={editPageCls.form} style={{ maxWidth: 720 }}>
          <div className={editPageCls.formMain}>
            <FormSection title="Profile">
              <Field label="Display name">
                <TextInput
                  value={profile.name}
                  onChange={(v) => update("name", v)}
                  placeholder="Your name"
                />
              </Field>
              <Field label="Handle">
                <TextInput
                  value={profile.handle}
                  onChange={(v) => update("handle", v)}
                  placeholder="@handle"
                />
              </Field>
              <Field label="Tagline" hint="Shown in the portfolio header">
                <TextInput
                  value={profile.tagline}
                  onChange={(v) => update("tagline", v)}
                  placeholder="Designer & builder."
                />
              </Field>
              <Field label="Location">
                <TextInput
                  value={profile.location}
                  onChange={(v) => update("location", v)}
                  placeholder="Saint-Brieuc · 48.51, -2.77"
                />
              </Field>
            </FormSection>

            <div className={formBarCls}>
              <div className="flex items-center gap-2 text-a-text-mute text-[11px] italic">{statusLabel}</div>
              <div className="flex-1" />
              <Btn variant="primary" onClick={save}>
                {saving ? "Saving…" : <>Save changes <span className={kbdCls}>⌘S</span></>}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
