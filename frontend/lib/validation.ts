export function validateMoroccanPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return false;
  if (!/^(05|06|07)/.test(digits)) return false;
  return true;
}

export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}
