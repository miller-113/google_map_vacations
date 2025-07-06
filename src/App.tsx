import { useState, useCallback } from "react";

import { useTrip } from "./hooks/useTrip";
import { Map } from "./components/Map";
import { Sidebar } from "./components/Sidebar";

import "./App.css";

import type { Day } from "./types/trip";

function App() {
  const { trip, loading, error } = useTrip();
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [hoveredActivityId, setHoveredActivityId] = useState<number | null>(null);

  const handleDaySelect = useCallback((day: Day) => {
    setActiveDay(day);
  }, []);

  const handleActivityHover = useCallback((activityId: number | null) => {
    setHoveredActivityId(activityId);
  }, []);

  if (loading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        Loading...
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="error" role="alert">
        Error loading data: {error}
      </div>
    );
  }

  if (!activeDay && trip.days.length > 0) {
    setActiveDay(trip.days[0]);
    return null;
  }

  if (!activeDay) {
    return (
      <div className="error" role="alert">
        No trip data available
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar-container">
        <h1 className="trip-title">{trip.trip_title}</h1>
        <Sidebar
          days={trip.days}
          activeDay={activeDay}
          onDaySelect={handleDaySelect}
          onActivityHover={handleActivityHover}
        />
      </div>
      <div className="map-container">
        <Map activities={activeDay.activities} hoveredActivityId={hoveredActivityId} />
      </div>
    </div>
  );
}

export default App;
