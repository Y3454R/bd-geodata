# Contributing

Thanks for considering a contribution! `bangladesh-geojson` is a community-maintained public good. The most valuable contributions are usually data corrections — wrong coordinates, missing upazilas, typos in Bangla names.

## Three kinds of contributions

### 1. Data correction

Found a wrong coordinate, name, or ID? Open a PR that updates the JSON file under `src/data/`. Please include:

- A brief reason in the PR description
- A source if possible (e.g., Bangladesh Bureau of Statistics, BBS gazette, official government list)

If you're not sure how to fix it, [open an issue](https://github.com/ifahimreza/bangladesh-geojson/issues/new) and someone will pick it up.

### 2. Data addition

Adding a missing postcode, upazila, or area? Same process — edit the JSON, open a PR. Make sure new records:

- Have a unique `id`
- Have both `name` (English) and `bn_name` (Bangla)
- Reference an existing parent (`division_id`, `district_id`)
- Have lat/long inside Bangladesh bounds (lat 20.5–26.7, long 88.0–92.8) where applicable

### 3. Code

Improvements to the package API, demo site, or tooling are welcome. Keep changes focused — this repo intentionally stays small.

## Before you submit

Run validation locally:

```bash
node scripts/validate-data.js
```

Validation also runs on every PR via GitHub Actions. PRs that fail validation can't be merged.

## Validation rules

The validator checks:

1. **Structure** — JSON parses; root keys are correct (`divisions`, `districts`, `upazilas`, `postcodes`).
2. **Required fields** — No missing `id`, `name`, `bn_name`.
3. **Referential integrity** — Every `district.division_id` exists in divisions; every `upazila.district_id` exists in districts.
4. **Coordinate bounds** — `lat` ∈ [20.5, 26.7], `long` ∈ [88.0, 92.8].
5. **No duplicate IDs** within each file.

## Style

- JSON: 2-space indent, sorted by `id` where it makes sense.
- TypeScript: keep it simple — no abstractions just for the sake of it.
- Commits: short, imperative ("Fix Narsingdi spelling", not "fixed").

## Code of Conduct

Be kind. This is a volunteer project. We don't tolerate harassment, discrimination, or rudeness.

## License

By contributing, you agree your contributions are licensed under [MIT](../LICENSE) — the same as the rest of the project.
