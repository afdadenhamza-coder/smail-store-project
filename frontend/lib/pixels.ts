// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = typeof window !== "undefined" ? (window as any) : null;

export const fbPixel = (event: string, data?: Record<string, unknown>) => {
  if (!w?.fbq) return;
  w.fbq("track", event, data);
};

export const ttPixel = (event: string, data?: Record<string, unknown>) => {
  if (!w?.ttq) return;
  w.ttq.track(event, data);
};

export const snapPixel = (event: string, data?: Record<string, unknown>) => {
  if (!w?.snaptr) return;
  w.snaptr("track", event, data);
};

export function fireAllPixels(event: string, data?: Record<string, unknown>) {
  fbPixel(event, data);
  ttPixel(event, data);
  snapPixel(event, data);
}
