"use client";

import { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export function RealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // 1000 ms = 1 second

    // Clean up on unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format time as HH:MM:SS
  const formattedTime = time.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div className="flex items-center gap-2 text-purple-100">
      <ClockIcon className="h-5 w-5" />
      <span className="font-medium">{formattedTime}</span>
    </div>
  );
} 