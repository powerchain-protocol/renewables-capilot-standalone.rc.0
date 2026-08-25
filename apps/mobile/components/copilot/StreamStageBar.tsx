import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { StreamStage } from "../../lib/copilot/types";

const stages: Array<{ key: Exclude<StreamStage, "idle" | "complete" | "error">; label: string }> = [
  { key: "context", label: "Context" },
  { key: "generate", label: "Generate" },
  { key: "verify", label: "Verify" },
];

const rank: Record<StreamStage, number> = {
  idle: -1,
  context: 0,
  generate: 1,
  verify: 2,
  complete: 3,
  error: -1,
};

type Props = { stage: StreamStage; requestId?: string };

export function StreamStageBar({ stage, requestId }: Props) {
  if (stage === "idle") return null;
  const activeRank = rank[stage];

  return (
    <View style={styles.wrap} accessibilityLabel={`Copilot runtime stage ${stage}`}>
      <View style={styles.stageRow}>
        {stages.map((item, index) => {
          const complete = activeRank > index || stage === "complete";
          const active = activeRank === index;
          return (
            <React.Fragment key={item.key}>
              <View style={styles.stageItem}>
                <View style={[styles.dot, complete && styles.dotComplete, active && styles.dotActive]}>
                  <Text style={[styles.dotText, (complete || active) && styles.dotTextActive]}>{complete ? "✓" : index + 1}</Text>
                </View>
                <Text style={[styles.label, (active || complete) && styles.labelActive]}>{item.label}</Text>
              </View>
              {index < stages.length - 1 ? <View style={[styles.line, complete && styles.lineComplete]} /> : null}
            </React.Fragment>
          );
        })}
      </View>
      {requestId ? <Text style={styles.requestId}>Request {requestId.slice(0, 12)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E1E7E3",
    backgroundColor: "#F8FAF9",
  },
  stageRow: { flexDirection: "row", alignItems: "center" },
  stageItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 21, height: 21, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: "#E6EBE8" },
  dotActive: { backgroundColor: "#E2F3E9", borderWidth: 1, borderColor: "#0B6B37" },
  dotComplete: { backgroundColor: "#0B6B37" },
  dotText: { color: "#748079", fontSize: 10, fontWeight: "800" },
  dotTextActive: { color: "#FFFFFF" },
  label: { color: "#7A847E", fontSize: 11, fontWeight: "700" },
  labelActive: { color: "#183A28" },
  line: { flex: 1, height: 1, backgroundColor: "#DDE4E0", marginHorizontal: 7 },
  lineComplete: { backgroundColor: "#6FB589" },
  requestId: { marginTop: 8, color: "#89928D", fontSize: 9, textAlign: "right", fontVariant: ["tabular-nums"] },
});
