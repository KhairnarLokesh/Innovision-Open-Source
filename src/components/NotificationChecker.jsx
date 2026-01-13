"use client";

import { useEffect } from "react";
import { startReminderChecker, getNotificationPermission } from "@/lib/notifications";

export default function NotificationChecker() {
  useEffect(() => {
    // Start the reminder checker if notifications are enabled
    if (getNotificationPermission() === "granted") {
      console.log("Starting notification reminder checker...");
      startReminderChecker();
    }
  }, []);

  return null; // This component doesn't render anything
}
