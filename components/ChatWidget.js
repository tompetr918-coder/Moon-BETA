import { useEffect, useMemo, useRef, useState } from "react";
import { buildFallbackReply } from "../lib/emaFallback";

export function ChatWidget({ chatOpen, onToggle, onClose, t }) {
  const configuredApiUrl = process.env.NEXT_PUBLIC_EMA_API_URL || "";
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bodyRef = useRef(null);

  const welcomeMessage = useMemo(
    () => ({
      id: "welcome",
      role: "ai",
      text: t.chatWelcome
    }),
    [t.chatWelcome]
  );

  useEffect(() => {
    setMessages([welcomeMessage]);
    setInputValue("");
    setIsTyping(false);
  }, [welcomeMessage]);

  useEffect(() => {
    if (!bodyRef.current) {
      return;
    }

    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, isTyping, chatOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed
    };

    setMessages((current) => [...current, userMessage]);

    setInputValue("");
    setIsTyping(true);

    window.setTimeout(async () => {
      const historyForApi = [...messages, userMessage].map((message) => ({
        role: message.role,
        text: message.text
      }));

      let reply = buildFallbackReply(trimmed, t);

      if (configuredApiUrl) {
        try {
          const response = await fetch(configuredApiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              language: document.documentElement.lang || "cs",
              messages: historyForApi
            })
          });

          if (response.ok) {
            const payload = await response.json();
            if (payload.reply) {
              reply = payload.reply;
            }
          }
        } catch (error) {
          console.error("EMA API fallback:", error);
        }
      }

      setMessages((current) => [
        ...current,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: reply
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      <button
        className="chat-toggle"
        type="button"
        aria-expanded={chatOpen}
        aria-controls="chat-window"
        onClick={onToggle}
      >
        EMA
      </button>

      <aside id="chat-window" className={`chat-window${chatOpen ? " is-open" : ""}`} aria-hidden={!chatOpen}>
        <div className="chat-header">
          <div>
            <strong>EMA AI 4.0</strong>
            <span>{t.chatSubtitle}</span>
          </div>
          <button type="button" onClick={onClose} aria-label={t.chatClose}>
            x
          </button>
        </div>

        <div className="chat-body" ref={bodyRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-bubble ${message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}
            >
              {message.text}
            </div>
          ))}

          {isTyping ? <div className="chat-status">{t.chatTyping}</div> : null}
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t.chatPlaceholder}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button type="submit" disabled={isTyping || !inputValue.trim()}>
            {t.chatSend}
          </button>
        </form>
      </aside>
    </>
  );
}
