# AI Usage Notes

## LLM Provider
Groq (openai/gpt-oss-20b model on Groq LPU)

## Why Chosen
- Ultra-low latency LPU hardware inference
- Deterministic JSON structure adherence
- High token-per-minute throughput without reasoning truncation

## What AI Was Used For
- Multi-source cross-referencing and summarization
- Extracting quoted evidence snippets with source attribution
- Detecting factual conflicts and discrepancies across sources
- Formulating verification and audit checklists

## What Was Manually Verified & Engineered
- Browser header injection in Cheerio scraper (bypassing 403 anti-bot blocks)
- Safe regex JSON parser for extracting JSON objects
- Non-blocking resilient MongoDB save handler
- Space Grotesk and JetBrains Mono cyber design system
- Context window length controls and token rate limits
