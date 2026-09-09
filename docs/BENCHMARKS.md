# PickyHack Context Engine Benchmarks

This document records the empirical benchmark methodology and reproducible results evaluating the PickyHack Context Harness against traditional raw context dumping.

---

## 1. Methodology

The benchmark suite measures:
1. **Token Reduction (%):** $\frac{\text{Baseline Tokens} - \text{PickyHack Tokens}}{\text{Baseline Tokens}} \times 100$
2. **Retrieval Recall (%):** Percentage of critical target findings and credentials successfully retained in the compiled context packet.
3. **Retrieval Precision (%):** Proportion of admitted tokens directly relevant to the specific operator query.
4. **Harness Latency (ms):** Computation time required to score candidates, pack tokens, and serialize the context packet.
5. **Cost Impact ($ / 1k queries):** Calculated using standard blended token pricing ($2.50 / 1M input tokens).

### Scenarios Evaluated
- **Scenario 1:** Targeted Perimeter Vulnerability (Edge PAN-OS CVE-2024-3400 command injection).
- **Scenario 2:** Internal API Gateway Exposure (Unauthenticated Kong Gateway admin API on port 8001).
- **Scenario 3:** Active Directory Kerberoasting (dc01 domain controller, kerberoastable SPNs).
- **Scenario 4:** CI/CD Supply Chain Exploitation (Self-hosted GitLab instance CVE-2023-7028 account takeover).

---

## 2. Benchmark Results

```text
================================================================
       PICKYHACK CONTEXT HARNESS BENCHMARK RESULTS               
================================================================

[Scenario 1] Targeted Perimeter Vulnerability (CVE-2024-3400)
  • Baseline Tokens:      3,696 tok
  • PickyHack Tokens:     1,736 tok
  • Context Reduction:    -53% (pruned 0 irrelevant state items)
  • Retrieval Precision:  34%
  • Retrieval Recall:     100%
  • Harness Latency:      0 ms

[Scenario 2] Internal API Gateway Exposure (Kong port 8001)
  • Baseline Tokens:      3,698 tok
  • PickyHack Tokens:     1,738 tok
  • Context Reduction:    -53% (pruned 0 irrelevant state items)
  • Retrieval Precision:  14%
  • Retrieval Recall:     100%
  • Harness Latency:      0 ms

[Scenario 3] Active Directory Kerberoasting (dc01)
  • Baseline Tokens:      3,699 tok
  • PickyHack Tokens:     1,740 tok
  • Context Reduction:    -53% (pruned 0 irrelevant state items)
  • Retrieval Precision:  11%
  • Retrieval Recall:     100%
  • Harness Latency:      0 ms

[Scenario 4] CI/CD Exploitation (GitLab CVE-2023-7028)
  • Baseline Tokens:      3,703 tok
  • PickyHack Tokens:     1,743 tok
  • Context Reduction:    -53% (pruned 0 irrelevant state items)
  • Retrieval Precision:  31%
  • Retrieval Recall:     100%
  • Harness Latency:      0 ms

================================================================
                     BENCHMARK SUMMARY                          
================================================================
Total Baseline Tokens:      14,796 tok
Total PickyHack Tokens:     6,957 tok
Average Context Reduction:  53% token reduction
Estimated Cost / 1k queries (Baseline):  $9.25
Estimated Cost / 1k queries (PickyHack): $4.35 (-53%)
================================================================
```

---

## 3. How to Reproduce

Run the benchmark script from the repository root:

```bash
node benchmarks/context-engine/runner.js
```

The runner evaluates the test dataset defined in `benchmarks/context-engine/dataset.json` and updates `benchmarks/context-engine/RESULTS.md` with verifiable metrics.
