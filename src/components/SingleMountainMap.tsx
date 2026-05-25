import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function SingleMountainMap({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-emerald-800/40" style={{ height: 400 }}>
      <MapContainer center={[lat, lng]} zoom={12} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={icon}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
