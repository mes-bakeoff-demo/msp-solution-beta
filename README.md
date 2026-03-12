# MSP Solution: Beta

**Vendor Beta's Approach** — Interactive Decision Tree

**Backlog Item:** [#1 MSP Auto-Enrollment](https://github.com/mes-bakeoff-demo/mes-modernization/issues/1)

## Live Demo

[Try it here](https://mes-bakeoff-demo.github.io/msp-solution-beta)

---

## Approach

**Philosophy:** Make the eligibility logic visible. A decision tree UI shows users exactly how the determination flows, building trust and understanding.

### Why This Approach?

- **Visual Logic:** Users see the decision path, not just the result
- **Educational:** Helps caseworkers understand eligibility rules
- **Interactive:** Click through the tree to explore different scenarios
- **Transparent:** No hidden logic — the tree IS the rules

### Tech Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | React 18 | Component-based, widely understood |
| Build | Vite | Fast builds, easy GitHub Pages deploy |
| Styling | CSS Modules | Scoped styles, no conflicts |
| Visualization | Custom SVG | Lightweight, accessible |

---

## How It Works

1. User answers questions in sequence
2. Each answer highlights the path through the decision tree
3. Tree visualization updates in real-time
4. Final determination shows with full path explanation

### Decision Tree Structure

```
Start
  │
  ├─ Has Medicare? ─── No ──→ Not Eligible
  │       │
  │      Yes
  │       │
  ├─ Age 65+? ─────── No ──→ Not Eligible (unless disabled)
  │       │
  │      Yes
  │       │
  ├─ Income ≤100% FPL? ── Yes ──→ QMB
  │       │
  │      No
  │       │
  ├─ Income ≤120% FPL? ── Yes ──→ SLMB
  │       │
  │      No
  │       │
  ├─ Income ≤135% FPL? ── Yes ──→ QI
  │       │
  │      No
  │       │
  └─────────────────────────────→ Not Eligible
```

---

## Definition of Done Status

### Functional Requirements
- [x] Accept beneficiary data input
- [x] Apply MSP eligibility rules
- [x] Return determination with confidence
- [x] Provide visual explanation (tree)
- [x] Handle edge cases

### Technical Requirements
- [x] GitHub Pages deployable
- [x] No server dependencies
- [x] Open source (MIT)
- [x] Documentation
- [x] Responsive design

### Quality Requirements
- [x] Accessible (WCAG 2.1 AA)
- [x] Fast (< 1 second)
- [ ] Test coverage documented

---

## Value Report

### Iteration 1

**Outcomes Delivered:**
- Interactive decision tree visualization
- Step-by-step guided flow
- Real-time path highlighting

**Approach Strengths:**
- Highly visual and educational
- Builds user confidence in determinations
- Good for training new caseworkers

**Approach Limitations:**
- More complex codebase than Alpha
- Requires build step
- Tree can get complex with more rules

**Recommendations:**
- Consider collapsible tree for complex scenarios
- Add "what-if" mode to explore alternatives

---

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

GitHub Actions automatically deploys to Pages on push to `main`.

---

## License

MIT — Use freely, adapt as needed.

---

*Built for the [MES Bake-Off Demo](https://github.com/mes-bakeoff-demo) — see [Issue #1](https://github.com/mes-bakeoff-demo/mes-modernization/issues/1) for requirements. Created with [Kiro](https://kiro.dev).*
