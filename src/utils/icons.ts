import L from 'leaflet';

const iconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" width="25" height="41">
  <path fill="#28a745" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 6.9 12.5 28.5 12.5 28.5S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0z"/>
  <circle fill="white" cx="12.5" cy="12.5" r="4"/>
</svg>
`;

export const greenIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(iconSVG)}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});
