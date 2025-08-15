export function redactPII(input: string) {
  return input.replace(/\b\d{13,}\b/g, '[REDACTED]')
              .replace(/\b\d{8,13}\b/g, '[REDACTED]')
              .replace(/[\w.-]+@[\w.-]+/g, '[REDACTED_EMAIL]')
              .replace(/\+?\d{7,14}/g, '[REDACTED_PHONE]');
}
export const log = (...args: any[]) => console.log(...args.map(a => typeof a === 'string' ? redactPII(a) : a));