// // services/news.js
// // NOTE: For production/course submission, proxy this on a server to avoid exposing keys.
// // For local dev, you can use EXPO_PUBLIC_* env vars.

// const API_BASE = 'https://newsapi.org/v2/top-headlines';
// const COUNTRY = 'us';

// // Prefer to inject via env:
// // const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
// const API_KEY = '69a4998c86b34a0ebea82ef7a0d67bd6'; // <-- replace or move to env

// export async function getTopHeadlines() {
//   const url = `${API_BASE}?country=${COUNTRY}&apiKey=${API_KEY}`;
//   const res = await fetch(url);
//   if (!res.ok) {
//     throw new Error(`HTTP ${res.status}`);
//   }
//   const data = await res.json();
//   // Normalize to always return an array
//   return Array.isArray(data?.articles) ? data.articles : [];
// }

// /services/news.js
const API_BASE = 'https://newsapi.org/v2';
const API_KEY = '69a4998c86b34a0ebea82ef7a0d67bd6'; // move to env/proxy for production

export async function getTopHeadlines({ country = 'us', category } = {}) {
  const url = new URL(`${API_BASE}/top-headlines`);
  url.searchParams.set('country', country);
  if (category) url.searchParams.set('category', category);
  url.searchParams.set('apiKey', API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data?.articles) ? data.articles : [];
}

export async function searchNews(query) {
  const url = new URL(`${API_BASE}/everything`);
  url.searchParams.set('q', query);
  url.searchParams.set('sortBy', 'publishedAt');
  url.searchParams.set('language', 'en');
  url.searchParams.set('apiKey', API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data?.articles) ? data.articles : [];
}
