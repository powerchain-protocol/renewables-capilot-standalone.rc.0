import React, { useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import type { CopilotApi } from "../../lib/copilot/api";

type Props = {
  api: CopilotApi;
  messageId: string;
  content: string;
  onRegenerate: () => void;
};

export function ResponseToolbar({ api, messageId, content, onRegenerate }: Props) {
  const [feedback, setFeedback] = useState<"HELPFUL" | "UNHELPFUL" | null>(null);
  const [busy, setBusy] = useState(false);

  async function rate(value: "HELPFUL" | "UNHELPFUL") {
    if (busy) return;
    setBusy(true);
    try {
      await api.submitFeedback(messageId, value);
      setFeedback(value);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.row}>
      <ToolButton label="↻ Regenerate" onPress={onRegenerate} />
      <ToolButton label="↗ Share" onPress={() => Share.share({ message: content })} />
      <ToolButton label="👍" selected={feedback === "HELPFUL"} onPress={() => rate("HELPFUL")} />
      <ToolButton label="👎" selected={feedback === "UNHELPFUL"} onPress={() => rate("UNHELPFUL")} />
    </View>
  );
}

function ToolButton({ label, onPress, selected = false }: { label: string; onPress: () => void; selected?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  button: { minHeight: 32, paddingHorizontal: 10, borderRadius: 9, borderWidth: 1, borderColor: "#E0E6E2", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  selected: { backgroundColor: "#E8F5ED", borderColor: "#B6DCC5" },
  text: { color: "#59645E", fontSize: 11, fontWeight: "700" },
  selectedText: { color: "#0B6B37" },
  pressed: { opacity: 0.7 },
});
