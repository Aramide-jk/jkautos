export function isValidPhone(value: string): boolean {
  return /^[+\d][\d\s()-]{7,}$/.test(value.trim());
}
