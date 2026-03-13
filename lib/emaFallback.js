export function buildFallbackReply(message, t) {
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
