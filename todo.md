# Hospital-Management-System Transformation Plan

## 1. Repository Discovery
- [x] Clone & inventory every file (source, config, docs, infra)
    - [x] Clone repository
    - [x] Build file manifest (path, size, SHA, language, LOC, cyclomatic complexity)

## 2. Duplicate / Similarity Scan
- [x] Use jscpd and cpd-typescript for textual clones. (Used custom Python script for exact duplicates due to tool issues)
- [ ] Use Deckard / SourcererCC for semantic similarity. (Deferred for later, more specialized phase)
- [x] Output a CSV: [fileA, fileB, %similar, reason].

## 3. Static Analysis
- [ ] TypeScript correctness (tsc --noEmit --strict) - **BLOCKED: Node.js/npm environment issues.**
- [ ] Lint / style (ESLint (Airbnb + Next.js) + Prettier) - **BLOCKED: Node.js/npm environment issues.**
- [ ] Security (npm audit, Snyk OSS & Code, Semgrep rules, OWASP-dependency-check)
    - [x] OWASP-dependency-check (Scan initiated, but output not fully captured due to sandbox termination/tool output issues)
    - [ ] Snyk OSS & Code - **BLOCKED: Node.js/npm environment issues.**
    - [ ] Semgrep rules - (Requires installation, may be blocked by Node.js or other dependencies)
- [ ] Code quality (SonarQube, typescript-eslint, complexity metrics) - **PARTIALLY BLOCKED: Node.js/npm environment issues for TS/JS.**
- [ ] Build health (next build, docker build, k8s kustomize build) - **PARTIALLY BLOCKED: Node.js/npm for Next.js build.**
- [ ] Infra security (Trivy container / IaC scans)
- [ ] Secrets (Gitleaks) - **PARTIALLY BLOCKED: Tool output issues, unable to capture report.**
- [ ] Licenses (license-checker) - **BLOCKED: Node.js/npm environment issues.**
- [ ] Collate all findings into /reports/*.json.

## 4. Testing & Coverage
- [ ] Identify existing tests (Jest/Vitest, Cypress/Playwright). - **BLOCKED: Node.js/npm environment issues.**
- [ ] Generate missing unit tests using GPT-powered test-gen or CodiumAI. - **BLOCKED: Node.js/npm environment issues.**
- [ ] Add end-to-end Playwright flows (patient registration, appointment, billing). - **BLOCKED: Node.js/npm environment issues.**
- [ ] Achieve >90% branch coverage (nyc). - **BLOCKED: Node.js/npm environment issues.**

## 5. UI / UX & Accessibility
- [ ] Spin up Storybook; auto-detect missing stories, create stubs. - **BLOCKED: Node.js/npm environment issues.**
- [ ] Run Axe, Lighthouse CI, Pa11y; fix WCAG 2.1 AA issues. - **BLOCKED: Node.js/npm environment issues.**
- [ ] Add responsive design checks (mobile, tablet, desktop). - **BLOCKED: Node.js/npm environment issues.**

## 6. Architecture & Microservices
- [ ] Validate claimed microservice modules; if missing, scaffold:
    - [ ] patient-service, ehr-service, billing-service, notification-service, etc.
- [ ] Enforce Clean / Hexagonal architecture in each.
- [ ] API: OpenAPI 3 specs per service; generate TS SDKs.
- [ ] Messaging: use NATS / Redis BullMQ with typed events.

## 7. Security Hardening
- [ ] JWT + MFA (TOTP & WebAuthn).
- [ ] Rate limiting & Helmet.
- [ ] Data-at-rest encryption hooks (Prisma field-level).
- [ ] Audit logs (Winston + Prisma middleware).
- [ ] Secrets via GitHub Actions OIDC → cloud KMS.

## 8. CI / CD
- [ ] GitHub Actions matrix: lint → test → build → scan → deploy.
- [ ] Push images to GHCR; sign with Cosign.
- [ ] Helm chart + ArgoCD manifest for K8s.

## 9. Documentation
- [ ] Autogenerate updated README, ARCHITECTURE.md, ADR/, OPENAPI/, Storybook docs.
- [ ] One-pager RUNBOOK.md for SREs.

## 10. Parallelization Strategy
- [ ] Define streams, teams, tasks, toolchain.
- [ ] Use GitHub Projects v2 for tracking; each issue auto-links to its PR.

## 11. Autonomous Fix Implementation Loop
- [ ] Pick highest-severity issue.
- [ ] Create short-lived branch (fix/<slug>).
- [ ] Apply patch; run npm run validate:full.
- [ ] If CI green, open PR with auto-generated changelog.
- [ ] Merge once at least two bots (Lint Bot, Test Bot) approve.

## 12. Acceptance Criteria
- [ ] main branch CI passes 100%.
- [ ] SonarQube: reliability A, security A, maintainability A.
- [ ] No High or Critical Snyk / Trivy findings.
- [ ] Lighthouse scores ≥ 90 across the board.
- [ ] Deployment to staging K8s succeeds via ArgoCD sync.