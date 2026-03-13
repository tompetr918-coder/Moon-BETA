# EMA Setup

GitHub Pages cannot safely call OpenAI directly from the browser.

This project is prepared so that the missing part is the server-side API key:

1. Copy `.env.example` to `.env.local`.
2. Fill in `OPENAI_API_KEY`.
3. Run `npm run ema-proxy`.
4. Keep `NEXT_PUBLIC_EMA_API_URL` pointed to that proxy endpoint.

The frontend chat will then use the API endpoint. If the endpoint is missing, it falls back to the local rules-based EMA.
