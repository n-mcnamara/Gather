import Geohash from 'latlon-geohash';
import relays from './geo-relays.json';
import { LatLng } from 'leaflet';

export function parseGeo(geo: string): { lat: number; lon: number } | null {
    try {
        // First, try to decode as a geohash
        return Geohash.decode(geo);
    } catch (e) {
        // If that fails, try to parse as lat,lon
        if (geo.includes(',')) {
            const parts = geo.split(',');
            if (parts.length === 2) {
                const lat = parseFloat(parts[0]);
                const lon = parseFloat(parts[1]);
                if (!isNaN(lat) && !isNaN(lon)) {
                    return { lat, lon };
                }
            }
        }
    }
    return null;
}

export function findClosestRelay(lat: number, lon: number): string | null {
    let closestRelay: string | null = null;
    let minDistance = Infinity;

    const userLocation = new LatLng(lat, lon);

    for (const [relayUrl, data] of Object.entries(relays)) {
        if (data.lat && data.lon) {
            const relayLocation = new LatLng(data.lat, data.lon);
            const distance = userLocation.distanceTo(relayLocation);

            if (distance < minDistance) {
                minDistance = distance;
                closestRelay = relayUrl;
            }
        }
    }

    return closestRelay;
}