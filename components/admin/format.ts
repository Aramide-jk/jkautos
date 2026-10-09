const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});

export function formatLeadDate(value: string | Date): string {
  return formatter.format(typeof value === "string" ? new Date(value) : value);
}

const FIELD_LABELS: Record<string, string> = {
  message: "Message",
  carMake: "Car make",
  carModel: "Car model",
  preferredYear: "Preferred year",
  budget: "Budget",
  preferredColor: "Preferred colour",
  condition: "Condition",
  location: "Location",
  additionalRequirements: "Additional requirements",
  make: "Make",
  model: "Model",
  year: "Year",
  trim: "Trim",
  mileage: "Mileage",
  askingPrice: "Asking price",
  registrationStatus: "Registration status",
  description: "Description",
  photoCount: "Photos selected",
  date: "Preferred date",
  time: "Preferred time",
  note: "Note",
};

export function leadFieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}
