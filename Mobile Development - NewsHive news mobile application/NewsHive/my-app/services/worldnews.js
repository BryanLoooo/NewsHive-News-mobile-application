// services/worldnews.js
import Constants from "expo-constants";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import qs from "qs";
dayjs.extend(isoWeek);

const API = "https://api.worldnewsapi.com/search-news";

function readExtra(key) {
  const fromExpoConfig = Constants?.expoConfig?.extra?.[key];
  if (fromExpoConfig) return fromExpoConfig;
  return Constants?.manifest?.extra?.[key] || Constants?.manifest2?.extra?.[key];
}
const KEY = readExtra("EXPO_PUBLIC_WORLDNEWS_KEY");

// ---------- Fetch (with optional filters) ----------
export async function fetchNews({
  text = "technology OR AI",
  language = "en",
  sourceCountry,              // e.g. "US" | "GB" | "SG"
  from, to,                   // Date / string
  maxItems = 600,
  pageSize = 100,
  sort = "publish-time",
} = {}) {
  if (!KEY) throw new Error("WorldNews API key missing. Set EXPO_PUBLIC_WORLDNEWS_KEY in app.json.");

  const fmt = (d) => (d ? dayjs(d).format("YYYY-MM-DD HH:mm:ss") : undefined);

  const paramsBase = {
    text,
    language,
    "source-country": sourceCountry,
    "earliest-publish-date": fmt(from),
    "latest-publish-date": fmt(to),
    sort,
    number: pageSize,
    offset: 0,
    "api-key": KEY,
  };
  Object.keys(paramsBase).forEach((k) => (paramsBase[k] == null) && delete paramsBase[k]);

  let all = [];
  while (true) {
    const url = `${API}?${qs.stringify(paramsBase)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`WorldNews API error: ${await res.text()}`);
    const json = await res.json();
    const chunk = json?.news ?? [];
    all.push(...chunk);

    const off = json?.offset ?? paramsBase.offset ?? 0;
    const num = json?.number ?? chunk.length;
    const avail = json?.available ?? all.length;

    if (all.length >= maxItems || off + num >= avail) break;
    paramsBase.offset = off + num;
  }
  return all;
}

// ---------- Analytics ----------
/**
 * bucket: "day" | "week" | "month"
 * - When the selected range is short we plot daily; longer = weekly/monthly.
 */
export function chooseBucket(from, to) {
  const days = dayjs(to).diff(dayjs(from), "day") + 1;
  if (days <= 31) return "day";
  if (days <= 180) return "week";
  return "month";
}

function floorToBucket(d, bucket) {
  if (bucket === "day") return dayjs(d).startOf("day");
  if (bucket === "week") return dayjs(d).startOf("week"); // Sunday start; use isoWeek for Mon
  return dayjs(d).startOf("month");
}

export function computeAnalytics(rows = [], { from, to }) {
  const bucket = chooseBucket(from, to);
  const start = floorToBucket(from, bucket);
  const end = floorToBucket(to, bucket);

  // Build empty bins
  const bins = [];
  let cursor = start.clone();
  while (cursor.isBefore(end) || cursor.isSame(end)) {
    bins.push(cursor);
    cursor = bucket === "day" ? cursor.add(1, "day")
      : bucket === "week" ? cursor.add(1, "week")
      : cursor.add(1, "month");
  }
  const seriesMap = new Map(bins.map((b) => [b.format("YYYY-MM-DD"), 0]));

  // Count by bucket and category
  const catMap = new Map();
  const sentiments = [];

  rows.forEach((r) => {
    const p = r.publish_date ? dayjs(r.publish_date) : null;
    if (p && p.isValid()) {
      const bin = floorToBucket(p, bucket).format("YYYY-MM-DD");
      if (seriesMap.has(bin)) seriesMap.set(bin, seriesMap.get(bin) + 1);
    }
    const cat = r.category || "Other";
    catMap.set(cat, (catMap.get(cat) || 0) + 1);

    if (typeof r.sentiment === "number") sentiments.push(r.sentiment);
  });

  const timeSeries = [...seriesMap.entries()]
    .map(([k, v]) => ({ x: k, y: v }))
    .sort((a, b) => dayjs(a.x).valueOf() - dayjs(b.x).valueOf());

  const topCategories = [...catMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const top4 = topCategories.slice(0, 4);
  const top4Set = new Set(top4.map(([k]) => k));
  const otherCount = [...catMap.entries()]
    .filter(([k]) => !top4Set.has(k))
    .reduce((s, [, n]) => s + n, 0);
  const pieTuples = [...top4, ...(otherCount > 0 ? [["Other", otherCount]] : [])];

  const avgSentiment = sentiments.length
    ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length
    : null;

  return { bucket, timeSeries, topCategories, pieTuples, avgSentiment };
}
