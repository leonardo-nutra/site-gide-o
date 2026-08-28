"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/tracking";

export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);

  return null;
}
