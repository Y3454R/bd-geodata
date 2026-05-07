import { useState } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  badge: string;
  json: unknown;
}

export default function LocationCard({ title, subtitle, badge, json }: Props) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(json, null, 2);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="rounded bg-bd-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-bd-green">
            {badge}
          </span>
          <h2 className="mt-2 text-lg font-semibold text-stone-900">{title}</h2>
          {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition hover:border-bd-green hover:text-bd-green"
        >
          {copied ? 'Copied' : 'Copy JSON'}
        </button>
      </div>
      <pre className="mt-4 overflow-auto rounded-lg bg-stone-900 p-4 text-xs leading-relaxed text-stone-100">
        {text}
      </pre>
    </div>
  );
}
