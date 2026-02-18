# CTL Flexible Packaging Audit & Recommendation Dashboard

**Close the Loop — Packaging Division**

An interactive engineering decision tool for auditing packaging structures, comparing conventional vs sustainable alternatives, and recommending optimal CTL solutions.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect this repo to Vercel via GitHub for automatic deployments.

## Build for Production

```bash
npm run build
```

Output in `dist/` folder. Serve with any static host.

## Project Structure

```
src/
  App.jsx              # Main dashboard component
  main.jsx             # React entry point
  index.css            # Tailwind + base styles
  data/
    materialDatabase.js  # 20 material families with OTR/WVTR data
    barrierData.js       # Barrier reference points + laminate profiles
    decisionRules.js     # Decision engine + recyclability scoring
```

## Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Recharts (barrier scatter chart)

## Data Sources

Material properties sourced from the CTL Flexible Packaging Materials Guide. Barrier data represents indicative ranges — validate with supplier specifications for production use.
