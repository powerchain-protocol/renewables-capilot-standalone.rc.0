import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { CopilotCreditBalance, CopilotCreditQuote } from "../../lib/copilot/types";
import { CreditBalancePill } from "./CreditBalancePill";

const MAX_CHARACTERS = 2_000;
const COUNTER_START = 1_600;

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onOpenPromptLibrary: () => void;
  isStreaming?: boolean;
  onStop?: () => void;
  disabled?: boolean;
  creditBalance?: CopilotCreditBalance | null;
  creditQuote?: CopilotCreditQuote | null;
  onOpenCredits?: () => void;
};

export function CopilotComposer({
  value,
  onChange,
  onSubmit,
  onOpenPromptLibrary,
  isStreaming = false,
  onStop,
  disabled = false,
  creditBalance,
  creditQuote,
  onOpenCredits,
}: Props) {
  const [inputHeight, setInputHeight] = useState(44);
  const count = value.length;
  const counterVisible = count >= COUNTER_START;
  const progress = count / MAX_CHARACTERS;
  const counterTone = progress >= 0.95 ? styles.counterDanger : progress >= 0.85 ? styles.counterWarning : styles.counterDefault;

  const insufficientCredits = useMemo(() => {
    if (!creditBalance || !creditQuote || creditBalance.enforcement !== "ENFORCED") return false;
    try {
      return BigInt(creditBalance.availableAtomic) < BigInt(creditQuote.pwrcAtomic);
    } catch {
      return false;
    }
  }, [creditBalance, creditQuote]);

  const canSend = !disabled && !isStreaming && !insufficientCredits && value.trim().length > 0;

  const accessibilityHint = useMemo(
    () => `${count} of ${MAX_CHARACTERS} characters used`,
    [count],
  );

  return (
    <View style={styles.shell}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Prompt Library"
          onPress={onOpenPromptLibrary}
          style={({ pressed }) => [styles.libraryButton, pressed && styles.pressed]}
        >
          <Text style={styles.libraryIcon}>✦</Text>
          <Text style={styles.libraryText}>Prompt Library</Text>
        </Pressable>

        <View style={styles.topRight}>
          {counterVisible ? (
            <Text accessibilityLabel={accessibilityHint} style={[styles.counter, counterTone]}>
              {count.toLocaleString()}/{MAX_CHARACTERS.toLocaleString()}
            </Text>
          ) : null}
          <CreditBalancePill balance={creditBalance} quote={creditQuote} onPress={onOpenCredits} />
        </View>
      </View>

      <View style={[styles.composerRow, insufficientCredits && styles.composerInsufficient]}>
        <TextInput
          accessibilityLabel="Ask PowerChain Copilot"
          value={value}
          editable={!disabled}
          multiline
          maxLength={MAX_CHARACTERS}
          placeholder="Ask PowerChain..."
          placeholderTextColor="#8A938E"
          textAlignVertical="top"
          scrollEnabled={inputHeight >= 128}
          onChangeText={(next) => onChange(next.slice(0, MAX_CHARACTERS))}
          onContentSizeChange={(event) => {
            const next = Math.max(44, Math.min(128, event.nativeEvent.contentSize.height + 16));
            setInputHeight(next);
          }}
          style={[styles.input, { height: inputHeight }]}
        />

        {isStreaming ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Stop generation"
            onPress={onStop}
            style={({ pressed }) => [styles.stopButton, pressed && styles.pressed]}
          >
            <View style={styles.stopGlyph} />
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={insufficientCredits ? "Insufficient PWRC credits" : "Send message"}
            disabled={!canSend}
            onPress={onSubmit}
            style={({ pressed }) => [styles.sendButton, !canSend && styles.sendDisabled, pressed && canSend && styles.pressed]}
          >
            <Text style={styles.sendArrow}>↑</Text>
          </Pressable>
        )}
      </View>

      {insufficientCredits ? (
        <Text style={styles.creditWarning}>Insufficient PWRC credits for this request. Add credits or choose a lower-cost prompt.</Text>
      ) : creditQuote ? (
        <Text style={styles.costDisclosure}>Estimated charge: {creditQuote.pwrc} PWRC ≈ ${creditQuote.referenceUsd} · {creditQuote.messageCreditUnits} MCU</Text>
      ) : (
        <Text style={styles.disclaimer}>AI can make mistakes. Verify evidence before critical actions.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E2E7E4",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 },
  topRight: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 8, flexShrink: 1 },
  libraryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    minHeight: 34,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: "#F2F7F4",
    borderWidth: 1,
    borderColor: "#DCE9E1",
  },
  libraryIcon: { color: "#0B6B37", fontSize: 14, fontWeight: "800" },
  libraryText: { color: "#0B6B37", fontSize: 12, fontWeight: "700" },
  counter: { fontSize: 11, fontWeight: "700", fontVariant: ["tabular-nums"] },
  counterDefault: { color: "#66706A" },
  counterWarning: { color: "#986A16" },
  counterDanger: { color: "#B42318" },
  composerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    borderWidth: 1,
    borderColor: "#DDE4E0",
    borderRadius: 18,
    padding: 6,
    backgroundColor: "#FAFBFA",
  },
  composerInsufficient: { borderColor: "#E7B7B2", backgroundColor: "#FFF9F8" },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 128,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    color: "#0E1511",
    fontSize: 16,
    lineHeight: 22,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B6B37",
  },
  sendDisabled: { backgroundColor: "#C9D5CE" },
  sendArrow: { color: "#FFFFFF", fontSize: 23, fontWeight: "800", marginTop: -2 },
  stopButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111713",
  },
  stopGlyph: { width: 13, height: 13, borderRadius: 2, backgroundColor: "#FFFFFF" },
  disclaimer: { marginTop: 7, textAlign: "center", color: "#88918C", fontSize: 10, lineHeight: 14 },
  costDisclosure: { marginTop: 7, textAlign: "center", color: "#69756E", fontSize: 10, lineHeight: 14, fontWeight: "700", fontVariant: ["tabular-nums"] },
  creditWarning: { marginTop: 7, textAlign: "center", color: "#B42318", fontSize: 10, lineHeight: 14, fontWeight: "700" },
  pressed: { opacity: 0.72 },
});
