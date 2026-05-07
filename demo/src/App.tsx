import { useMemo, useState } from 'react';
import SearchBar from './components/SearchBar';
import Cascade from './components/Cascade';
import LocationCard from './components/LocationCard';
import Map from './components/Map';
import {
  divisions,
  districts,
  upazilas,
  postcodes,
  type Division,
  type District,
  type Upazila,
} from './data';
import type { SearchHit } from './data';

interface Selection {
  type: 'division' | 'district' | 'upazila';
  data: Division | District | Upazila;
}

export default function App() {
  const [divisionId, setDivisionId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [upazilaId, setUpazilaId] = useState('');
  const [searchHit, setSearchHit] = useState<SearchHit | null>(null);

  const selection: Selection | null = useMemo(() => {
    if (upazilaId) {
      const u = upazilas.find((x) => x.id === upazilaId);
      if (u) return { type: 'upazila', data: u };
    }
    if (districtId) {
      const d = districts.find((x) => x.id === districtId);
      if (d) return { type: 'district', data: d };
    }
    if (divisionId) {
      const d = divisions.find((x) => x.id === divisionId);
      if (d) return { type: 'division', data: d };
    }
    return null;
  }, [divisionId, districtId, upazilaId]);

  const flyTo = useMemo(() => {
    // Search hit overrides cascade selection
    if (searchHit) {
      const d = searchHit.data as Partial<Division & District & Upazila>;
      if (searchHit.type === 'upazila') {
        const district = districts.find((x) => x.id === (d.district_id || ''));
        if (district) {
          return { lng: parseFloat(district.long), lat: parseFloat(district.lat), zoom: 10 };
        }
      }
      if ('lat' in d && 'long' in d && d.lat && d.long) {
        return {
          lng: parseFloat(d.long as string),
          lat: parseFloat(d.lat as string),
          zoom: searchHit.type === 'division' ? 8 : 10,
        };
      }
    }
    if (!selection) return null;
    if (selection.type === 'upazila') {
      const district = districts.find((x) => x.id === (selection.data as Upazila).district_id);
      if (district) {
        return { lng: parseFloat(district.long), lat: parseFloat(district.lat), zoom: 10 };
      }
      return null;
    }
    const data = selection.data as Division | District;
    return { lng: parseFloat(data.long), lat: parseFloat(data.lat), zoom: selection.type === 'division' ? 8 : 10 };
  }, [selection, searchHit]);

  const onSearchSelect = (hit: SearchHit) => {
    setSearchHit(hit);
    if (hit.type === 'division') {
      setDivisionId((hit.data as Division).id);
      setDistrictId('');
      setUpazilaId('');
    } else if (hit.type === 'district') {
      const d = hit.data as District;
      setDivisionId(d.division_id);
      setDistrictId(d.id);
      setUpazilaId('');
    } else if (hit.type === 'upazila') {
      const u = hit.data as Upazila;
      const dist = districts.find((x) => x.id === u.district_id);
      setDivisionId(dist?.division_id ?? '');
      setDistrictId(u.district_id);
      setUpazilaId(u.id);
    }
  };

  const cardData = searchHit ? searchHit : selection;
  const cardJson = cardData?.data ?? null;
  const cardBadge = cardData
    ? cardData.type === 'postcode'
      ? 'Postcode'
      : cardData.type[0].toUpperCase() + cardData.type.slice(1)
    : '';
  const cardTitle = cardData
    ? cardData.type === 'postcode'
      ? `${(cardData.data as { postOffice: string }).postOffice} — ${(cardData.data as { postCode: string }).postCode}`
      : (cardData.data as { name: string }).name
    : '';
  const cardSubtitle =
    cardData && cardData.type !== 'postcode'
      ? (cardData.data as { bn_name: string }).bn_name
      : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bd-green text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <circle cx="12" cy="12" r="6" fill="#f42a41" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-stone-900">
                Bangladesh GeoJSON
              </h1>
              <p className="text-xs text-stone-500">geojson.bd · open data for developers</p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a
              href="https://www.npmjs.com/package/bangladesh-geojson"
              target="_blank"
              rel="noreferrer"
              className="text-stone-600 hover:text-bd-green"
            >
              npm
            </a>
            <a
              href="https://github.com/ifahimreza/bangladesh-geojson"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-stone-900 px-3 py-1.5 text-white hover:bg-stone-700"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-3 px-4 py-4 text-sm sm:grid-cols-4 sm:px-6">
          <Stat n={divisions.length} label="Divisions" />
          <Stat n={districts.length} label="Districts" />
          <Stat n={upazilas.length} label="Upazilas" />
          <Stat n={postcodes.length} label="Postcodes" />
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <SearchBar onSelect={onSearchSelect} />
            <Cascade
              divisionId={divisionId}
              districtId={districtId}
              upazilaId={upazilaId}
              onChange={({ divisionId: d, districtId: dt, upazilaId: u }) => {
                setDivisionId(d);
                setDistrictId(dt);
                setUpazilaId(u);
                setSearchHit(null);
              }}
            />
            {cardJson ? (
              <LocationCard
                title={cardTitle}
                subtitle={cardSubtitle}
                badge={cardBadge}
                json={cardJson}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">
                Pick a division, district, or upazila — or search by name (Bangla works too).
              </div>
            )}
          </div>
          <div className="h-[480px] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm lg:col-span-3 lg:h-auto lg:min-h-[600px]">
            <Map flyTo={flyTo} />
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-4 text-xs text-stone-500 sm:flex-row sm:items-center sm:px-6">
          <p>
            Open source under MIT. Map tiles by{' '}
            <a href="https://openfreemap.org" target="_blank" rel="noreferrer" className="text-bd-green hover:underline">
              OpenFreeMap
            </a>
            .
          </p>
          <p>
            Made for the Bangladesh dev community ·{' '}
            <a
              href="https://github.com/ifahimreza/bangladesh-geojson"
              target="_blank"
              rel="noreferrer"
              className="text-bd-green hover:underline"
            >
              Contribute on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold tabular-nums text-bd-green">{n.toLocaleString()}</div>
      <div className="text-xs uppercase tracking-wide text-stone-500">{label}</div>
    </div>
  );
}
