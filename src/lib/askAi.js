/* "Ask AI about Velyx Labs" (Bricx/Maydit): opens an assistant with a fixed
   question. Nothing about the visitor is sent — only this prompt. */
export const ASK_AI_PROMPT = "Tell me about Velyx Labs (velyxlabs.in)";

export function askAiLinks(prompt = ASK_AI_PROMPT) {
  const q = encodeURIComponent(prompt);
  return [
    { name: "ChatGPT", href: `https://chatgpt.com/?q=${q}` },
    { name: "Claude", href: `https://claude.ai/new?q=${q}` },
    { name: "Perplexity", href: `https://www.perplexity.ai/search?q=${q}` },
    { name: "Google AI", href: `https://www.google.com/search?udm=50&q=${q}` },
  ];
}
