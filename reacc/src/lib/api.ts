const TOKEN_KEY = "lab_token";

export const AUTH_CHANGE_EVENT = "lab-auth-change";

export function notifyAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChange();
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  notifyAuthChange();
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const send = (token: string | null) =>
    fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });

  const token = localStorage.getItem(TOKEN_KEY);
  const response = await send(token);
  if (response.status !== 401) return response;

  try {
    const refreshRes = await fetch("/refresh_token", { method: "POST" });
    const refreshData = await refreshRes.json();
    if (refreshData.accessToken) {
      saveToken(refreshData.accessToken);
      return send(refreshData.accessToken);
    }
  } catch (err) {
    console.error("Token refresh failed", err);
  }

  clearSession();
  return response;
}