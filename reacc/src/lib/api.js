
const TOKEN_KEY = "lab_token";


export const AUTH_CHANGE_EVENT = "lab-auth-change";

export function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChange();
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  notifyAuthChange();
}


export async function authFetch(url, options = {}) {
  const send = (token) =>
    fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });

  const response = await send(localStorage.getItem(TOKEN_KEY));
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
