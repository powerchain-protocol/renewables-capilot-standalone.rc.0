import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = { content: string; streaming?: boolean };

type Block =
  | { kind: "code"; value: string }
  | { kind: "heading"; level: number; value: string }
  | { kind: "bullet"; value: string }
  | { kind: "number"; number: string; value: string }
  | { kind: "paragraph"; value: string };

function inlineParts(text: string) {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  return text.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <Text key={index} style={styles.bold}>{part.slice(2, -2)}</Text>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <Text key={index} style={styles.inlineCode}>{part.slice(1, -1)}</Text>;
    }
    return <Text key={index}>{part}</Text>;
  });
}

function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let code: string[] | null = null;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (code) {
        blocks.push({ kind: "code", value: code.join("\n") });
        code = null;
      } else {
        code = [];
      }
      continue;
    }
    if (code) {
      code.push(line);
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, value: heading[2] });
      continue;
    }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) {
      blocks.push({ kind: "bullet", value: bullet[1] });
      continue;
    }
    const number = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
    if (number) {
      blocks.push({ kind: "number", number: number[1], value: number[2] });
      continue;
    }
    if (line.trim()) blocks.push({ kind: "paragraph", value: line.trim() });
  }
  if (code) blocks.push({ kind: "code", value: code.join("\n") });
  return blocks;
}

export function MessageContent({ content, streaming = false }: Props) {
  if (streaming) {
    return (
      <Text style={styles.paragraph}>
        {content}
        <Text style={styles.cursor}>▍</Text>
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {parseBlocks(content).map((block, index) => {
        if (block.kind === "code") {
          return (
            <ScrollView key={index} horizontal style={styles.codeScroll} contentContainerStyle={styles.codeBlock}>
              <Text selectable style={styles.codeText}>{block.value}</Text>
            </ScrollView>
          );
        }
        if (block.kind === "heading") {
          return <Text key={index} style={[styles.heading, block.level === 1 ? styles.h1 : block.level === 2 ? styles.h2 : styles.h3]}>{inlineParts(block.value)}</Text>;
        }
        if (block.kind === "bullet") {
          return <View key={index} style={styles.listRow}><Text style={styles.marker}>•</Text><Text style={styles.listText}>{inlineParts(block.value)}</Text></View>;
        }
        if (block.kind === "number") {
          return <View key={index} style={styles.listRow}><Text style={styles.numberMarker}>{block.number}.</Text><Text style={styles.listText}>{inlineParts(block.value)}</Text></View>;
        }
        return <Text key={index} style={styles.paragraph}>{inlineParts(block.value)}</Text>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  paragraph: { color: "#152019", fontSize: 15, lineHeight: 22 },
  heading: { color: "#0E1511", fontWeight: "800", marginTop: 4 },
  h1: { fontSize: 22, lineHeight: 28 },
  h2: { fontSize: 18, lineHeight: 24 },
  h3: { fontSize: 16, lineHeight: 22 },
  listRow: { flexDirection: "row", alignItems: "flex-start", paddingRight: 4 },
  marker: { width: 18, color: "#0B6B37", fontSize: 17, lineHeight: 22, fontWeight: "800" },
  numberMarker: { width: 26, color: "#0B6B37", fontSize: 14, lineHeight: 22, fontWeight: "800" },
  listText: { flex: 1, color: "#152019", fontSize: 15, lineHeight: 22 },
  bold: { fontWeight: "800", color: "#0E1511" },
  inlineCode: { fontFamily: "monospace", backgroundColor: "#EDF2EF", color: "#184E31", fontSize: 13 },
  codeScroll: { backgroundColor: "#101713", borderRadius: 12, maxWidth: "100%" },
  codeBlock: { paddingHorizontal: 13, paddingVertical: 12 },
  codeText: { color: "#DDE9E1", fontFamily: "monospace", fontSize: 12, lineHeight: 18 },
  cursor: { color: "#0B6B37", fontWeight: "800" },
});
