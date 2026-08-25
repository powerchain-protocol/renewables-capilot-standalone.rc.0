import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CopilotCreditBalance, CopilotCreditQuote } from "../../lib/copilot/types";

type Props = {
  balance?: CopilotCreditBalance | null;
  quote?: CopilotCreditQuote | null;
  onPress?: () => void;
};

function compactPwrc(value?: string) {
  if (!value) return "—";
  const number = Number(value);
  if (!Number.isFinite(number)) return value;
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(number);
}

export function CreditBalancePill({ balance, quote, onPress }: Props) {
  const content = (
    <>
      <View style={styles.dot} />
      <Text style={styles.balance}>{compactPwrc(balance?.availablePwrc)} PWRC</Text>
      {quote ? <Text style={styles.cost}>· {compactPwrc(quote.pwrc)} / msg</Text> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel="Open PWRC credits" onPress={onPress} style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }
  return <View style={styles.pill}>{content}</View>;
}

const styles = StyleSheet.create({
  pill: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#F2F7F4",
    borderWidth: 1,
    borderColor: "#DCE9E1",
  },
  dot: { width: 7, height: 7, borderRadius: 999, marginRight: 6, backgroundColor: "#0B6B37" },
  balance: { color: "#164B2C", fontSize: 11, fontWeight: "800", fontVariant: ["tabular-nums"] },
  cost: { marginLeft: 4, color: "#6F7A74", fontSize: 10, fontWeight: "700" },
  pressed: { opacity: 0.72 },
});
