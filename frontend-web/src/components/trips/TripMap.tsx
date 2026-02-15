import { MapContainer, TileLayer, Marker, Polyline, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { WILAYA_COORDS } from '../../constants/wilayaCoords';
import { Locate, Plus, Minus, Layers } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom markers for Start and End - Updated to use Teal/Sand colors
const startIcon = L.divIcon({
    html: `<div class="relative">
            <div class="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-[#1adfb8]/20 rounded-full animate-ping"></div>
            <div class="w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-[#1adfb8] border-4 border-[#0a0b0e] rounded-full shadow-[0_0_15px_rgba(26,223,184,0.5)] flex items-center justify-center">
                <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>`,
    className: 'custom-div-icon',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
});

const endIcon = L.divIcon({
    html: `<div class="w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-[#4a9eff] border-4 border-[#0a0b0e] rounded-full shadow-[0_0_15px_rgba(74,158,255,0.5)] flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>`,
    className: 'custom-div-icon',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
});

interface TripMapProps {
    fromWilayaId?: number;
    toWilayaId?: number;
    departureTime?: string;
    darkMode?: boolean;
}

// Haversine formula to calculate distance between two points
const calculateDistance = (coords1: [number, number], coords2: [number, number]) => {
    const R = 6371; // Earth's radius in km
    const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
    const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 1.25); // Factor for road distance approximation
};

// Component to handle map centering and bounds
const MapBoundsHandler = ({ points }: { points: [number, number][] }) => {
    const map = useMap();

    useEffect(() => {
        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            if (points.length === 1) {
                map.setView(points[0], 10);
            } else {
                map.fitBounds(bounds, { padding: [50, 50], animate: true });
            }
        }
    }, [points, map]);

    return null;
};

const TripMap: React.FC<TripMapProps> = ({ fromWilayaId, toWilayaId, departureTime, darkMode }) => {
    const fromCoords = fromWilayaId ? WILAYA_COORDS[fromWilayaId] : null;
    const toCoords = toWilayaId ? WILAYA_COORDS[toWilayaId] : null;

    const distance = fromCoords && toCoords ? calculateDistance(fromCoords, toCoords) : null;

    // Estimate arrival time (Avg speed 80km/h)
    const getArrivalTime = () => {
        if (!distance || !departureTime) return '--:--';
        const [hours, minutes] = departureTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + (distance / 80) * 60;
        const arrivalHours = Math.floor(totalMinutes / 60) % 24;
        const arrivalMinutes = Math.round(totalMinutes % 60);
        return `${String(arrivalHours).padStart(2, '0')}:${String(arrivalMinutes).padStart(2, '0')}`;
    };

    const arrivalTime = getArrivalTime();

    const points: [number, number][] = [];
    if (fromCoords) points.push(fromCoords);
    if (toCoords) points.push(toCoords);

    // Algeria bounds as default view
    const center: [number, number] = [36.7538, 3.0588]; // Algiers

    return (
        <div className="h-full w-full relative font-body">
            <MapContainer
                center={center}
                zoom={6}
                style={{ height: '100%', width: '100%', zIndex: 0, background: '#0a0b0e' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {fromCoords && (
                    <Marker position={fromCoords} icon={startIcon} />
                )}

                {toCoords && (
                    <Marker position={toCoords} icon={endIcon} />
                )}

                {fromCoords && toCoords && (
                    <Polyline
                        positions={[fromCoords, toCoords]}
                        pathOptions={{
                            color: '#1adfb8',
                            weight: 4,
                            dashArray: '10, 10',
                            lineCap: 'round',
                            opacity: 0.8
                        }}
                    />
                )}

                <MapBoundsHandler points={points} />
                <ZoomControl position="topright" />
            </MapContainer>

            {/* Floating Info Card */}
            {fromCoords && toCoords && (
                <div className="absolute bottom-8 left-8 right-8 z-[400]">
                    <div className="bg-night-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-elevated border border-accent-teal/20">
                        <div className="flex items-center gap-6">
                            <div className="flex-1">
                                <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-accent-teal/80 mb-1 font-mono">Distance totale</p>
                                <p className="text-xl font-display text-text-primary tracking-wide">{distance} km <span className="text-text-muted font-bold text-xs ml-1 font-mono">Est-Ouest</span></p>
                            </div>
                            <div className="w-px h-10 bg-accent-teal/20"></div>
                            <div className="flex-1 text-center">
                                <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-accent-teal/80 mb-1 font-mono">Arrivée prévue</p>
                                <p className="text-xl font-display text-text-primary tracking-wide">{arrivalTime}</p>
                            </div>
                            <div className="w-px h-10 bg-accent-teal/20"></div>
                            <div className="flex-1 text-right">
                                <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-accent-teal/80 mb-1 font-mono">Durée approx.</p>
                                <p className="text-xl font-display text-accent-teal tracking-wide">{distance ? Math.floor(distance / 80) : 0}h {distance ? Math.round(((distance / 80) % 1) * 60) : 0}m</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Live Indicator */}
            <div className="absolute top-8 left-8 z-[400]">
                <div className="bg-night-900/80 backdrop-blur-md border border-accent-teal/30 text-text-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow flex items-center gap-3">
                    <span className="w-2.5 h-2.5 bg-accent-teal rounded-full animate-pulse shadow-[0_0_10px_#1adfb8]"></span>
                    LIVE GPS TRACKING
                </div>
            </div>

            {/* Sidebar / Floating Controls */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[400]">
                <button className="bg-night-900/80 backdrop-blur-xl p-3.5 rounded-xl text-text-primary hover:text-accent-teal transition-all shadow-card border border-border group active:scale-90">
                    <Locate size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <div className="flex flex-col bg-night-900/80 backdrop-blur-xl rounded-xl shadow-card border border-border overflow-hidden">
                    <button
                        className="p-3.5 text-text-primary hover:text-accent-teal hover:bg-accent-teal/10 transition-all border-b border-border group"
                    >
                        <Plus size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="p-3.5 text-text-primary hover:text-accent-teal hover:bg-accent-teal/10 transition-all group">
                        <Minus size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
                <button className="bg-night-900/80 backdrop-blur-xl p-3.5 rounded-xl text-text-primary hover:text-accent-teal transition-all shadow-card border border-border group active:scale-90">
                    <Layers size={20} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Map Decorative Gradients */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-night-900/80 to-transparent pointer-events-none z-[399]"></div>
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-night-900 via-night-900/50 to-transparent pointer-events-none z-[399]"></div>
        </div>
    );
};

export default TripMap;
