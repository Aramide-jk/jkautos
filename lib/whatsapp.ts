import { SITE_CONFIG } from "@/lib/site-config";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${SITE_CONFIG.phoneInternational}?text=${encodeURIComponent(message.trim())}`;
}
