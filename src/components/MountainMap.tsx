import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOUNTAINS } from "@/lib/mountains";
import { Link } from "@tanstack/react-router";

// Fix default marker icons (Leaflet + bundlers)
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MountainMap({ height = "600px" }: { height?: string }) {
  useEffect(() => {
    // ensure container resizes correctly
  }, []);

  return (
    <div className="rounded-xl overflow-hidden border border-emerald-900/30 shadow-xl" style={{ height }}>
      <MapContainer
        center={[10.4, 123.2]}
        zoom={9}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {MOUNTAINS.map((m) => (
          <Marker key={m.slug} position={[m.lat, m.lng]} icon={icon}>
            <Popup>
              <div className="space-y-1">
                <div className="font-bold text-base">{m.name}</div>
                <div className="text-xs text-gray-600">{m.type} · {m.difficulty}</div>
                {m.elevation && <div className="text-xs">⛰ {m.elevation}</div>}
                <div className="text-xs">📍 {m.location}</div>
                <Link
                  to="/mountains/$slug"
                  params={{ slug: m.slug }}
                  className="inline-block mt-1 text-emerald-700 font-semibold text-xs hover:underline"
                >
                  View guide →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
