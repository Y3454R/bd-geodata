# Usage

## Install

```bash
npm install bangladesh-geojson
```

## Default import

```ts
import bd from 'bangladesh-geojson';

const divisions = bd.getDivisions();
```

## Named imports

```ts
import {
  getDivisions,
  getDistrictsByDivision,
  getUpazilasByDistrict,
  search,
} from 'bangladesh-geojson';
```

## Examples

### Build a cascade dropdown (Division → District → Upazila)

```ts
import bd from 'bangladesh-geojson';

const divisions = bd.getDivisions();
// User picks division id="3" (Dhaka)
const districts = bd.getDistrictsByDivision('3');
// User picks district id="1" (Dhaka)
const upazilas = bd.getUpazilasByDistrict('1');
```

### Search by Bangla or English name

```ts
const results = bd.search('সিলেট');
// → [{ type: 'division', data: { ... Sylhet ... } }, ...]

const results2 = bd.search('Cox');
// → matches Cox's Bazar district + upazila
```

### Get the full hierarchy as a tree

```ts
const tree = bd.getFullHierarchy();
// [{ ...division, districts: [{ ...district, upazilas: [...] }] }]
```

### Look up postcodes for a district

```ts
const postcodes = bd.getPostcodesByDistrict('1');
// → [{ division_id, district_id, upazila, postOffice, postCode }, ...]
```

### Use the boundary GeoJSON in a map

```ts
// With MapLibre / Mapbox
import boundary from 'bangladesh-geojson/src/data/bangladesh.geojson';

map.addSource('bd', { type: 'geojson', data: boundary });
map.addLayer({
  id: 'bd-fill',
  type: 'fill',
  source: 'bd',
  paint: { 'fill-color': '#006a4e', 'fill-opacity': 0.1 },
});
```

> **Tip:** The boundary file is ~7MB. In browser apps, prefer to fetch it lazily rather than bundle.

## TypeScript

All types are exported:

```ts
import type { Division, District, Upazila, Postcode, SearchResult } from 'bangladesh-geojson';
```

## Raw JSON

If you'd rather skip the helper functions, the raw data ships in `src/data/`:

```ts
import divisions from 'bangladesh-geojson/src/data/bd-divisions.json';
import districts from 'bangladesh-geojson/src/data/bd-districts.json';
import upazilas from 'bangladesh-geojson/src/data/bd-upazilas.json';
import postcodes from 'bangladesh-geojson/src/data/bd-postcodes.json';
```

## Coordinate bounds

All lat/long values are inside Bangladesh:

- Latitude: 20.5° – 26.7° N
- Longitude: 88.0° – 92.8° E

## Known data caveats

- A small number of postcodes are missing the `district_id` mapping. CI tracks this as a warning. PRs welcome.
- Upazila records do not include lat/long (they're not in the original government source we ingested). Use the parent district's coordinates as a fallback.
