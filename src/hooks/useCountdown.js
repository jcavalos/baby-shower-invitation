import { useEffect, useState } from "react";

function getTimeParts(targetDate) {
  const total = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

/** Devuelve {days, hours, minutes, seconds, total, isPast} y se actualiza cada segundo. */
export default function useCountdown(targetDate) {
  const [parts, setParts] = useState(() => getTimeParts(targetDate));

  useEffect(() => {
    const id = setInterval(() => setParts(getTimeParts(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return { ...parts, isPast: parts.total <= 0 };
}
