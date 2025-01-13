export function getBody(body?: string) {
  try {
    if (!body) return {};
    return JSON.parse(body);
  } catch {
    return {};
  }
}