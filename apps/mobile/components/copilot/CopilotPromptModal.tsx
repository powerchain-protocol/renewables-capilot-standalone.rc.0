import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import type { CopilotApi } from "../../lib/copilot/api";
import type { CopilotPrompt, CopilotPromptCategory } from "../../lib/copilot/types";

const categories: Array<"All" | CopilotPromptCategory> = ["All", "Operations", "Assets", "Energy", "Treasury", "Alerts", "Reports", "Risk"];

const creditHints = {
  CHAT_STANDARD: { units: 1, pwrc: "10,000" },
  CHAT_TOOL: { units: 2, pwrc: "20,000" },
  ANALYSIS: { units: 5, pwrc: "50,000" },
  AGENT_RUN: { units: 10, pwrc: "100,000" },
  REPORT: { units: 25, pwrc: "250,000" },
} as const;

type Props = {
  visible: boolean;
  api: CopilotApi;
  onClose: () => void;
  onInsert: (prompt: CopilotPrompt) => void;
};

export function CopilotPromptModal({ visible, api, onClose, onInsert }: Props) {
  const [prompts, setPrompts] = useState<CopilotPrompt[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    Promise.all([api.getPromptLibrary(), api.getSavedPromptIds()])
      .then(([library, ids]) => {
        setPrompts(library);
        setSaved(new Set(ids));
      })
      .finally(() => setLoading(false));
  }, [visible, api]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return prompts.filter((prompt) => {
      if (category !== "All" && prompt.category !== category) return false;
      if (!needle) return true;
      return `${prompt.title} ${prompt.description} ${prompt.prompt}`.toLowerCase().includes(needle);
    });
  }, [prompts, query, category]);

  async function toggleSaved(promptId: string) {
    const next = new Set(saved);
    if (next.has(promptId)) {
      await api.deleteSavedPrompt(promptId);
      next.delete(promptId);
    } else {
      await api.savePrompt(promptId);
      next.add(promptId);
    }
    setSaved(next);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>POWERCHAIN COPILOT</Text>
            <Text style={styles.title}>Prompt Library</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}><Text style={styles.closeText}>Done</Text></Pressable>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search operational prompts"
          placeholderTextColor="#8A938E"
          style={styles.search}
        />

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
          renderItem={({ item }) => (
            <Pressable onPress={() => setCategory(item)} style={[styles.category, category === item && styles.categoryActive]}>
              <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
            </Pressable>
          )}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>{loading ? "Loading prompts…" : "No prompts match this search."}</Text>}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Insert ${item.title}`}
              onPress={() => { onInsert(item); onClose(); }}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={styles.cardTop}>
                <View style={styles.badges}>
                  <View style={styles.categoryBadge}><Text style={styles.categoryBadgeText}>{item.category}</Text></View>
                  <View style={styles.creditBadge}><Text style={styles.creditBadgeText}>{creditHints[item.creditClass].pwrc} PWRC · {creditHints[item.creditClass].units} MCU</Text></View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={saved.has(item.id) ? "Remove bookmark" : "Bookmark prompt"}
                  onPress={() => toggleSaved(item.id)}
                  hitSlop={8}
                >
                  <Text style={[styles.bookmark, saved.has(item.id) && styles.bookmarkSaved]}>{saved.has(item.id) ? "★" : "☆"}</Text>
                </Pressable>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.insertHint}>Insert into composer →</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F8F7" },
  header: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  kicker: { fontSize: 10, fontWeight: "800", letterSpacing: 1.3, color: "#0B6B37" },
  title: { marginTop: 3, fontSize: 25, fontWeight: "800", color: "#0E1511" },
  closeButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: "#EAF4EE" },
  closeText: { color: "#0B6B37", fontWeight: "800", fontSize: 13 },
  search: { marginHorizontal: 18, height: 46, borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E1E6E3", paddingHorizontal: 14, color: "#0E1511", fontSize: 14 },
  categories: { paddingHorizontal: 18, gap: 8, paddingVertical: 12 },
  category: { height: 32, borderRadius: 16, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E1E6E3", backgroundColor: "#FFFFFF" },
  categoryActive: { backgroundColor: "#0B6B37", borderColor: "#0B6B37" },
  categoryText: { color: "#637069", fontSize: 11, fontWeight: "700" },
  categoryTextActive: { color: "#FFFFFF" },
  list: { paddingHorizontal: 18, paddingBottom: 32, gap: 10 },
  card: { padding: 15, borderRadius: 16, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E1E6E3" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  badges: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, flex: 1 },
  categoryBadge: { backgroundColor: "#EEF6F1", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoryBadgeText: { color: "#0B6B37", fontSize: 9, fontWeight: "800" },
  creditBadge: { backgroundColor: "#F5F7F6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: "#E4E9E6" },
  creditBadgeText: { color: "#536059", fontSize: 9, fontWeight: "800", fontVariant: ["tabular-nums"] },
  bookmark: { color: "#94A09A", fontSize: 22 },
  bookmarkSaved: { color: "#0B6B37" },
  cardTitle: { marginTop: 10, color: "#101713", fontSize: 15, fontWeight: "800" },
  cardDescription: { marginTop: 4, color: "#6B756F", fontSize: 12, lineHeight: 18 },
  insertHint: { marginTop: 12, color: "#0B6B37", fontSize: 11, fontWeight: "800" },
  empty: { textAlign: "center", color: "#7D8781", paddingTop: 40 },
  pressed: { opacity: 0.72 },
});
