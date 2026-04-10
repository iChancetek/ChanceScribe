"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, Layers } from "lucide-react";
import { WorkspaceIcon } from "./WorkspaceIcon";

interface WorkspaceHeaderProps {
  name: string;
  workspaceId?: string;
  onSave: (name: string) => Promise<void> | void;
}

export function WorkspaceHeader({ name, workspaceId, onSave }: WorkspaceHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [isSaving, setIsSaving] = useState(false);

  // Sync draft when name changes externally
  useEffect(() => {
    setDraft(name);
  }, [name]);

  const save = async () => {
    if (!draft.trim() || draft.trim() === name) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    await onSave(draft.trim());
    setIsEditing(false);
    setIsSaving(false);
  };

  const cancel = () => {
    setDraft(name);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/8">
        {workspaceId ? (
          <WorkspaceIcon workspaceId={workspaceId} className="w-3.5 h-3.5 text-violet-400" />
        ) : (
          <Layers className="w-3.5 h-3.5 text-white/30" />
        )}
      </div>
      {isEditing ? (
        <div className="flex items-center gap-1.5">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
            className="bg-white/[0.06] border border-white/15 rounded-lg px-3 py-1 text-sm font-semibold text-white focus:outline-none focus:border-blue-400/50 min-w-[180px]"
          />
          <button
            onClick={save}
            disabled={isSaving}
            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={cancel}
            className="p-1.5 rounded-lg hover:bg-white/8 text-white/30 hover:text-white/60 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setDraft(name); setIsEditing(true); }}
          className="group flex items-center gap-1.5 text-white/30 hover:text-white/55 transition-colors"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.18em]">{name}</span>
          <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}
    </div>
  );
}
