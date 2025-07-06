import { memo } from "react";
import styles from "./Sidebar.module.css";

import type { Day } from "../types/trip";

interface SidebarProps {
  days: Day[];
  activeDay: Day;
  onDaySelect: (day: Day) => void;
  onActivityHover: (activityId: number | null) => void;
}

const DayButton = memo<{
  day: Day;
  isActive: boolean;
  onClick: () => void;
}>(({ day, isActive, onClick }) => (
  <button
    className={`${styles.dayButton} ${isActive ? styles.active : ""}`}
    onClick={onClick}
    aria-pressed={isActive}
  >
    Day {day.id}: {day.title}
  </button>
));

DayButton.displayName = "DayButton";

const ActivityCard = memo<{
  id: number;
  name: string;
  description: string;
  photoUrl: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}>(({ name, description, photoUrl, onMouseEnter, onMouseLeave }) => (
  <article className={styles.activityCard} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <img src={photoUrl} alt={`View of ${name}`} className={styles.activityImage} loading="lazy" />
    <div className={styles.activityInfo}>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  </article>
));

ActivityCard.displayName = "ActivityCard";

export const Sidebar = memo<SidebarProps>(({ days, activeDay, onDaySelect, onActivityHover }) => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.daysList} aria-label="Trip Days">
        {days.map((day) => (
          <DayButton
            key={day.id}
            day={day}
            isActive={day.id === activeDay.id}
            onClick={() => onDaySelect(day)}
          />
        ))}
      </nav>
      <section className={styles.activitiesList} aria-label={`Activities for Day ${activeDay.id}`}>
        {activeDay.activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            id={activity.id}
            name={activity.name}
            description={activity.description}
            photoUrl={activity.photo_url}
            onMouseEnter={() => onActivityHover(activity.id)}
            onMouseLeave={() => onActivityHover(null)}
          />
        ))}
      </section>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
