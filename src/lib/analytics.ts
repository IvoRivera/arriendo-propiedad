"use client";

type ConversionEvent =
  | "availability_cta_click"
  | "booking_request_open"
  | "booking_request_submit"
  | "whatsapp_click"
  | "maps_click";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

export function trackConversion(
  eventName: ConversionEvent,
  params: Record<string, unknown> = {}
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    event_category: "conversion",
    page_location: window.location.href,
    ...params,
  });
}
