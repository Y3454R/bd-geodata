import { useEffect, useMemo, useRef, useState } from 'react';
import { search, SearchHit } from '../data';

interface Props {
  onSelect: (hit: SearchHit) => void;
}

const TYPE_LABEL: Record<SearchHit['type'], string> = {
  division: 'Division',
  district: 'District',
  upazila: 'Upazila',
  postcode: 'Postcode',
};

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const hits = useMemo(() => (query ? search(query, 12) : []), [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search divisions, districts, upazilas, or postcodes — try 'Sylhet' or 'ঢাকা'"
        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-stone-400 focus:border-bd-green focus:outline-none focus:ring-2 focus:ring-bd-green/20"
      />
      {open && hits.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-96 w-full overflow-auto rounded-lg border border-stone-200 bg-white shadow-lg">
          {hits.map((h, i) => {
            const data = h.data as { name?: string; bn_name?: string; postOffice?: string; postCode?: string };
            const primary =
              h.type === 'postcode'
                ? `${data.postOffice} — ${data.postCode}`
                : data.name ?? '';
            const secondary = h.type === 'postcode' ? '' : data.bn_name ?? '';
            return (
              <li key={`${h.type}-${i}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-stone-50"
                  onClick={() => {
                    onSelect(h);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <span>
                    <span className="font-medium text-stone-900">{primary}</span>
                    {secondary && <span className="ml-2 text-stone-500">{secondary}</span>}
                  </span>
                  <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-600">
                    {TYPE_LABEL[h.type]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
