const KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function geocode(text) {
  const u = new URL('https://api.geoapify.com/v1/geocode/search');
  u.searchParams.set('text', text);
  u.searchParams.set('apiKey', KEY);

  const res = await fetch(u);
  if (!res.ok) throw new Error(`Geoapify error ${res.status}`);
  return res.json();
}
