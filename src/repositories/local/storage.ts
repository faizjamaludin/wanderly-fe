const PREFIX = "wanderly:";

export function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(PREFIX + key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function removeKey(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export function uid(): string {
  return crypto.randomUUID();
}
