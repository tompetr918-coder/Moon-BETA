import { useEffect, useMemo, useRef, useState } from "react";

function buildReply(message, t) {
  const value = message.toLowerCase();

  const groups = [
    {
      keywords: ["historie", "ema", "emma", "pribeh", "story", "history", "geschichte"],
      reply: t.chatReplyHistory
    },
    {
      keywords: ["kuchyn", "jidlo", "food", "kitchen", "restaurant", "gastro", "essen"],
      reply: t.chatReplyKitchen
    },
    {
      keywords: ["pronajem", "cena", "ceny", "rent", "rental", "price", "preis", "huur"],
      reply: t.chatReplyPricing
    },
    {
      keywords: ["lokalita", "frymburk", "sumava", "location", "place", "water", "voda"],
      reply: t.chatReplyLocation
    },
    {
      keywords: ["vybaveni", "furniture", "furnishing", "interier", "interior", "equipment"],
      reply: t.chatReplyFurnishing
    }
  ];

  const match = groups.find((group) =>
    group.keywords.some((keyword) => value.includes(keyword))
  );

  return match ? match.reply : t.chatReplyFallback;
}

export function ChatWidget({ chatOpen, onToggle, onClose, t }) {
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

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: trimmed
      }
    ]);

    setInputValue("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: buildReply(trimmed, t)
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
