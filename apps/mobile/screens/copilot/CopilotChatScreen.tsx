import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { CopilotComposer } from "../../components/copilot/CopilotComposer";
import { CopilotMessageCard } from "../../components/copilot/CopilotMessageCard";
import { CopilotPromptModal } from "../../components/copilot/CopilotPromptModal";
import { StreamStageBar } from "../../components/copilot/StreamStageBar";
import { createCopilotApi } from "../../lib/copilot/api";
import type {
  CopilotCreditBalance,
  CopilotCreditClass,
  CopilotCreditQuote,
  CopilotMessage,
  StreamStage,
} from "../../lib/copilot/types";

const FOLLOW_THRESHOLD = 120;

type Props = {
  apiBaseUrl: string;
  getToken?: () => Promise<string | null>;
  conversationId?: string;
  initialMessages?: CopilotMessage[];
  onConversationDeleted?: () => void;
  onReviewIntent?: (intentId: string) => void;
  onOpenCredits?: () => void;
};

export function CopilotChatScreen({
  apiBaseUrl,
  getToken,
  conversationId,
  initialMessages = [],
  onConversationDeleted,
  onReviewIntent,
  onOpenCredits,
}: Props) {
  const api = useMemo(() => createCopilotApi({ baseUrl: apiBaseUrl, getToken }), [apiBaseUrl, getToken]);
  const scrollRef = useRef<ScrollView>(null);
  const abortRef = useRef<AbortController | null>(null);
  const nearBottomRef = useRef(true);
  const [messages, setMessages] = useState<CopilotMessage[]>(initialMessages);
  const [composer, setComposer] = useState("");
  const [stage, setStage] = useState<StreamStage>("idle");
  const [requestId, setRequestId] = useState<string>();
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false);
  const [creditClass, setCreditClass] = useState<CopilotCreditClass>("CHAT_STANDARD");
  const [creditBalance, setCreditBalance] = useState<CopilotCreditBalance | null>(null);
  const [creditQuote, setCreditQuote] = useState<CopilotCreditQuote | null>(null);
  const lastHeartbeatRef = useRef<string>();

  useEffect(() => {
    let live = true;
    Promise.all([
      api.getCreditBalance().catch(() => null),
      api.getCreditPricing(creditClass).catch(() => null),
    ]).then(([balance, quote]) => {
      if (!live) return;
      setCreditBalance(balance);
      setCreditQuote(quote);
    });
    return () => { live = false; };
  }, [api, creditClass]);

  async function refreshCredits() {
    const balance = await api.getCreditBalance().catch(() => null);
    if (balance) setCreditBalance(balance);
  }

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distance = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    nearBottomRef.current = distance <= FOLLOW_THRESHOLD;
  }

  function maybeFollow() {
    if (nearBottomRef.current) requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }

  async function send(content = composer, requestedClass = creditClass) {
    const text = content.trim();
    if (!text || stage === "context" || stage === "generate" || stage === "verify") return;
    setComposer("");
    const userMessage: CopilotMessage = { id: `local-user-${Date.now()}`, role: "USER", content: text, status: "COMPLETE" };
    const assistantId = `stream-${Date.now()}`;
    const assistant: CopilotMessage = {
      id: assistantId,
      role: "ASSISTANT",
      content: "",
      status: "STREAMING",
      evidence: [],
      credits: { creditClass: requestedClass },
    };
    setMessages((current) => [...current, userMessage, assistant]);
    setCreditClass("CHAT_STANDARD");
    nearBottomRef.current = true;
    maybeFollow();

    const controller = new AbortController();
    abortRef.current = controller;
    setStage("context");

    try {
      for await (const event of api.streamChat({ conversationId, message: text, creditClass: requestedClass, signal: controller.signal })) {
        if (event.type === "request.started") setRequestId(event.requestId);
        if (event.type === "context.started") setStage("context");
        if (event.type === "credits.reserved") {
          setMessages((current) => current.map((message) => message.id === assistantId ? {
            ...message,
            credits: {
              ...message.credits,
              reservationId: event.reservationId,
              creditClass: event.creditClass,
              messageCreditUnits: event.units,
              reservedPwrc: event.pwrc,
              referenceUsd: event.referenceUsd,
              status: "RESERVED",
            },
          } : message));
          void refreshCredits();
        }
        if (event.type === "generation.started") setStage("generate");
        if (event.type === "verification.started") setStage("verify");
        if (event.type === "message.delta") {
          setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: message.content + event.delta } : message));
          maybeFollow();
        }
        if (event.type === "evidence") {
          setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, evidence: event.evidence } : message));
        }
        if (event.type === "grounding.completed") {
          setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, grounded: event.grounded } : message));
        }
        if (event.type === "usage") {
          setMessages((current) => current.map((message) => message.id === assistantId ? {
            ...message,
            latencyMs: event.latencyMs ?? message.latencyMs,
            usage: { inputTokens: event.inputTokens, outputTokens: event.outputTokens },
          } : message));
        }
        if (event.type === "credits.settled") {
          setMessages((current) => current.map((message) => message.id === assistantId ? {
            ...message,
            credits: {
              ...message.credits,
              reservationId: event.reservationId,
              receiptId: event.receiptId,
              messageCreditUnits: event.units,
              settledPwrc: event.pwrc,
              referenceUsd: event.referenceUsd,
              status: "SETTLED",
            },
          } : message));
          void refreshCredits();
        }
        if (event.type === "credits.released") {
          setMessages((current) => current.map((message) => message.id === assistantId ? {
            ...message,
            credits: {
              ...message.credits,
              reservationId: event.reservationId,
              reservedPwrc: event.pwrc,
              status: "RELEASED",
            },
          } : message));
          void refreshCredits();
        }
        if (event.type === "heartbeat") {
          lastHeartbeatRef.current = event.at ?? new Date().toISOString();
        }
        if (event.type === "review.intent") {
          setMessages((current) => current.map((message) => message.id === assistantId ? {
            ...message,
            reviewIntentIds: [...(message.reviewIntentIds ?? []), event.intentId],
          } : message));
          onReviewIntent?.(event.intentId);
        }
        if (event.type === "done") {
          setStage("complete");
          setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, id: event.messageId, provider: event.provider, model: event.model, status: "COMPLETE" } : message));
          void refreshCredits();
        }
        if (event.type === "cancelled") {
          setStage("idle");
          setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, status: "CANCELLED" } : message));
        }
        if (event.type === "error") {
          setStage("error");
          setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: message.content || event.message, status: "FAILED", credits: { ...message.credits, status: "FAILED" } } : message));
          if (event.code === "INSUFFICIENT_CREDITS") {
            Alert.alert("PWRC credits required", "This request needs more PWRC credits. Add credits or choose a lower-cost request.", [
              { text: "OK" },
              ...(onOpenCredits ? [{ text: "Open credits", onPress: onOpenCredits }] : []),
            ]);
          }
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const value = error as { code?: string; message?: string };
        setStage("error");
        setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: message.content || value.message || "The Copilot request could not be completed.", status: "FAILED", credits: { ...message.credits, status: "FAILED" } } : message));
        if (value.code === "INSUFFICIENT_CREDITS") {
          Alert.alert("PWRC credits required", "This request needs more PWRC credits before it can run.");
        }
      }
    } finally {
      abortRef.current = null;
      void refreshCredits();
      setTimeout(() => setStage((current) => current === "complete" ? "idle" : current), 900);
    }
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStage("idle");
  }

  function confirmDeleteConversation() {
    if (!conversationId) return;
    Alert.alert(
      "Delete conversation?",
      "This removes the conversation from your workspace. Audit and retention controls may preserve required security records.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await api.deleteConversation(conversationId);
            onConversationDeleted?.();
          },
        },
      ],
    );
  }

  const isStreaming = stage === "context" || stage === "generate" || stage === "verify";

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>POWERCHAIN</Text>
          <Text style={styles.title}>Copilot Chat</Text>
        </View>
        {conversationId ? <Text onPress={confirmDeleteConversation} style={styles.delete}>Delete</Text> : null}
      </View>

      <StreamStageBar stage={stage} requestId={requestId} />

      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={32}
        onContentSizeChange={maybeFollow}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.messages}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✦</Text>
            <Text style={styles.emptyTitle}>Ask with operational context.</Text>
            <Text style={styles.emptyBody}>Base chat starts at 10,000 PWRC. Copilot can analyze renewable assets, energy, treasury, alerts, reports and risk while preserving evidence and review boundaries.</Text>
          </View>
        ) : null}
        {messages.map((message, index) => (
          <CopilotMessageCard
            key={message.id}
            api={api}
            message={message}
            onRegenerate={() => {
              for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
                if (messages[cursor].role === "USER") {
                  void send(messages[cursor].content, message.credits?.creditClass ?? "CHAT_STANDARD");
                  break;
                }
              }
            }}
          />
        ))}
      </ScrollView>

      <CopilotComposer
        value={composer}
        onChange={setComposer}
        onSubmit={() => send()}
        onOpenPromptLibrary={() => setPromptLibraryOpen(true)}
        isStreaming={isStreaming}
        onStop={stop}
        creditBalance={creditBalance}
        creditQuote={creditQuote}
        onOpenCredits={onOpenCredits}
      />

      <CopilotPromptModal
        visible={promptLibraryOpen}
        api={api}
        onClose={() => setPromptLibraryOpen(false)}
        onInsert={(prompt) => {
          setComposer(prompt.prompt.slice(0, 2_000));
          setCreditClass(prompt.creditClass);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F8F7" },
  header: { minHeight: 62, paddingHorizontal: 16, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E2E7E4" },
  kicker: { color: "#0B6B37", fontSize: 9, fontWeight: "900", letterSpacing: 1.2 },
  title: { marginTop: 2, color: "#0E1511", fontSize: 20, fontWeight: "800" },
  delete: { color: "#B42318", fontSize: 12, fontWeight: "800", padding: 8 },
  messages: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 22 },
  emptyState: { paddingVertical: 46, paddingHorizontal: 18, alignItems: "center" },
  emptyIcon: { color: "#0B6B37", fontSize: 30, fontWeight: "800" },
  emptyTitle: { marginTop: 12, color: "#111813", fontSize: 20, fontWeight: "800", textAlign: "center" },
  emptyBody: { marginTop: 8, color: "#6B756F", fontSize: 13, lineHeight: 20, textAlign: "center" },
});
