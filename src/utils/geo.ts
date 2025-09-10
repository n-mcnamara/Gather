import Geohash from 'latlon-geohash';

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
