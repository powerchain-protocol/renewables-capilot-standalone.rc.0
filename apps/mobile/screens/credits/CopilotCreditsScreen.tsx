import React, { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { createCopilotApi } from "../../lib/copilot/api";
import type { CopilotCreditBalance, CopilotCreditClass, CopilotCreditQuote } from "../../lib/copilot/types";

const classes: Array<{ id: CopilotCreditClass; title: string; detail: string }> = [
  { id: "CHAT_STANDARD", title: "Standard chat", detail: "1 MCU" },
  { id: "CHAT_TOOL", title: "Tool-assisted chat", detail: "2 MCU" },
  { id: "ANALYSIS", title: "Deep analysis", detail: "5 MCU" },
  { id: "AGENT_RUN", title: "Agent run", detail: "10 MCU" },
  { id: "REPORT", title: "Report generation", detail: "25 MCU" },
];

type Props = {
  apiBaseUrl: string;
  getToken?: () => Promise<string | null>;
  onAddPwrc?: () => void;
  onBack?: () => void;
};

export function CopilotCreditsScreen({ apiBaseUrl, getToken, onAddPwrc, onBack }: Props) {
  const api = useMemo(() => createCopilotApi({ baseUrl: apiBaseUrl, getToken }), [apiBaseUrl, getToken]);
  const [balance, setBalance] = useState<CopilotCreditBalance | null>(null);
  const [pricing, setPricing] = useState<Record<string, CopilotCreditQuote>>({});
  const [ledger, setLedger] = useState<Array<{ id: string; type: string; referenceType: string; createdAt: string }>>([]);

  useEffect(() => {
    let live = true;
    Promise.all([
      api.getCreditBalance(),
      Promise.all(classes.map(async (item) => [item.id, await api.getCreditPricing(item.id)] as const)),
      api.getCreditLedger(20),
    ]).then(([nextBalance, quotes, nextLedger]) => {
      if (!live) return;
      setBalance(nextBalance);
      setPricing(Object.fromEntries(quotes));
      setLedger(nextLedger);
    }).catch(() => undefined);
    return () => { live = false; };
  }, [api]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10}><Text style={styles.back}>‹</Text></Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.kicker}>POWERCHAIN COPILOT</Text>
          <Text style={styles.title}>PWRC Credits</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Available</Text>
          <Text style={styles.heroValue}>{formatNumber(balance?.availablePwrc)} <Text style={styles.heroUnit}>PWRC</Text></Text>
          <Text style={styles.heroSub}>Reserved {formatNumber(balance?.reservedPwrc)} PWRC · {balance?.enforcement ?? "—"} enforcement</Text>
          <Pressable onPress={onAddPwrc} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
            <Text style={styles.primaryText}>Add PWRC credits</Text>
          </Pressable>
        </View>

        <View style={styles.referenceCard}>
          <Text style={styles.referenceKicker}>LAUNCH REFERENCE</Text>
          <Text style={styles.referenceTitle}>1 message unit = 10,000 PWRC</Text>
          <Text style={styles.referenceBody}>At $0.000002/PWRC, one base Message Credit Unit is $0.02. PWRC funding is verified on-chain; chat consumption is settled through the private credit ledger.</Text>
        </View>

        <Text style={styles.sectionTitle}>Usage pricing</Text>
        <View style={styles.listCard}>
          {classes.map((item, index) => {
            const quote = pricing[item.id];
            return (
              <View key={item.id} style={[styles.priceRow, index > 0 && styles.rowBorder]}>
                <View style={styles.priceBody}>
                  <Text style={styles.priceTitle}>{item.title}</Text>
                  <Text style={styles.priceMeta}>{item.detail}</Text>
                </View>
                <View style={styles.priceRight}>
                  <Text style={styles.pwrc}>{quote ? formatNumber(quote.pwrc) : "—"} PWRC</Text>
                  <Text style={styles.usd}>{quote ? `≈ $${quote.referenceUsd}` : "—"}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Recent credit activity</Text>
        <View style={styles.listCard}>
          {ledger.length ? ledger.map((entry, index) => (
            <View key={entry.id} style={[styles.ledgerRow, index > 0 && styles.rowBorder]}>
              <View style={styles.ledgerIcon}><Text style={styles.ledgerIconText}>{entry.type === "FUND" ? "+" : "·"}</Text></View>
              <View style={styles.priceBody}>
                <Text style={styles.priceTitle}>{humanize(entry.type)}</Text>
                <Text style={styles.priceMeta}>{entry.referenceType} · {new Date(entry.createdAt).toLocaleString()}</Text>
              </View>
            </View>
          )) : <Text style={styles.empty}>No credit activity yet.</Text>}
        </View>

        <Text style={styles.footnote}>Message text is not published on-chain. Tokenized message receipts use hashes and settlement metadata, with optional batched Solana anchoring.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatNumber(value?: string) {
  if (!value) return "0";
  const number = Number(value);
  if (!Number.isFinite(number)) return value;
  return new Intl.NumberFormat("en", { maximumFractionDigits: 3 }).format(number);
}

function humanize(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/^./, (char) => char.toUpperCase());
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F8F7" },
  header: { minHeight: 62, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E2E7E4" },
  back: { width: 36, color: "#0E1511", fontSize: 34, lineHeight: 36 },
  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerSpacer: { width: 36 },
  kicker: { color: "#0B6B37", fontSize: 8, fontWeight: "900", letterSpacing: 1.1 },
  title: { color: "#0E1511", fontSize: 18, fontWeight: "800" },
  content: { padding: 16, paddingBottom: 40 },
  hero: { padding: 20, borderRadius: 20, backgroundColor: "#0B5C31" },
  heroLabel: { color: "#CFE8D9", fontSize: 11, fontWeight: "700" },
  heroValue: { marginTop: 5, color: "#FFFFFF", fontSize: 32, fontWeight: "900", fontVariant: ["tabular-nums"] },
  heroUnit: { fontSize: 17, fontWeight: "800" },
  heroSub: { marginTop: 5, color: "#D8EADF", fontSize: 10, lineHeight: 15 },
  primary: { marginTop: 18, height: 46, borderRadius: 13, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  primaryText: { color: "#0B5C31", fontSize: 13, fontWeight: "900" },
  referenceCard: { marginTop: 12, padding: 16, borderRadius: 16, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E1E7E3" },
  referenceKicker: { color: "#0B6B37", fontSize: 9, letterSpacing: 1.1, fontWeight: "900" },
  referenceTitle: { marginTop: 7, color: "#111914", fontSize: 17, fontWeight: "900" },
  referenceBody: { marginTop: 6, color: "#68736C", fontSize: 11, lineHeight: 17 },
  sectionTitle: { marginTop: 22, marginBottom: 9, color: "#18211B", fontSize: 14, fontWeight: "900" },
  listCard: { overflow: "hidden", borderRadius: 16, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E1E7E3" },
  priceRow: { minHeight: 66, paddingHorizontal: 14, flexDirection: "row", alignItems: "center" },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E4E9E6" },
  priceBody: { flex: 1 },
  priceTitle: { color: "#202A23", fontSize: 12, fontWeight: "800" },
  priceMeta: { marginTop: 3, color: "#7C8780", fontSize: 9 },
  priceRight: { alignItems: "flex-end" },
  pwrc: { color: "#0B6B37", fontSize: 11, fontWeight: "900", fontVariant: ["tabular-nums"] },
  usd: { marginTop: 3, color: "#7B857F", fontSize: 9, fontWeight: "700" },
  ledgerRow: { minHeight: 62, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  ledgerIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: "#EDF7F1", alignItems: "center", justifyContent: "center" },
  ledgerIconText: { color: "#0B6B37", fontSize: 17, fontWeight: "900" },
  empty: { color: "#7C8780", textAlign: "center", padding: 20, fontSize: 11 },
  footnote: { marginTop: 14, paddingHorizontal: 6, color: "#8A938E", textAlign: "center", fontSize: 9, lineHeight: 14 },
  pressed: { opacity: 0.75 },
});
