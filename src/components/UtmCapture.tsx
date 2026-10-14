"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/tracking";
import { logVisitOnce } from "@/lib/events";

export function UtmCapture() {
  useEffect(() => {
    captureUtm();
    // After the campaign data is saved, so the visit carries its origin.
    logVisitOnce();
  }, []);

  return null;
}
