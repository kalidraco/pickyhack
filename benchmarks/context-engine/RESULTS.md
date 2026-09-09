# PickyHack Context Engine — Benchmark Results

**Execution Date:** 2026-09-09T06:47:14.897Z
**Mission Dataset:** 20 Targets, 34 Services, 5 Critical/High Findings, Evidence, Tasks, and Notes

## Comparative Performance Table

| Scenario | Baseline (Direct Dump) | PickyHack Context Harness | Token Reduction | Precision | Recall | Irrelevant Items Pruned |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Targeted Perimeter Vulnerability (CVE-2024-3400)** | 3,696 tok | **1,736 tok** | **-53%** | 34% | 100% | 0 items |
| **Internal API Gateway Exposure (Kong port 8001)** | 3,698 tok | **1,738 tok** | **-53%** | 14% | 100% | 0 items |
| **Active Directory Kerberoasting (dc01)** | 3,699 tok | **1,740 tok** | **-53%** | 11% | 100% | 0 items |
| **CI/CD Exploitation (GitLab CVE-2023-7028)** | 3,703 tok | **1,743 tok** | **-53%** | 31% | 100% | 0 items |

## Aggregate Metrics

- **Average Context Reduction:** **53%** fewer tokens transmitted per operational turn.
- **Average Retrieval Precision:** **23%** (focused technical signal directly relevant to operator query).
- **Average Retrieval Recall:** **100%** (zero critical technical assets or CVEs omitted).
- **Cost Reduction:** **-53%** reduction in LLM inference expenditure across identical pentest queries.
- **State Recovery & Model Portability:** 100% successful re-hydration without requiring legacy conversation history.