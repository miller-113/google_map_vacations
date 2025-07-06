import { useCallback, useMemo, memo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

import type { Activity } from "../types/trip";

interface MapProps {
  activities: Activity[];
  hoveredActivityId: number | null;
}

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
} as const;

const DEFAULT_CENTER = {
  lat: 41.9028,
  lng: 12.4964,
} as const;

const DEFAULT_ZOOM = 14;

const MAP_OPTIONS = {
  disableDefaultUI: true,
  clickableIcons: false,
  scrollwheel: true,
  styles: [
    {
      featureType: "poi" as const,
      elementType: "labels" as const,
      stylers: [{ visibility: "off" as const }],
    },
  ],
};

const MARKER_ICON = {
  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: "#ffffff",
  scale: 1.5,
} as const;

export const Map = memo<MapProps>(({ activities, hoveredActivityId }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      ,
  });

  const center = useMemo(() => {
    if (activities.length === 0) return DEFAULT_CENTER;

    const sumLat = activities.reduce((sum, act) => sum + act.coords.lat, 0);
    const sumLng = activities.reduce((sum, act) => sum + act.coords.lng, 0);

    return {
      lat: sumLat / activities.length,
      lng: sumLng / activities.length,
    };
  }, [activities]);

  const getMarkerIcon = useCallback(
    (isHovered: boolean) => ({
      ...MARKER_ICON,
      fillColor: isHovered ? "#f44336" : "#2196f3",
    }),
    []
  );

  const renderMap = useCallback(() => {
    return (
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        zoom={DEFAULT_ZOOM}
        center={center}
        options={MAP_OPTIONS}
      >
        {activities.map((activity) => (
          <MarkerF
            key={activity.id}
            position={activity.coords}
            title={activity.name}
            animation={hoveredActivityId === activity.id ? 1 : undefined}
            options={{
              icon: getMarkerIcon(hoveredActivityId === activity.id),
            }}
          />
        ))}
      </GoogleMap>
    );
  }, [activities, center, hoveredActivityId, getMarkerIcon]);

  if (loadError) {
    return (
      <div className="error" role="alert">
        Failed to load the map. Please check your internet connection and try again.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="loading" role="status" aria-live="polite">
        Loading map...
      </div>
    );
  }

  return renderMap();
});

Map.displayName = "Map";
