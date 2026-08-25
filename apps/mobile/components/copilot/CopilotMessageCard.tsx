import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { CopilotApi } from "../../lib/copilot/api";
import type { CopilotMessage } from "../../lib/copilot/types";
import { EvidenceDisclosure } from "./EvidenceDisclosure";
import { MessageContent } from "./MessageContent";
import { ResponseToolbar } from "./ResponseToolbar";
import { TokenizedMessageReceipt } from "./TokenizedMessageReceipt";

type Props = {
  api: CopilotApi;
  message: CopilotMessage;
  onRegenerate: (message: CopilotMessage) => void;
};

export function CopilotMessageCard({ api, message, onRegenerate }: Props) {
  const assistant = message.role === "ASSISTANT";
  const streaming = message.status === "STREAMING";
  return (
    <View style={[styles.row, assistant ? styles.assistantRow : styles.userRow]}>
      <View style={[styles.card, assistant ? styles.assistantCard : styles.userCard]}>
        {assistant ? <Text style={styles.assistantLabel}>POWERCHAIN COPILOT</Text> : null}
        <MessageContent content={message.content} streaming={streaming} />
        {assistant && !streaming ? (
          <>
            <EvidenceDisclosure
              evidence={message.evidence ?? []}
              grounded={message.grounded}
              provider={message.provider}
              model={message.model}
              latencyMs={message.latencyMs}
            />
            <TokenizedMessageReceipt credits={message.credits} />
            <ResponseToolbar api={api} messageId={message.id} content={message.content} onRegenerate={() => onRegenerate(message)} />
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: "100%", marginBottom: 12 },
  assistantRow: { alignItems: "stretch" },
  userRow: { alignItems: "flex-end" },
  card: { borderRadius: 16, padding: 14 },
  assistantCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E7E4" },
  userCard: { maxWidth: "88%", backgroundColor: "#E8F4ED" },
  assistantLabel: { color: "#0B6B37", fontSize: 9, fontWeight: "900", letterSpacing: 1.1, marginBottom: 8 },
});
