import { useState, useMemo, useCallback } from "react";
import * as recharts from "recharts";
const { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Legend } = recharts;

// ═══════════════════════════════════════════════════════════════════════
// CTL FLEXIBLE PACKAGING AUDIT & RECOMMENDATION DASHBOARD
// Close the Loop – Packaging Division
// ═══════════════════════════════════════════════════════════════════════

// ── BRAND TOKENS (from CLG Style Guide May 2024) ────────────────────
const BRAND = {
  smokyBlack: "#131110",
  warmWhite: "#FFFEF8",
  springGreen: "#DCE34C",
  blueSkies: "#6DC9C9",
  moonGrey: "#D6D5D3",
  charcoal: "#2A2A2A",
  midGrey: "#6B6B6B",
  lightGrey: "#E8E7E5",
  surface: "#F5F4F2",
  // Layer role colours
  layerSurface: "#6DC9C9",
  layerBarrier: "#DCE34C",
  layerCore: "#F4A460",
  layerSealant: "#9BB566",
};

// ── MATERIAL DATABASE (inline for self-contained JSX) ────────────────
const MATERIALS = {
  BOPP: { abbr: "BOPP", name: "Biaxially Oriented PP", otr: 1600, wvtr: 4, mono: "PP", family: "OPP" },
  BOPP_HEAT_SEAL: { abbr: "BOPP-HS", name: "Heat-Seal BOPP", otr: 1600, wvtr: 4, mono: "PP", family: "OPP" },
  VMOPP: { abbr: "VMOPP", name: "Metallised OPP", otr: 25, wvtr: 1.5, mono: "PP", family: "OPP" },
  BOPET: { abbr: "PET", name: "Biaxially Oriented PET", otr: 50, wvtr: 15, mono: "PET", family: "PET" },
  VMPET: { abbr: "VMPET", name: "Metallised PET", otr: 1, wvtr: 1, mono: null, family: "PET" },
  PET_ALOX: { abbr: "AlOx/PET", name: "AlOx Coated PET", otr: 1, wvtr: 1, mono: null, family: "PET" },
  PET_SIOX: { abbr: "SiOx/PET", name: "SiOx Coated PET", otr: 1.5, wvtr: 1.5, mono: null, family: "PET" },
  BOPA: { abbr: "NY", name: "Biaxially Oriented Nylon", otr: 20, wvtr: 130, mono: null, family: "PA" },
  LDPE: { abbr: "LDPE", name: "Low Density PE", otr: 6500, wvtr: 10, mono: "PE", family: "PE" },
  LLDPE: { abbr: "LLDPE", name: "Linear Low Density PE", otr: 6000, wvtr: 8, mono: "PE", family: "PE" },
  HDPE: { abbr: "HDPE", name: "High Density PE", otr: 2500, wvtr: 3, mono: "PE", family: "PE" },
  MDO_PE: { abbr: "MDO-PE", name: "MD Oriented PE", otr: 2000, wvtr: 6, mono: "PE", family: "PE" },
  BOPE: { abbr: "BOPE", name: "Biaxially Oriented PE", otr: 1800, wvtr: 5, mono: "PE", family: "PE" },
  PE_COEX: { abbr: "PE Coex", name: "Co-extruded PE", otr: 5000, wvtr: 8, mono: "PE", family: "PE" },
  CPP: { abbr: "CPP", name: "Cast PP", otr: 2500, wvtr: 5, mono: "PP", family: "PP" },
  RCPP: { abbr: "RCPP", name: "Retort CPP", otr: 2000, wvtr: 4, mono: "PP", family: "PP" },
  VMCPP: { abbr: "VMCPP", name: "Metallised CPP", otr: 40, wvtr: 2, mono: "PP", family: "PP" },
  AL_FOIL: { abbr: "AL", name: "Aluminium Foil", otr: 0.01, wvtr: 0.01, mono: null, family: "AL" },
  EVOH: { abbr: "EVOH", name: "Ethylene Vinyl Alcohol", otr: 0.5, wvtr: 50, mono: null, family: "EVOH" },
  PAPER: { abbr: "Paper", name: "Kraft/MG Paper", otr: 10000, wvtr: 300, mono: null, family: "Paper" },
};

// ── BARRIER REFERENCE POINTS ─────────────────────────────────────────
const BARRIER_REFS = [
  { id: "LDPE", label: "LDPE", otr: 6500, wvtr: 10, color: "#90EE90" },
  { id: "LLDPE", label: "LLDPE", otr: 6000, wvtr: 8, color: "#98FB98" },
  { id: "HDPE", label: "HDPE", otr: 2500, wvtr: 3, color: "#7CCD7C" },
  { id: "BOPP", label: "BOPP", otr: 1600, wvtr: 4, color: BRAND.blueSkies },
  { id: "PET", label: "PET", otr: 50, wvtr: 15, color: "#7FB3D8" },
  { id: "NY", label: "NY", otr: 20, wvtr: 130, color: "#F4A460" },
  { id: "VMPET", label: "VMPET", otr: 1, wvtr: 1, color: "#A0A0A0" },
  { id: "EVOH", label: "EVOH(dry)", otr: 0.5, wvtr: 50, color: "#FFD700" },
  { id: "AL", label: "AL Foil", otr: 0.01, wvtr: 0.01, color: "#808080" },
];

// ── LAMINATE BARRIER PROFILES ────────────────────────────────────────
const LAMINATE_BARRIERS = {
  "OPP/CPP": { otr: 1200, wvtr: 4 },
  "OPP/VMPET/CPP": { otr: 1, wvtr: 1 },
  "OPP/VMOPP/CPP": { otr: 20, wvtr: 1.5 },
  "PET/NY/LLDPE": { otr: 15, wvtr: 8 },
  "PET/AL/RCPP": { otr: 0.01, wvtr: 0.01 },
  "PET/VMPET/PE": { otr: 1, wvtr: 1 },
  "NY/LLDPE": { otr: 18, wvtr: 8 },
  "PET/PE": { otr: 45, wvtr: 8 },
  "MDO-PE/LLDPE": { otr: 1500, wvtr: 6 },
  "BOPE/PE": { otr: 1400, wvtr: 5 },
  "PE/EVOH/PE": { otr: 0.5, wvtr: 8 },
  "BOPP/BOPP-HS": { otr: 1200, wvtr: 3 },
  "BOPP/VMOPP/BOPP-HS": { otr: 20, wvtr: 1.5 },
  "MDO-PE/SiOx/PE": { otr: 1.5, wvtr: 1.5 },
  "MDO-PE/AlOx/PE": { otr: 1, wvtr: 1 },
  "PET/NY/AL/RCPP": { otr: 0.01, wvtr: 0.01 },
  "BOPP/VMCPP": { otr: 35, wvtr: 2 },
};

// ── DECISION RULES ───────────────────────────────────────────────────
const RULES = [
  {
    id: "retort_standard", app: ["retort"], sustMax: 3,
    conv: { structure: "PET / NY / AL / RCPP", profile: "PET/NY/AL/RCPP", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / heat resistance", thick: "12µm" },
      { mat: "BOPA", role: "core", fn: "Puncture / thermoforming", thick: "15–25µm" },
      { mat: "AL_FOIL", role: "barrier", fn: "Absolute barrier", thick: "7–9µm" },
      { mat: "RCPP", role: "sealant", fn: "Retort sealant 121–135°C", thick: "70–100µm" },
    ]},
    sust: { structure: "Mono-PP / EVOH / RCPP", profile: "PE/EVOH/PE", layers: [
      { mat: "BOPP", role: "surface", fn: "Print carrier (PP)", thick: "20µm" },
      { mat: "EVOH", role: "barrier", fn: "OTR barrier (<5% wt)", thick: "5µm" },
      { mat: "RCPP", role: "sealant", fn: "Retort sealant", thick: "70–100µm" },
    ], notes: "Emerging mono-PP retort. Post-retort EVOH barrier recovery must be validated." },
  },
  {
    id: "retort_sust", app: ["retort"], sustMin: 4,
    conv: { structure: "PET / AL / RCPP", profile: "PET/AL/RCPP", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / heat resistance", thick: "12µm" },
      { mat: "AL_FOIL", role: "barrier", fn: "Absolute barrier", thick: "7µm" },
      { mat: "RCPP", role: "sealant", fn: "Retort sealant", thick: "70µm" },
    ]},
    sust: { structure: "Mono-PP / EVOH / RCPP", profile: "PE/EVOH/PE", layers: [
      { mat: "BOPP", role: "surface", fn: "Print carrier (PP)", thick: "20µm" },
      { mat: "EVOH", role: "barrier", fn: "OTR barrier (<5%)", thick: "3–5µm" },
      { mat: "RCPP", role: "sealant", fn: "Retort sealant", thick: "70–100µm" },
    ], notes: "Mono-PP retort emerging. EVOH humidity post-retort critical." },
  },
  {
    id: "frozen_std", app: ["frozen_food"], sustMax: 3,
    conv: { structure: "NY / LLDPE", profile: "NY/LLDPE", layers: [
      { mat: "BOPA", role: "surface", fn: "Puncture resistance / print", thick: "15µm" },
      { mat: "LLDPE", role: "sealant", fn: "Cold-chain sealant", thick: "50–80µm" },
    ]},
    sust: { structure: "MDO-PE / LLDPE", profile: "MDO-PE/LLDPE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web / stiffness", thick: "25µm" },
      { mat: "LLDPE", role: "sealant", fn: "High-toughness sealant", thick: "60–80µm" },
    ], notes: "Mono-PE recyclable. Validate cold-chain flex crack." },
  },
  {
    id: "frozen_sust", app: ["frozen_food"], sustMin: 4,
    conv: { structure: "PET / NY / LLDPE", profile: "PET/NY/LLDPE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / stiffness", thick: "12µm" },
      { mat: "BOPA", role: "core", fn: "Puncture resistance", thick: "15µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ]},
    sust: { structure: "MDO-PE / LLDPE", profile: "MDO-PE/LLDPE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web (mono-PE)", thick: "25–30µm" },
      { mat: "LLDPE", role: "sealant", fn: "High-toughness sealant", thick: "70µm" },
    ], notes: "Full mono-PE. MDO-PE replaces PET+NY." },
  },
  {
    id: "snacks_std", app: ["snacks", "confectionery"], sustMax: 3,
    conv: { structure: "OPP / VMPET / CPP", profile: "OPP/VMPET/CPP", layers: [
      { mat: "BOPP", role: "surface", fn: "Print / gloss", thick: "20µm" },
      { mat: "VMPET", role: "barrier", fn: "OTR + light barrier", thick: "12µm" },
      { mat: "CPP", role: "sealant", fn: "Sealant", thick: "25–30µm" },
    ]},
    sust: { structure: "BOPP / VMOPP / BOPP-HS", profile: "BOPP/VMOPP/BOPP-HS", layers: [
      { mat: "BOPP", role: "surface", fn: "Print carrier", thick: "20µm" },
      { mat: "VMOPP", role: "barrier", fn: "Met OTR + moisture barrier", thick: "20µm" },
      { mat: "BOPP_HEAT_SEAL", role: "sealant", fn: "PP sealant", thick: "25µm" },
    ], notes: "Mono-PP recyclable. Validate bond strength on met surface." },
  },
  {
    id: "snacks_sust", app: ["snacks", "confectionery"], sustMin: 4,
    conv: { structure: "OPP / VMPET / CPP", profile: "OPP/VMPET/CPP", layers: [
      { mat: "BOPP", role: "surface", fn: "Print / gloss", thick: "20µm" },
      { mat: "VMPET", role: "barrier", fn: "OTR + light barrier", thick: "12µm" },
      { mat: "CPP", role: "sealant", fn: "Sealant", thick: "25–30µm" },
    ]},
    sust: { structure: "BOPP / VMCPP (mono-PP)", profile: "BOPP/VMCPP", layers: [
      { mat: "BOPP", role: "surface", fn: "Print carrier", thick: "20µm" },
      { mat: "VMCPP", role: "barrier", fn: "Met barrier + seal", thick: "25µm" },
    ], notes: "Mono-PP. VMCPP dual-function." },
  },
  {
    id: "puffed_std", app: ["puffed_snacks"], sustMax: 5,
    conv: { structure: "OPP / VMPET / PE", profile: "PET/VMPET/PE", layers: [
      { mat: "BOPP", role: "surface", fn: "Print / stiffness", thick: "20µm" },
      { mat: "VMPET", role: "barrier", fn: "OTR + light barrier", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "VFFS sealant", thick: "40µm" },
    ]},
    sust: { structure: "BOPP / VMCPP (mono-PP)", profile: "BOPP/VMCPP", layers: [
      { mat: "BOPP", role: "surface", fn: "Print carrier", thick: "20µm" },
      { mat: "VMCPP", role: "barrier", fn: "Met barrier + seal", thick: "25µm" },
    ], notes: "Mono-PP. VMCPP dual barrier+sealant." },
  },
  {
    id: "vacuum_std", app: ["vacuum"], sustMax: 3,
    conv: { structure: "PET / NY / LLDPE", profile: "PET/NY/LLDPE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / stiffness", thick: "12µm" },
      { mat: "BOPA", role: "core", fn: "Puncture / vacuum hold", thick: "15–25µm" },
      { mat: "LLDPE", role: "sealant", fn: "Vacuum sealant", thick: "50–80µm" },
    ]},
    sust: { structure: "PE / EVOH / PE", profile: "PE/EVOH/PE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web (PE)", thick: "25µm" },
      { mat: "EVOH", role: "barrier", fn: "OTR barrier (<5%)", thick: "3–5µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ], notes: "Mono-PE + EVOH. Reduced puncture vs NY." },
  },
  {
    id: "vacuum_sust", app: ["vacuum"], sustMin: 4,
    conv: { structure: "PET / NY / LLDPE", profile: "PET/NY/LLDPE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / stiffness", thick: "12µm" },
      { mat: "BOPA", role: "core", fn: "Puncture / vacuum hold", thick: "15–25µm" },
      { mat: "LLDPE", role: "sealant", fn: "Vacuum sealant", thick: "50–80µm" },
    ]},
    sust: { structure: "MDO-PE / EVOH / PE", profile: "PE/EVOH/PE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web (mono-PE)", thick: "25–30µm" },
      { mat: "EVOH", role: "barrier", fn: "OTR barrier (<5%)", thick: "3–5µm" },
      { mat: "LLDPE", role: "sealant", fn: "High-toughness PE", thick: "60µm" },
    ], notes: "Full mono-PE recyclable. Validate vacuum hold without NY." },
  },
  {
    id: "hotfill", app: ["liquids_hotfill"], sustMax: 5,
    conv: { structure: "PET / AL / CPP", profile: "PET/AL/RCPP", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / heat resistance", thick: "12µm" },
      { mat: "AL_FOIL", role: "barrier", fn: "Barrier", thick: "7µm" },
      { mat: "CPP", role: "sealant", fn: "Hot-fill sealant", thick: "50–70µm" },
    ]},
    sust: { structure: "MDO-PE / AlOx / PE", profile: "MDO-PE/AlOx/PE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web (PE)", thick: "25µm" },
      { mat: "PET_ALOX", role: "barrier", fn: "AlOx transparent barrier", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ], notes: "AlOx replaces AL. Validate heat tolerance for hot-fill." },
  },
  {
    id: "coffee_std", app: ["coffee_tea"], sustMax: 3,
    conv: { structure: "PET / VMPET / PE", profile: "PET/VMPET/PE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print carrier", thick: "12µm" },
      { mat: "VMPET", role: "barrier", fn: "OTR + aroma + light", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ]},
    sust: { structure: "MDO-PE / VMOPP / PE", profile: "OPP/VMOPP/CPP", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web", thick: "25µm" },
      { mat: "VMOPP", role: "barrier", fn: "Met OTR + aroma barrier", thick: "20µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ], notes: "Met barrier critical for coffee aroma. Verify shelf-life." },
  },
  {
    id: "coffee_sust", app: ["coffee_tea"], sustMin: 4,
    conv: { structure: "PET / AL / PE", profile: "PET/AL/RCPP", layers: [
      { mat: "BOPET", role: "surface", fn: "Print carrier", thick: "12µm" },
      { mat: "AL_FOIL", role: "barrier", fn: "Absolute aroma barrier", thick: "7µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ]},
    sust: { structure: "MDO-PE / AlOx / PE", profile: "MDO-PE/AlOx/PE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web (mono-PE)", thick: "25µm" },
      { mat: "PET_ALOX", role: "barrier", fn: "AlOx high barrier", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ], notes: "AlOx replaces AL foil. Validate aroma retention vs AL." },
  },
  {
    id: "petfood", app: ["pet_food"], sustMax: 5,
    conv: { structure: "PET / VMPET / PE", profile: "PET/VMPET/PE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / puncture", thick: "12µm" },
      { mat: "VMPET", role: "barrier", fn: "OTR + light + aroma", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Tough sealant", thick: "70µm" },
    ]},
    sust: { structure: "MDO-PE / EVOH / PE", profile: "PE/EVOH/PE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web", thick: "25µm" },
      { mat: "EVOH", role: "barrier", fn: "OTR barrier (<5%)", thick: "5µm" },
      { mat: "LLDPE", role: "sealant", fn: "Tough sealant", thick: "70µm" },
    ], notes: "Mono-PE+EVOH. Validate for fat/oil migration." },
  },
  {
    id: "powder_std", app: ["powder"], sustMax: 5,
    conv: { structure: "PET / VMPET / PE", profile: "PET/VMPET/PE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print carrier", thick: "12µm" },
      { mat: "VMPET", role: "barrier", fn: "Moisture + OTR barrier", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ]},
    sust: { structure: "MDO-PE / SiOx / PE", profile: "MDO-PE/SiOx/PE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web", thick: "25µm" },
      { mat: "PET_SIOX", role: "barrier", fn: "SiOx transparent barrier", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ], notes: "SiOx transparent moisture barrier. Validate for hygroscopic powders." },
  },
  {
    id: "detergents", app: ["detergents"], sustMax: 5,
    conv: { structure: "PET / PE", profile: "PET/PE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / chemical resistance", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Tough sealant", thick: "80–100µm" },
    ]},
    sust: { structure: "MDO-PE / LLDPE (mono-PE)", profile: "MDO-PE/LLDPE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web / stiffness", thick: "30µm" },
      { mat: "LLDPE", role: "sealant", fn: "Tough sealant", thick: "80–100µm" },
    ], notes: "Full mono-PE recyclable. Low barrier requirement." },
  },
  {
    id: "cosmetics", app: ["cosmetics"], sustMax: 5,
    conv: { structure: "PET / VMPET / PE", profile: "PET/VMPET/PE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / gloss / premium", thick: "12µm" },
      { mat: "VMPET", role: "barrier", fn: "Light + moisture barrier", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ]},
    sust: { structure: "MDO-PE / VMOPP / PE", profile: "OPP/VMOPP/CPP", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web", thick: "25µm" },
      { mat: "VMOPP", role: "barrier", fn: "Met light + barrier", thick: "20µm" },
      { mat: "LLDPE", role: "sealant", fn: "Sealant", thick: "50µm" },
    ], notes: "Met look preserved. Mixed PE/PP – check recycling." },
  },
  {
    id: "lidding_std", app: ["lidding"], sustMax: 3,
    conv: { structure: "PET / PE (peel)", profile: "PET/PE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / stiffness", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Peelable sealant", thick: "30–50µm" },
    ]},
    sust: { structure: "Mono-PE peelable lid", profile: "MDO-PE/LLDPE", layers: [
      { mat: "MDO_PE", role: "surface", fn: "Print web (PE)", thick: "25µm" },
      { mat: "LLDPE", role: "sealant", fn: "Peelable PE sealant", thick: "30–40µm" },
    ], notes: "Mono-PE peel. Match sealant to tray material." },
  },
  {
    id: "lidding_sust", app: ["lidding"], sustMin: 4,
    conv: { structure: "PET / PE (peel)", profile: "PET/PE", layers: [
      { mat: "BOPET", role: "surface", fn: "Print / stiffness", thick: "12µm" },
      { mat: "LLDPE", role: "sealant", fn: "Peelable sealant", thick: "30–50µm" },
    ]},
    sust: { structure: "Mono-PP peelable lid", profile: "BOPP/BOPP-HS", layers: [
      { mat: "BOPP", role: "surface", fn: "Print carrier (PP)", thick: "20µm" },
      { mat: "CPP", role: "sealant", fn: "Peelable PP sealant", thick: "25–30µm" },
    ], notes: "Mono-PP peel for PP trays. Peel force calibration critical." },
  },
];

// ── PROCESSING RISKS ─────────────────────────────────────────────────
const RISK_NOTES = {
  BOPA: ["Hygroscopic: store <60% RH, condition before lamination", "Excellent flex crack resistance; moisture affects barrier", "Essential for vacuum hold and retort puncture"],
  AL_FOIL: ["Flex crack risk <9µm: pinhole formation under flexing", "Not recyclable in laminate form", "Consider AlOx/SiOx alternatives"],
  EVOH: ["OTR barrier degrades significantly >75% RH", "Must be sandwiched in PE/PP moisture barrier", "Post-retort barrier recovery time: validate", "Keep <5–6% by weight for recyclability"],
  VMPET: ["Bond strength to met surface critical: delamination risk", "Corona/flame treatment required for adhesion", "Light barrier for photosensitive products"],
  VMOPP: ["Met adhesion lower than VMPET: validate bond strength", "Enables mono-PP barrier structures"],
  RCPP: ["Validate seal integrity at 121–135°C", "Higher seal initiation temp than standard CPP", "Dimensional stability under retort critical"],
  MDO_PE: ["MD orientation gives PET-like stiffness in PE", "Print quality approaching PET/OPP, not yet equivalent", "Key enabler for mono-PE recyclable structures"],
  LLDPE: ["Seal initiation: 105–135°C (grade dependent)", "Cold chain: validate seal at -40°C", "HFFS/VFFS compatible, good hot tack"],
};

// ── APPLICATION LIST ─────────────────────────────────────────────────
const APPS = [
  { id: "frozen_food", label: "Frozen Food", icon: "\u2744" },
  { id: "snacks", label: "Snacks / Biscuits", icon: "\u25CB" },
  { id: "puffed_snacks", label: "Puffed Snacks", icon: "\u25CE" },
  { id: "vacuum", label: "Vacuum Packaging", icon: "\u25A3" },
  { id: "liquids_hotfill", label: "Liquids / Hot-Fill", icon: "\u25C7" },
  { id: "retort", label: "Retort 121\u2013135\u00B0C", icon: "\u25B2" },
  { id: "coffee_tea", label: "Coffee / Tea", icon: "\u25C6" },
  { id: "pet_food", label: "Pet Food", icon: "\u25C9" },
  { id: "powder", label: "Powder Products", icon: "\u25CC" },
  { id: "detergents", label: "Detergents & Chem", icon: "\u25A1" },
  { id: "cosmetics", label: "Cosmetics", icon: "\u25C8" },
  { id: "confectionery", label: "Confectionery", icon: "\u25CF" },
  { id: "lidding", label: "Lidding / Peelable", icon: "\u25AD" },
];

const BARRIER_OPTS = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high_otr", label: "High OTR" },
  { id: "high_moisture", label: "High WVTR" },
  { id: "light", label: "Light-Sensitive" },
  { id: "aroma", label: "Aroma Critical" },
];

const MECH_OPTS = [
  { id: "vacuum", label: "Vacuum" },
  { id: "nitrogen_flush", label: "N\u2082 Flush" },
  { id: "cold_chain", label: "Cold Chain" },
  { id: "puncture", label: "High Puncture" },
  { id: "retort", label: "Retort" },
  { id: "hffs", label: "HFFS" },
  { id: "vffs", label: "VFFS" },
  { id: "peelable", label: "Peelable Seal" },
];

const RESTRICT_OPTS = [
  { id: "avoid_al", label: "Avoid Aluminium" },
  { id: "avoid_ny", label: "Avoid Nylon" },
  { id: "prefer_pe", label: "Prefer PE Mono" },
  { id: "prefer_pp", label: "Prefer PP Mono" },
  { id: "pcr", label: "PCR Required" },
];

// ── DECISION ENGINE ──────────────────────────────────────────────────
function resolve(app, sust) {
  const match = RULES.find(r => {
    if (!r.app.includes(app)) return false;
    if (r.sustMin && sust < r.sustMin) return false;
    if (r.sustMax && sust > r.sustMax) return false;
    return true;
  });
  if (!match) {
    return RULES.find(r => r.app.includes(app)) || RULES[RULES.length - 1];
  }
  return match;
}

function getRecyclability(layers) {
  const fams = new Set(layers.map(l => {
    const m = MATERIALS[l.mat];
    if (!m) return "UNKNOWN";
    if (m.family === "EVOH") return "__EVOH__";
    if (["OPP", "PP"].includes(m.family)) return "PP";
    if (["PE"].includes(m.family)) return "PE";
    if (["PET"].includes(m.family)) return "PET";
    return m.family;
  }));
  const main = new Set([...fams].filter(f => f !== "__EVOH__"));
  const hasEVOH = fams.has("__EVOH__");
  const hasAL = fams.has("AL");
  const hasPA = fams.has("PA");
  if (main.size === 1 && !hasEVOH) return { score: 95, label: "High", mono: true };
  if (main.size === 1 && hasEVOH) return { score: 80, label: "Mod-High", mono: false };
  if (hasAL) return { score: 25, label: "Low", mono: false };
  if (hasPA) return { score: 40, label: "Mod-Low", mono: false };
  return { score: 55, label: "Moderate", mono: false };
}

// ── LAYER ROLE COLORS ────────────────────────────────────────────────
const ROLE_COLORS = {
  surface: BRAND.blueSkies,
  barrier: BRAND.springGreen,
  core: "#F4A460",
  sealant: BRAND.layerSealant,
};
const ROLE_LABELS = { surface: "Surface / Print", barrier: "Barrier", core: "Core", sealant: "Sealant" };

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

// ── Toggle Button ────────────────────────────────────────────────────
function Toggle({ active, onClick, children, small }) {
  return (
    <button
      onClick={onClick}
      className={`
        border transition-all duration-150 font-medium select-none cursor-pointer
        ${small ? "text-xs px-2 py-1 rounded" : "text-xs px-3 py-1.5 rounded-md"}
        ${active
          ? "border-[#DCE34C] bg-[#DCE34C]/15 text-[#131110]"
          : "border-[#D6D5D3] bg-transparent text-[#6B6B6B] hover:border-[#6B6B6B] hover:text-[#2A2A2A]"
        }
      `}
    >
      {children}
    </button>
  );
}

// ── Multi-select Toggle Group ────────────────────────────────────────
function MultiToggle({ options, selected, onToggle, small }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => (
        <Toggle key={o.id} active={selected.includes(o.id)} onClick={() => onToggle(o.id)} small={small}>
          {o.icon ? `${o.icon} ${o.label}` : o.label}
        </Toggle>
      ))}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────────────
function SectionLabel({ letter, children }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
      <span className="w-5 h-5 rounded bg-[#131110] text-[#FFFEF8] text-[10px] font-bold flex items-center justify-center flex-shrink-0">{letter}</span>
      <span className="text-[11px] font-semibold tracking-wider uppercase text-[#2A2A2A]">{children}</span>
    </div>
  );
}

// ── Slider ───────────────────────────────────────────────────────────
function SustainabilitySlider({ value, onChange }) {
  const labels = ["Performance", "", "Balanced", "", "Recyclability"];
  return (
    <div>
      <input
        type="range" min="1" max="5" step="1" value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${BRAND.blueSkies} 0%, ${BRAND.springGreen} 100%)`,
          accentColor: BRAND.springGreen,
        }}
      />
      <div className="flex justify-between mt-1">
        {labels.map((l, i) => (
          <span key={i} className={`text-[9px] ${value === i + 1 ? "text-[#131110] font-bold" : "text-[#6B6B6B]"}`}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ── Laminate Stack Diagram ───────────────────────────────────────────
function LaminateStack({ layers, title, type }) {
  const borderColor = type === "conventional" ? BRAND.blueSkies : BRAND.springGreen;
  return (
    <div className="rounded-lg border p-3" style={{ borderColor }}>
      <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: borderColor }}>{title}</div>
      <div className="text-sm font-semibold text-[#131110] mb-3">{layers.length > 0 ? layers.map(l => MATERIALS[l.mat]?.abbr || l.mat).join(" / ") : "—"}</div>
      <div className="space-y-0">
        {layers.map((layer, i) => {
          const roleColor = ROLE_COLORS[layer.role] || "#999";
          return (
            <div key={i} className="flex items-stretch" style={{ minHeight: 36 }}>
              <div className="w-1.5 flex-shrink-0 rounded-l" style={{ backgroundColor: roleColor }} />
              <div className="flex-1 border-t border-r border-b border-[#E8E7E5] px-3 py-1.5 flex items-center justify-between"
                style={{ backgroundColor: `${roleColor}08` }}>
                <div>
                  <span className="text-xs font-semibold text-[#131110]">{MATERIALS[layer.mat]?.abbr || layer.mat}</span>
                  <span className="text-[10px] text-[#6B6B6B] ml-2">{layer.fn}</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-[10px] text-[#6B6B6B]">{layer.thick}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-2 flex-wrap">
        {Object.entries(ROLE_LABELS).filter(([k]) => layers.some(l => l.role === k)).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: ROLE_COLORS[k] }} />
            <span className="text-[9px] text-[#6B6B6B]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Radial Score Meter ───────────────────────────────────────────────
function RadialScore({ score, label, mono }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 80 ? BRAND.springGreen : score >= 55 ? "#F4A460" : "#E85D5D";
  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke={BRAND.lightGrey} strokeWidth="6" />
        <circle cx="44" cy="44" r={radius} fill="none" stroke={scoreColor} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        <text x="44" y="40" textAnchor="middle" className="text-lg font-bold" fill={BRAND.smokyBlack}>{score}</text>
        <text x="44" y="54" textAnchor="middle" className="text-[9px]" fill={BRAND.midGrey}>{label}</text>
      </svg>
      <div className={`mt-1 text-[9px] font-semibold px-2 py-0.5 rounded ${mono ? "bg-[#DCE34C]/20 text-[#131110]" : "bg-[#E8E7E5] text-[#6B6B6B]"}`}>
        {mono ? "MONO-MATERIAL" : "MULTI-MATERIAL"}
      </div>
    </div>
  );
}

// ── Barrier Chart ────────────────────────────────────────────────────
function BarrierChart({ convProfile, sustProfile }) {
  const convBarrier = LAMINATE_BARRIERS[convProfile] || { otr: 100, wvtr: 10 };
  const sustBarrier = LAMINATE_BARRIERS[sustProfile] || { otr: 500, wvtr: 5 };

  const scatterData = BARRIER_REFS.map(r => ({
    x: Math.log10(Math.max(r.otr, 0.001)),
    y: Math.log10(Math.max(r.wvtr, 0.001)),
    label: r.label,
    color: r.color,
    type: "ref"
  }));

  const convPoint = {
    x: Math.log10(Math.max(convBarrier.otr, 0.001)),
    y: Math.log10(Math.max(convBarrier.wvtr, 0.001)),
    label: "Conventional",
    color: BRAND.blueSkies,
    type: "conv"
  };
  const sustPoint = {
    x: Math.log10(Math.max(sustBarrier.otr, 0.001)),
    y: Math.log10(Math.max(sustBarrier.wvtr, 0.001)),
    label: "Sustainable",
    color: BRAND.springGreen,
    type: "sust"
  };

  const refData = scatterData;
  const recData = [convPoint, sustPoint];

  const formatTick = (v) => {
    const num = Math.pow(10, v);
    if (num >= 1000) return `${(num/1000).toFixed(0)}k`;
    if (num >= 1) return num.toFixed(0);
    if (num >= 0.01) return num.toFixed(2);
    return num.toExponential(0);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#131110] text-[#FFFEF8] px-2 py-1 rounded text-[10px]">
          <div className="font-semibold">{d.label}</div>
          <div>OTR: {formatTick(d.x)} cc/m\u00B2/day</div>
          <div>WVTR: {formatTick(d.y)} g/m\u00B2/day</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 12, bottom: 28, left: 12 }}>
          <CartesianGrid stroke={BRAND.lightGrey} strokeDasharray="2 2" />
          <XAxis type="number" dataKey="x" domain={[-3, 4.2]} tickFormatter={formatTick}
            tick={{ fontSize: 9, fill: BRAND.midGrey }} label={{ value: "OTR (cc/m\u00B2/day) \u2192 log scale", position: "bottom", offset: 10, style: { fontSize: 9, fill: BRAND.midGrey } }} />
          <YAxis type="number" dataKey="y" domain={[-3, 3]} tickFormatter={formatTick}
            tick={{ fontSize: 9, fill: BRAND.midGrey }} label={{ value: "WVTR (g/m\u00B2/day)", angle: -90, position: "insideLeft", offset: 0, style: { fontSize: 9, fill: BRAND.midGrey } }} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={refData} shape="circle" legendType="none">
            {refData.map((entry, i) => <Cell key={i} fill={entry.color} r={4} opacity={0.5} />)}
          </Scatter>
          <Scatter data={recData} shape="diamond" legendType="none">
            {recData.map((entry, i) => <Cell key={i} fill={entry.color} r={8} stroke={BRAND.smokyBlack} strokeWidth={1.5} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Risk Notes Panel ─────────────────────────────────────────────────
function RiskNotes({ layers, sustainableNotes }) {
  const allMats = [...new Set(layers.map(l => l.mat))];
  const notes = allMats.flatMap(m => (RISK_NOTES[m] || []).map(n => ({ mat: MATERIALS[m]?.abbr || m, note: n })));
  const [open, setOpen] = useState(false);

  if (notes.length === 0 && !sustainableNotes) return null;

  return (
    <div className="border border-[#E8E7E5] rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#F5F4F2] hover:bg-[#E8E7E5] transition-colors cursor-pointer">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2A2A2A]">Processing & Risk Notes</span>
        <span className="text-xs text-[#6B6B6B]">{open ? "\u25B4" : "\u25BE"}</span>
      </button>
      {open && (
        <div className="px-3 py-2 space-y-1.5">
          {sustainableNotes && (
            <div className="text-[10px] text-[#131110] bg-[#DCE34C]/10 px-2 py-1.5 rounded border border-[#DCE34C]/30">
              <span className="font-semibold">CTL Note:</span> {sustainableNotes}
            </div>
          )}
          {notes.map((n, i) => (
            <div key={i} className="text-[10px] text-[#6B6B6B] flex gap-2">
              <span className="font-semibold text-[#2A2A2A] flex-shrink-0 w-14">{n.mat}</span>
              <span>{n.note}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [app, setApp] = useState("snacks");
  const [barriers, setBarriers] = useState(["medium"]);
  const [mechanical, setMechanical] = useState([]);
  const [sustainability, setSustainability] = useState(3);
  const [restrictions, setRestrictions] = useState([]);

  const toggleItem = useCallback((arr, setArr) => (id) => {
    setArr(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const result = useMemo(() => resolve(app, sustainability), [app, sustainability]);
  const convRecyc = useMemo(() => getRecyclability(result.conv.layers), [result]);
  const sustRecyc = useMemo(() => getRecyclability(result.sust.layers), [result]);

  const allLayers = [...result.conv.layers, ...result.sust.layers];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: BRAND.surface, color: BRAND.smokyBlack, fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif" }}>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="border-b border-[#D6D5D3] px-5 py-3 flex items-center justify-between" style={{ backgroundColor: BRAND.smokyBlack }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: BRAND.springGreen }}>
            <span className="text-[#131110] font-bold text-sm">CTL</span>
          </div>
          <div>
            <div className="text-[#FFFEF8] text-sm font-bold tracking-wide">Flexible Packaging Audit</div>
            <div className="text-[#6B6B6B] text-[9px] tracking-widest uppercase">Close the Loop \u2014 Packaging Division</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[9px] text-[#6B6B6B] tracking-wider uppercase">Engineering Decision Tool</div>
          <div className="w-2 h-2 rounded-full bg-[#DCE34C]" />
        </div>
      </div>

      {/* ── MAIN SPLIT ─────────────────────────────────────── */}
      <div className="flex" style={{ height: "calc(100vh - 52px)" }}>

        {/* ── LEFT: INPUT PANEL ───────────────────────────── */}
        <div className="w-[340px] flex-shrink-0 border-r border-[#D6D5D3] overflow-y-auto px-4 py-3" style={{ backgroundColor: BRAND.warmWhite }}>
          <SectionLabel letter="A">Application Type</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {APPS.map(a => (
              <Toggle key={a.id} active={app === a.id} onClick={() => setApp(a.id)} small>
                {a.icon} {a.label}
              </Toggle>
            ))}
          </div>

          <SectionLabel letter="B">Barrier Requirement</SectionLabel>
          <MultiToggle options={BARRIER_OPTS} selected={barriers} onToggle={toggleItem(barriers, setBarriers)} small />

          <SectionLabel letter="C">Mechanical & Processing</SectionLabel>
          <MultiToggle options={MECH_OPTS} selected={mechanical} onToggle={toggleItem(mechanical, setMechanical)} small />

          <SectionLabel letter="D">Sustainability Priority</SectionLabel>
          <SustainabilitySlider value={sustainability} onChange={setSustainability} />

          <SectionLabel letter="E">Material Restrictions</SectionLabel>
          <MultiToggle options={RESTRICT_OPTS} selected={restrictions} onToggle={toggleItem(restrictions, setRestrictions)} small />

          {/* Input summary */}
          <div className="mt-6 pt-4 border-t border-[#E8E7E5]">
            <div className="text-[9px] uppercase tracking-widest text-[#6B6B6B] mb-2">Active Configuration</div>
            <div className="space-y-1">
              <div className="text-[10px]"><span className="text-[#6B6B6B]">Application:</span> <span className="font-semibold">{APPS.find(a => a.id === app)?.label}</span></div>
              <div className="text-[10px]"><span className="text-[#6B6B6B]">Sustainability:</span> <span className="font-semibold">{sustainability}/5</span></div>
              <div className="text-[10px]"><span className="text-[#6B6B6B]">Barrier:</span> <span className="font-semibold">{barriers.join(", ") || "—"}</span></div>
              <div className="text-[10px]"><span className="text-[#6B6B6B]">Restrictions:</span> <span className="font-semibold">{restrictions.length > 0 ? restrictions.join(", ") : "None"}</span></div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: OUTPUT PANEL ─────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Structure Comparison */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <LaminateStack layers={result.conv.layers} title="Conventional Structure" type="conventional" />
            <LaminateStack layers={result.sust.layers} title="Sustainable Alternative" type="sustainable" />
          </div>

          {/* Barrier Chart + Recyclability */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2 border border-[#E8E7E5] rounded-lg p-3 bg-white">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#2A2A2A] mb-1">Barrier Trade-Off</div>
              <div className="text-[9px] text-[#6B6B6B] mb-1">OTR vs WVTR \u2014 log scale \u2014 lower = better barrier</div>
              <BarrierChart convProfile={result.conv.profile} sustProfile={result.sust.profile} />
              <div className="flex gap-4 mt-1 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rotate-45" style={{ backgroundColor: BRAND.blueSkies }} />
                  <span className="text-[9px] text-[#6B6B6B]">Conventional</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rotate-45" style={{ backgroundColor: BRAND.springGreen }} />
                  <span className="text-[9px] text-[#6B6B6B]">Sustainable</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full border border-[#D6D5D3]" style={{ backgroundColor: "#ddd" }} />
                  <span className="text-[9px] text-[#6B6B6B]">Reference Materials</span>
                </div>
              </div>
            </div>

            <div className="border border-[#E8E7E5] rounded-lg p-3 bg-white flex flex-col items-center justify-center gap-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#2A2A2A] w-full text-center">Recyclability</div>
              <div className="flex gap-4 items-center">
                <div className="text-center">
                  <div className="text-[8px] text-[#6B6B6B] mb-1 uppercase">Conv.</div>
                  <RadialScore score={convRecyc.score} label={convRecyc.label} mono={convRecyc.mono} />
                </div>
                <div className="text-center">
                  <div className="text-[8px] uppercase mb-1" style={{ color: BRAND.springGreen }}>Sust.</div>
                  <RadialScore score={sustRecyc.score} label={sustRecyc.label} mono={sustRecyc.mono} />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Notes */}
          <RiskNotes layers={allLayers} sustainableNotes={result.sust.notes} />

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-[#E8E7E5] flex items-center justify-between">
            <div className="text-[8px] text-[#6B6B6B] tracking-wider uppercase">
              CTL Packaging Division \u2014 Indicative data only. Validate with supplier specifications.
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND.springGreen }} />
              <span className="text-[8px] text-[#6B6B6B]">v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
