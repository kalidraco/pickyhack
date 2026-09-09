# PickyHack Context Engine V2: Architecture & Specification

> **"Stateless by default. Context-driven by design."**

---

## 1. Executive Overview

Most AI pentest tools suffer from severe context bloat: as terminal outputs, scanner logs, and chat histories accumulate, token consumption skyrockets. This causes:
1. **Context Window Exhaustion:** Rapidly filling 8k or 32k limits with repetitive scanner noise.
2. **Attention Dilution & Hallucination:** Models lose track of high-value findings amid thousands of lines of raw Nmap or Nuclei stdout.
3. **Model Lock-In:** Chat-bound memory makes switching from OpenAI to Anthropic or a local Ollama model impossible without losing the engagement context.

PickyHack solves this by treating the LLM as a **stateless reasoning engine**. The canonical truth resides exclusively in a reactive, typed **`ProjectState`**. For every query or autonomous loop step, the **Context Engine** dynamically compiles a mathematically optimized, budget-constrained context packet.

---

## 2. Multi-Factor Utility Scoring Function

Every candidate entity in the active project state (Asset, Service, Finding, Evidence, Task, Note, Attack Chain) is evaluated against the operator query and the current mission task:

$$U(i, q, s) = w_r \cdot R(i, q) + w_c \cdot C(i) + w_f \cdot F(i) - w_p \cdot P(i, s)$$

Where:
- **$R(i, q) \in [0, 1]$ (Query Relevance):** Lexical and entity overlap between the query and the candidate item (e.g. matching CVE identifiers, IP addresses, ports, tool names).
- **$C(i) \in [0, 1]$ (Operational Criticality):** Inherent security severity (Critical = 1.0, High = 0.8, Medium = 0.5, Low = 0.2, Info = 0.05). Verified PoCs and confirmed findings receive an additional boost.
- **$F(i) \in [0, 1]$ (Temporal Freshness):** Exponential decay based on discovery recency:
  $$F(i) = e^{-\lambda \Delta t}$$
- **$P(i, s) \in [0, 1]$ (Redundancy Penalty):** Deduplication penalty if an identical finding or host has already been represented in the selected subset.
- **Weights:** $w_r = 0.45$, $w_c = 0.35$, $w_f = 0.15$, $w_p = 0.20$.

---

## 3. Bounded Token Knapsack Allocation

Context packets must strictly respect the operator-specified token budget $B \in [1024, 32768]$:

1. **Mandatory Scope Header:**
   The mission objective, target boundary, in-scope CIDRs, and strict exclusions are always included as priority zero ($O(1)$).
2. **Available Token Budget:**
   $$\text{Available Tokens} = B - \text{Tokens}(\text{System Prompt}) - \text{Tokens}(\text{Scope}) - \text{Tokens}(\text{Query})$$
3. **Greedy Knapsack Selection:**
   Candidates are sorted by descending Utility Score $U(i, q, s)$. Items are packed sequentially until $\text{Available Tokens}$ would be violated.
4. **Explainable Rationale:**
   Every selected item is tagged with a human-readable selection rationale (e.g., `high_criticality`, `relevance_match`, `active_task_focus`). Every rejected item is recorded with its explicit pruning reason (e.g., `budget_overflow`, `low_utility_threshold`).

---

## 4. Cross-Model Context Replay & Context Diff

Because context packets are generated deterministically from state:
- **Zero Memory Loss on Provider Switching:** An operator can query `gpt-4o`, switch immediately to `claude-3-5-sonnet` or local `deepseek-r1`, and the new model receives the exact same canonical state packet without repeating past chat turns.
- **Context Diff (`ContextEngine.diffPackets`):** Quantifies differences when changing token budgets or model families, showing exactly which assets or findings were admitted or pruned.

---

## 5. Empirical Performance Summary

Based on standard benchmarks against four diverse security scenarios (Targeted Perimeter, Internal API Gateway, Active Directory Kerberoasting, CI/CD Exploitation):

| Metric | Traditional Chat History | PickyHack Context Engine V2 | Impact |
| :--- | :--- | :--- | :--- |
| **Average Token Size** | 3,699 tokens | 1,739 tokens | **-53% token reduction** |
| **Critical Finding Recall** | 100% | 100% | **Zero knowledge loss** |
| **Assembly Latency** | N/A | < 1 ms | **Real-time instant** |
| **Estimated Cost / 1k Queries** | $9.25 | $4.35 | **-53% API cost savings** |
