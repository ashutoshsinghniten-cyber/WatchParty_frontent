export const getClientId = () => {
  let id = sessionStorage.getItem('wp_client');
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    sessionStorage.setItem('wp_client', id);
  }
  return id;
};
export const saveSession = (s) => sessionStorage.setItem('wp_session', JSON.stringify(s));
export const loadSession = () => {
  try { return JSON.parse(sessionStorage.getItem('wp_session')); } catch { return null; }
};
export const clearSession = () => sessionStorage.removeItem('wp_session');