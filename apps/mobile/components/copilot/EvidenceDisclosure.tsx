import React, { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import type { EvidenceLink } from "../../lib/copilot/types";

type Props = {
  evidence: EvidenceLink[];
  grounded?: boolean;
  provider?: string;
  model?: string;
  latencyMs?: number;
};

export function EvidenceDisclosure({ evidence, grounded, provider, model, latencyMs }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={expanded ? "Collapse evidence" : "Expand evidence"}
        onPress={() => setExpanded((value) => !value)}
        style={styles.summary}
      >
        <Text style={styles.summaryText}>
          {grounded ? "Grounded" : "Evidence"} · {provider ?? "provider"}/{model ?? "model"} · {latencyMs ? `${latencyMs} ms` : "—"} · {evidence.length} source{evidence.length === 1 ? "" : "s"}
        </Text>
        <Text style={styles.chevron}>{expanded ? "⌃" : "⌄"}</Text>
      </Pressable>
      {expanded ? (
        <View style={styles.list}>
          {evidence.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole={item.href ? "link" : "button"}
              onPress={() => item.href && Linking.openURL(item.href)}
              style={styles.item}
            >
              <View style={styles.sourceIcon}><Text style={styles.sourceIconText}>↗</Text></View>
              <View style={styles.sourceBody}>
                <Text style={styles.sourceTitle}>{item.title}</Text>
                <Text style={styles.sourceMeta}>{item.sourceType} · {item.verification ?? "UNVERIFIED"}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E2E7E4", paddingTop: 9 },
  summary: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 30 },
  summaryText: { flex: 1, color: "#738078", fontSize: 10, fontWeight: "600" },
  chevron: { color: "#0B6B37", fontWeight: "900", paddingHorizontal: 6 },
  list: { gap: 6, marginTop: 7 },
  item: { flexDirection: "row", alignItems: "center", gap: 8, padding: 9, borderRadius: 10, backgroundColor: "#F7F9F8" },
  sourceIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: "#E7F4EC", alignItems: "center", justifyContent: "center" },
  sourceIconText: { color: "#0B6B37", fontWeight: "800" },
  sourceBody: { flex: 1 },
  sourceTitle: { color: "#17211B", fontSize: 12, fontWeight: "700" },
  sourceMeta: { color: "#7A847E", fontSize: 9, marginTop: 2 },
});
