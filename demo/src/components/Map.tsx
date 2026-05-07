import { useEffect, useRef } from 'react';
import maplibregl, { Map as MlMap } from 'maplibre-gl';

const BD_CENTER: [number, number] = [90.3563, 23.685];
const BD_ZOOM = 6.4;
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const GEOJSON_URL = '/bangladesh.geojson';

interface Props {
  flyTo?: { lng: number; lat: number; zoom?: number } | null;
}

export default function Map({ flyTo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: BD_CENTER,
      zoom: BD_ZOOM,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      // Lazy-load the boundary GeoJSON
      fetch(GEOJSON_URL)
        .then((r) => (r.ok ? r.json() : null))
        .then((geojson) => {
          if (!geojson || !mapRef.current) return;
          mapRef.current.addSource('bd-boundary', { type: 'geojson', data: geojson });
          mapRef.current.addLayer({
            id: 'bd-boundary-fill',
            type: 'fill',
            source: 'bd-boundary',
            paint: {
              'fill-color': '#006a4e',
              'fill-opacity': 0.06,
            },
          });
          mapRef.current.addLayer({
            id: 'bd-boundary-line',
            type: 'line',
            source: 'bd-boundary',
            paint: {
              'line-color': '#006a4e',
              'line-width': 1.2,
              'line-opacity': 0.75,
            },
          });
        })
        .catch(() => {
          /* boundary overlay optional */
        });
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: flyTo.zoom ?? 10,
      essential: true,
    });
  }, [flyTo]);

  return <div ref={containerRef} className="h-full w-full" />;
}
