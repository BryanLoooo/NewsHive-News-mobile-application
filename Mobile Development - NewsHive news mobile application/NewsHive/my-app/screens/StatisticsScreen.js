// screens/StatsScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, Dimensions, ScrollView, ActivityIndicator, RefreshControl,
  TextInput, TouchableOpacity, Platform, StyleSheet
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";
import { fetchNews, computeAnalytics } from "../services/worldnews";
import { useThemeCtx, palettes } from "../components/ThemeContext";

const PIE_COLORS = ["#e74c3c", "#27ae60", "#2980b9", "#8e44ad", "#f39c12", "#34495e", "#16a085"];

const PERIODS = [
  { key: "7d", label: "Past 7 days", from: () => dayjs().subtract(6, "day").startOf("day"), to: () => dayjs().endOf("day") },
  { key: "30d", label: "Past 30 days", from: () => dayjs().subtract(29, "day").startOf("day"), to: () => dayjs().endOf("day") },
  { key: "90d", label: "Past 90 days", from: () => dayjs().subtract(89, "day").startOf("day"), to: () => dayjs().endOf("day") },
];

const LANGS = [
  { key: "en", label: "English" },
  { key: "es", label: "Spanish" },
  { key: "fr", label: "French" },
  { key: "de", label: "German" },
  { key: "zh", label: "Chinese" },
  { key: "all", label: "All languages" },
];

const COUNTRIES = [
  { key: "all", label: "All sources" },
  { key: "US", label: "United States" },
  { key: "GB", label: "United Kingdom" },
  { key: "SG", label: "Singapore" },
  { key: "IN", label: "India" },
  { key: "AU", label: "Australia" },
];

export default function StatsScreen() {
  const screenWidth = Dimensions.get("window").width;

  const { theme } = useThemeCtx();
  const colors = palettes[theme];
  const styles = createStyles(colors);
  const chartConfig = createChartConfig(colors);

  // ---------- Filter state ----------
  const [periodKey, setPeriodKey] = useState("7d");
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("all");
  const [query, setQuery] = useState("technology OR AI OR finance OR sports OR health");

  const selectedPeriod = PERIODS.find((p) => p.key === periodKey) || PERIODS[0];
  const from = useMemo(() => selectedPeriod.from().format("YYYY-MM-DD HH:mm:ss"), [periodKey]);
  const to = useMemo(() => selectedPeriod.to().format("YYYY-MM-DD HH:mm:ss"), [periodKey]);

  // ---------- Data state ----------
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const rows = await fetchNews({
        text: query.trim() || "news",
        language: language === "all" ? undefined : language,
        sourceCountry: country === "all" ? undefined : country,
        from, to,
        maxItems: periodKey === "7d" ? 600 : 1200,
        pageSize: 100,
        sort: "publish-time",
      });
      setAnalytics(computeAnalytics(rows, { from, to }));
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // initial load

  const onApply = async () => { await load(); };
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  // ---------- Chart data builders ----------
  const lineData = useMemo(() => {
    if (!analytics) return null;
    const labels = analytics.timeSeries.map((p) => {
      const d = dayjs(p.x);
      if (analytics.bucket === "day") return d.format("DD MMM");
      if (analytics.bucket === "week") return `W${d.week?.() ?? d.format("WW")}`;
      return d.format("MMM YYYY");
    });
    const values = analytics.timeSeries.map((p) => p.y);
    return { labels, datasets: [{ data: values, strokeWidth: 2 }] };
  }, [analytics]);

  const barData = useMemo(() => {
    if (!analytics) return null;
    const labels = analytics.topCategories.map(([name]) => name);
    const values = analytics.topCategories.map(([, count]) => count);
    return { labels, datasets: [{ data: values }] };
  }, [analytics]);

  const pieData = useMemo(() => {
    if (!analytics) return null;
    return analytics.pieTuples.map(([name, count], i) => ({
      name,
      population: count,
      color: PIE_COLORS[i % PIE_COLORS.length],
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  }, [analytics, colors.text]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.text}
          colors={[colors.accent]}
          progressBackgroundColor={colors.card}
        />
      }
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 }}>
        <Text style={[styles.h1]}>Statistics</Text>
        <Text style={[styles.subtle]}>
          Explore trends and breakdowns for your selected window.
        </Text>
      </View>

      {/* Filter card */}
      <View style={styles.card}>
        {/* Period + Language row */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Period</Text>
            <View style={[styles.pickerWrap]}>
              <Picker
                selectedValue={periodKey}
                onValueChange={setPeriodKey}
                mode="dropdown"
                dropdownIconColor={colors.text}
                style={{ height: Platform.OS === "ios" ? 180 : 44, color: colors.text }}
              >
                {PERIODS.map((p) => (
                  <Picker.Item key={p.key} label={p.label} value={p.key} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Language</Text>
            <View style={[styles.pickerWrap]}>
              <Picker
                selectedValue={language}
                onValueChange={setLanguage}
                mode="dropdown"
                dropdownIconColor={colors.text}
                style={{ height: Platform.OS === "ios" ? 180 : 44, color: colors.text }}
              >
                {LANGS.map((l) => (
                  <Picker.Item key={l.key} label={l.label} value={l.key} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Country + Query row */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          <View style={{ width: 150 }}>
            <Text style={styles.label}>Source country</Text>
            <View style={[styles.pickerWrap]}>
              <Picker
                selectedValue={country}
                onValueChange={setCountry}
                mode="dropdown"
                dropdownIconColor={colors.text}
                style={{ height: Platform.OS === "ios" ? 180 : 44, color: colors.text }}
              >
                {COUNTRIES.map((c) => (
                  <Picker.Item key={c.key} label={c.label} value={c.key} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Query</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder='e.g. "electric vehicles" OR Tesla'
              placeholderTextColor={colors.text + "99"}
              style={styles.input}
              returnKeyType="search"
              onSubmitEditing={onApply}
            />
          </View>
        </View>

        {/* Apply button */}
        <View style={{ marginTop: 12, alignItems: "flex-end" }}>
          <TouchableOpacity onPress={onApply} style={[styles.cta]}>
            <Text style={{ color: colors.buttonText, fontWeight: "700" }}>Apply Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Date range hint */}
        <Text style={[styles.hint, { marginTop: 8 }]}>
          Range: {from}  →  {to}
        </Text>
      </View>

      {/* Loading / Error */}
      {loading && (
        <View style={{ paddingVertical: 24 }}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.centerText, styles.subtle, { marginTop: 8 }]}>Crunching analytics…</Text>
        </View>
      )}
      {!!error && <Text style={{ color: "#ef4444", marginHorizontal: 16 }}>{error}</Text>}

      {/* Charts */}
      {!loading && analytics && (
        <View style={{ paddingHorizontal: 16 }}>
          {/* Time series */}
          <Text style={[styles.sectionTitle]}>
            Volume over time ({analytics.bucket})
          </Text>
          <LineChart
            data={lineData}
            width={screenWidth - 32}
            height={240}
            chartConfig={chartConfig}
            bezier={analytics.bucket === "day"}
            style={styles.chart}
          />

          {/* Top categories */}
          <Text style={[styles.sectionTitle]}>Articles by category (Top 5)</Text>
          <BarChart
            data={barData}
            width={screenWidth - 32}
            height={240}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.chart}
          />

          {/* Category share */}
          <Text style={[styles.sectionTitle]}>Category share</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={240}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
            style={[styles.chart, { marginBottom: 0 }]}
          />

          {analytics.avgSentiment != null && (
            <Text style={[styles.subtle, { marginTop: 12 }]}>
              Avg sentiment (-1..+1): {analytics.avgSentiment.toFixed(3)}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function createChartConfig(colors) {
  return {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${colors.text === '#FFFFFF' ? '255,255,255' : '0,0,0'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${colors.text === '#FFFFFF' ? '255,255,255' : '0,0,0'}, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "4", strokeWidth: "2", stroke: colors.accent },
    propsForBackgroundLines: {
      stroke: colors.text + '22',
    },
    fillShadowGradient: colors.accent,
    fillShadowGradientOpacity: 0.25,
  };
}

function createStyles(colors) {
  return StyleSheet.create({
    h1: { fontSize: 22, fontWeight: "800", color: colors.text },
    sectionTitle: { marginBottom: 8, fontWeight: "700", color: colors.text },
    subtle: { opacity: 0.8, color: colors.text },
    centerText: { textAlign: "center", color: colors.text },
    card: {
      marginHorizontal: 12,
      marginBottom: 12,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.text + '22',
    },
    label: { fontWeight: "600", marginBottom: 4, color: colors.text },
    pickerWrap: {
      borderWidth: 1,
      borderColor: colors.text + '22',
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: colors.bg,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.text + '22',
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 44,
      backgroundColor: colors.bg,
      color: colors.text,
    },
    cta: {
      backgroundColor: colors.accent,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
    },
    chart: { marginBottom: 20, borderRadius: 12 },
  });
}
