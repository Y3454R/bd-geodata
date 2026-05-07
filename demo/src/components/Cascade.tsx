import { useMemo } from 'react';
import { divisions, districts, upazilas } from '../data';

interface Props {
  divisionId: string;
  districtId: string;
  upazilaId: string;
  onChange: (next: { divisionId: string; districtId: string; upazilaId: string }) => void;
}

export default function Cascade({ divisionId, districtId, upazilaId, onChange }: Props) {
  const filteredDistricts = useMemo(
    () => (divisionId ? districts.filter((d) => d.division_id === divisionId) : []),
    [divisionId]
  );
  const filteredUpazilas = useMemo(
    () => (districtId ? upazilas.filter((u) => u.district_id === districtId) : []),
    [districtId]
  );

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Select
        label="Division"
        value={divisionId}
        onChange={(v) => onChange({ divisionId: v, districtId: '', upazilaId: '' })}
        options={divisions.map((d) => ({ value: d.id, label: `${d.name} · ${d.bn_name}` }))}
        placeholder="All divisions"
      />
      <Select
        label="District"
        value={districtId}
        disabled={!divisionId}
        onChange={(v) => onChange({ divisionId, districtId: v, upazilaId: '' })}
        options={filteredDistricts.map((d) => ({ value: d.id, label: `${d.name} · ${d.bn_name}` }))}
        placeholder={divisionId ? 'All districts' : 'Pick a division first'}
      />
      <Select
        label="Upazila"
        value={upazilaId}
        disabled={!districtId}
        onChange={(v) => onChange({ divisionId, districtId, upazilaId: v })}
        options={filteredUpazilas.map((u) => ({ value: u.id, label: `${u.name} · ${u.bn_name}` }))}
        placeholder={districtId ? 'All upazilas' : 'Pick a district first'}
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

function Select({ label, value, onChange, options, placeholder, disabled }: SelectProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-bd-green focus:outline-none focus:ring-2 focus:ring-bd-green/20 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
