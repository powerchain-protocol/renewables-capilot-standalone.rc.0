import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CopilotMessageCredits } from "../../lib/copilot/types";

type Props = {
  credits?: CopilotMessageCredits;
};

export function TokenizedMessageReceipt({ credits }: Props) {
  const [expanded, setExpanded] = useState(false);
  if (!credits?.settledPwrc && !credits?.reservedPwrc) return null;

  const pwrc = credits.settledPwrc ?? credits.reservedPwrc;
  const settled = credits.status === "SETTLED";

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={expanded ? "Collapse PWRC message receipt" : "Expand PWRC message receipt"}
        onPress={() => setExpanded((value) => !value)}
        style={styles.summary}
      >
        <View style={[styles.statusDot, settled ? styles.statusSettled : styles.statusReserved]} />
        <Text style={styles.summaryText}>{pwrc} PWRC · {credits.messageCreditUnits ?? 1} MCU · {credits.status ?? "RESERVED"}</Text>
        <Text style={styles.chevron}>{expanded ? "⌃" : "⌄"}</Text>
      </Pressable>
      {expanded ? (
        <View style={styles.details}>
          <Row label="Credit class" value={credits.creditClass ?? "CHAT_STANDARD"} />
          <Row label="Reference value" value={credits.referenceUsd ? `$${credits.referenceUsd}` : "—"} />
          <Row label="Reservation" value={credits.reservationId ? shortId(credits.reservationId) : "—"} />
          <Row label="Receipt" value={credits.receiptId ? shortId(credits.receiptId) : settled ? "Pending index" : "Pending settlement"} />
          <Text style={styles.note}>Message content stays off-chain. Optional anchoring uses hashes/receipts only.</Text>
        </View>
      ) : null}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text selectable style={styles.value}>{value}</Text>
    </View>
  );
}

function shortId(value: string) {
  return value.length <= 16 ? value : `${value.slice(0, 8)}…${value.slice(-6)}`;
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8, borderRadius: 11, backgroundColor: "#F7FAF8", borderWidth: 1, borderColor: "#E3EBE6" },
  summary: { minHeight: 38, flexDirection: "row", alignItems: "center", paddingHorizontal: 10 },
  statusDot: { width: 7, height: 7, borderRadius: 999, marginRight: 7 },
  statusSettled: { backgroundColor: "#0B6B37" },
  statusReserved: { backgroundColor: "#A66A16" },
  summaryText: { flex: 1, color: "#445149", fontSize: 10, fontWeight: "800", fontVariant: ["tabular-nums"] },
  chevron: { color: "#0B6B37", fontSize: 12, fontWeight: "900" },
  details: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E3EBE6", paddingHorizontal: 10, paddingVertical: 8, gap: 5 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  label: { color: "#7A847E", fontSize: 9, fontWeight: "700" },
  value: { flexShrink: 1, color: "#253129", fontSize: 9, fontWeight: "800", textAlign: "right" },
  note: { marginTop: 3, color: "#8B948F", fontSize: 8, lineHeight: 12 },
});
