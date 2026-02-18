import { useState, useMemo, useCallback } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

/* âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   CTL FLEXIBLE PACKAGING AUDIT & RECOMMENDATION DASHBOARD
   Close the Loop â Packaging Division  v4.0
   All barrier data verified against Flexible Packaging Guide
   All inputs connected to decision engine
   âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */

const B = {
  black: "#131110", white: "#FFFEF8", green: "#C8D636", greenLight: "#DCE34C",
  blue: "#6DC9C9", blueDark: "#4BA8A8", moon: "#D6D5D3", charcoal: "#2A2A2A",
  mid: "#8A8A8A", light: "#EBEBEB", surface: "#F7F7F5", card: "#FFFFFF",
  sealant: "#8AAF4B", coreFill: "#E8923F", red: "#D95555",
};

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   MATERIALS â OTR/WVTR verified against Flexible Packaging Guide
   OTR: cc/mÂ²/day @23Â°C 0%RH | WVTR: g/mÂ²/day @38Â°C 90%RH
   Representative midpoint of published ranges
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
const MAT = {
  BOPP:    {a:"BOPP",   fam:"OPP", mono:"PP",  otr:1800,  wvtr:5.5},
  BOPP_HS: {a:"BOPP-HS",fam:"OPP", mono:"PP",  otr:1800,  wvtr:5.5},
  VMOPP:   {a:"VMOPP",  fam:"OPP", mono:"PP",  otr:5,     wvtr:1.4},
  BOPET:   {a:"PET",    fam:"PET", mono:"PET", otr:100,   wvtr:8},
  VMPET:   {a:"VMPET",  fam:"PET", mono:null,  otr:2.5,   wvtr:1.0},
  PET_ALOX:{a:"AlOx/PET",fam:"PET",mono:null,  otr:0.5,   wvtr:1.8},
  PET_SIOX:{a:"SiOx/PET",fam:"PET",mono:null,  otr:0.3,   wvtr:1.0},
  BOPA:    {a:"NY",     fam:"PA",  mono:null,  otr:70,    wvtr:30},
  LDPE:    {a:"LDPE",   fam:"PE",  mono:"PE",  otr:5000,  wvtr:1.2},
  LLDPE:   {a:"LLDPE",  fam:"PE",  mono:"PE",  otr:5000,  wvtr:1.0},
  HDPE:    {a:"HDPE",   fam:"PE",  mono:"PE",  otr:2750,  wvtr:0.6},
  MDO_PE:  {a:"MDO-PE", fam:"PE",  mono:"PE",  otr:3500,  wvtr:1.0},
  BOPE:    {a:"BOPE",   fam:"PE",  mono:"PE",  otr:3000,  wvtr:0.8},
  CPP:     {a:"CPP",    fam:"PP",  mono:"PP",  otr:3500,  wvtr:1.3},
  RCPP:    {a:"RCPP",   fam:"PP",  mono:"PP",  otr:2500,  wvtr:1.0},
  VMCPP:   {a:"VMCPP",  fam:"PP",  mono:"PP",  otr:20,    wvtr:0.8},
  AL_FOIL: {a:"AL",     fam:"AL",  mono:null,  otr:0.01,  wvtr:0.01},
  EVOH:    {a:"EVOH",   fam:"EVOH",mono:null,  otr:0.5,   wvtr:7.5},
};

/* ââ BARRIER CHART REFS â verified from PDF Table p.4 ââââââââ */
const BREFS = [
  {l:"LDPE",      otr:5000,  wvtr:1.2,  c:"#7dcc7d"},
  {l:"LLDPE",     otr:5000,  wvtr:1.0,  c:"#8dd88d"},
  {l:"HDPE",      otr:2750,  wvtr:0.6,  c:"#5bb85b"},
  {l:"MDO-PE",    otr:3500,  wvtr:1.0,  c:"#66CDAA"},
  {l:"CPP",       otr:3500,  wvtr:1.3,  c:"#DDA0DD"},
  {l:"BOPP",      otr:1800,  wvtr:5.5,  c:B.blue},
  {l:"PET",       otr:100,   wvtr:8.0,  c:"#5ba3d9"},
  {l:"NY (PA)",   otr:70,    wvtr:30,   c:B.coreFill},
  {l:"VMPET",     otr:2.5,   wvtr:1.0,  c:"#999"},
  {l:"VMOPP",     otr:5,     wvtr:1.4,  c:"#C0C0C0"},
  {l:"EVOH (dry)",otr:0.5,   wvtr:7.5,  c:"#DAA520"},
  {l:"AlOx/PET",  otr:0.5,   wvtr:1.8,  c:"#D4A574"},
  {l:"SiOx/PET",  otr:0.3,   wvtr:1.0,  c:"#E8D5B7"},
  {l:"AL Foil",   otr:0.01,  wvtr:0.01, c:"#666"},
];

/* ââ LAMINATE BARRIERS â recalculated: harmonic mean of layers â */
const LB = {
  "PET/NY/AL/RCPP":    {otr:0.01,  wvtr:0.01},
  "PET/AL/RCPP":       {otr:0.01,  wvtr:0.01},
  "PET/AL/PE":         {otr:0.01,  wvtr:0.01},
  "PET/AL/CPP":        {otr:0.01,  wvtr:0.01},
  "PET/NY/LLDPE":      {otr:41,    wvtr:0.86},
  "NY/LLDPE":          {otr:69,    wvtr:0.97},
  "PET/PE":            {otr:98,    wvtr:0.89},
  "OPP/VMPET/CPP":     {otr:2.5,   wvtr:0.51},
  "PET/VMPET/PE":      {otr:2.4,   wvtr:0.47},
  "MDO-PE/LLDPE":      {otr:2060,  wvtr:0.5},
  "PE/EVOH/PE":        {otr:0.5,   wvtr:0.47},
  "BOPP/VMOPP/BOPP-HS":{otr:5,     wvtr:0.93},
  "BOPP/VMCPP":        {otr:20,    wvtr:0.70},
  "OPP/VMOPP/CPP":     {otr:5,     wvtr:0.60},
  "MDO-PE/SiOx/PE":    {otr:0.3,   wvtr:0.33},
  "MDO-PE/AlOx/PE":    {otr:0.5,   wvtr:0.39},
  "BOPP/BOPP-HS":      {otr:900,   wvtr:2.75},
};

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   APPLICATION METADATA â shelf life, storage, requirements
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
const APP_META = {
  frozen_food:    {shelf:"12\u201318 months",temp:"\u221240 to 0\u00B0C",  needs:"Puncture resistance, cold-chain seal integrity, moderate OTR barrier"},
  snacks:         {shelf:"6\u201312 months", temp:"Ambient",               needs:"Light barrier, OTR barrier, moisture barrier, N\u2082 flush retention"},
  confectionery:  {shelf:"6\u201312 months", temp:"Ambient",               needs:"Moisture barrier, light barrier, HFFS compatibility"},
  puffed_snacks:  {shelf:"3\u20136 months",  temp:"Ambient",               needs:"High OTR barrier for N\u2082 retention, VFFS compatibility, light barrier"},
  vacuum:         {shelf:"14\u201328 days chilled / 12+ months frozen",temp:"\u221218 to 5\u00B0C",needs:"High OTR barrier, puncture resistance, vacuum hold integrity"},
  liquids_hotfill:{shelf:"6\u201312 months", temp:"Fill up to 100\u00B0C", needs:"Heat resistance, barrier, seal integrity at high temperature"},
  retort:         {shelf:"18\u201336 months", temp:"121\u2013135\u00B0C autoclave",needs:"Absolute OTR + WVTR barrier, puncture resistance, retort-grade sealant"},
  coffee_tea:     {shelf:"12\u201324 months", temp:"Ambient",              needs:"High OTR barrier, aroma retention, light barrier, valve compatibility"},
  pet_food:       {shelf:"12\u201324 months", temp:"Ambient",              needs:"High OTR barrier, puncture resistance, fat/oil migration resistance"},
  powder:         {shelf:"12\u201324 months", temp:"Ambient",              needs:"High moisture barrier (hygroscopic), OTR barrier, seal integrity"},
  detergents:     {shelf:"24+ months",       temp:"Ambient",               needs:"Chemical resistance, high puncture resistance, opacity"},
  cosmetics:      {shelf:"12\u201336 months", temp:"Ambient",              needs:"Light barrier, moisture barrier, premium aesthetic, brand shelf appeal"},
  lidding:        {shelf:"Application dependent",temp:"Varies",            needs:"Controlled peel force (4\u20138 N/15mm), barrier matching tray material"},
};

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   DECISION RULES v4.0 â PDF-verified structures
   Each rule has: why_c (conventional rationale), why_u (sustainable rationale)
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
const RULES = [
  /* ââ RETORT ââââââââââââââââââââââââââââââââââââââââ */
  {id:"retort_std",app:["retort"],sMin:1,sMax:3,
    c:{s:"PET / NY / AL / RCPP",p:"PET/NY/AL/RCPP",l:[
      {m:"BOPET",r:"surface",f:"Print / heat resistance",t:"12\u00B5m"},
      {m:"BOPA",r:"core",f:"Puncture / thermoforming",t:"15\u201325\u00B5m"},
      {m:"AL_FOIL",r:"barrier",f:"Absolute O\u2082 + moisture barrier",t:"7\u20139\u00B5m"},
      {m:"RCPP",r:"sealant",f:"Retort sealant 121\u2013135\u00B0C",t:"70\u2013100\u00B5m"}]},
    u:{s:"Mono-PP / EVOH / RCPP",p:"PE/EVOH/PE",l:[
      {m:"BOPP",r:"surface",f:"Print carrier (PP-based)",t:"20\u00B5m"},
      {m:"EVOH",r:"barrier",f:"OTR barrier (<5% by weight)",t:"5\u00B5m"},
      {m:"RCPP",r:"sealant",f:"Retort sealant",t:"70\u2013100\u00B5m"}],
      n:"Emerging mono-PP retort. Post-retort EVOH barrier recovery must be validated."},
    why_c:"Aluminium foil provides zero-permeation barrier essential for 18\u201336 month ambient shelf life. Nylon delivers puncture and thermoforming resistance required to survive retort processing at 121\u2013135\u00B0C. RCPP sealant maintains seal integrity under autoclave pressure.",
    why_u:"Mono-PP structure with EVOH functional barrier (<5% by weight) enables recyclability while maintaining OTR barrier. EVOH is humidity-sensitive post-retort \u2014 barrier recovery time must be validated with accelerated shelf-life testing."},
  {id:"retort_sust",app:["retort"],sMin:4,sMax:5,
    c:{s:"PET / AL / RCPP",p:"PET/AL/RCPP",l:[
      {m:"BOPET",r:"surface",f:"Print / heat resistance",t:"12\u00B5m"},
      {m:"AL_FOIL",r:"barrier",f:"Absolute barrier",t:"7\u00B5m"},
      {m:"RCPP",r:"sealant",f:"Retort sealant",t:"70\u00B5m"}]},
    u:{s:"Mono-PP / EVOH / RCPP",p:"PE/EVOH/PE",l:[
      {m:"BOPP",r:"surface",f:"PP print carrier",t:"20\u00B5m"},
      {m:"EVOH",r:"barrier",f:"OTR barrier (<5%)",t:"3\u20135\u00B5m"},
      {m:"RCPP",r:"sealant",f:"Retort sealant",t:"70\u2013100\u00B5m"}],
      n:"Mono-PP retort is emerging technology. Post-retort EVOH performance must be validated."},
    why_c:"Simplified retort structure without nylon \u2014 AL foil still provides absolute barrier. Suitable where thermoforming is not required.",
    why_u:"At maximum sustainability priority, mono-PP with minimal EVOH is the best available recyclable retort solution. Commercial validation still limited."},

  /* ââ FROZEN FOOD âââââââââââââââââââââââââââââââââââ */
  {id:"frozen_std",app:["frozen_food"],sMin:1,sMax:3,
    c:{s:"NY / LLDPE",p:"NY/LLDPE",l:[
      {m:"BOPA",r:"surface",f:"Puncture resistance / print",t:"15\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Cold-chain sealant (\u221240\u00B0C)",t:"50\u201380\u00B5m"}]},
    u:{s:"MDO-PE / LLDPE (mono-PE)",p:"MDO-PE/LLDPE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web / stiffness",t:"25\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"High-toughness sealant",t:"60\u201380\u00B5m"}],
      n:"Mono-PE recyclable. Validate cold-chain flex crack and puncture performance."},
    why_c:"Nylon provides outstanding puncture and flex crack resistance critical for frozen distribution chains. LLDPE sealant maintains seal integrity at \u221240\u00B0C with excellent hot tack for VFFS/HFFS processing.",
    why_u:"MDO-PE replaces nylon as print web, enabling full mono-PE recyclability. Thicker LLDPE compensates for reduced puncture resistance. Validate via cold-chain distribution testing."},
  {id:"frozen_sust",app:["frozen_food"],sMin:4,sMax:5,
    c:{s:"PET / NY / LLDPE",p:"PET/NY/LLDPE",l:[
      {m:"BOPET",r:"surface",f:"Print / stiffness",t:"12\u00B5m"},
      {m:"BOPA",r:"core",f:"Puncture resistance",t:"15\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}]},
    u:{s:"MDO-PE / LLDPE (mono-PE)",p:"MDO-PE/LLDPE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web (mono-PE)",t:"25\u201330\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"High-toughness sealant",t:"70\u00B5m"}],
      n:"Full mono-PE. MDO-PE replaces both PET and nylon layers."},
    why_c:"Three-layer structure combines PET stiffness for print quality with nylon puncture resistance. Standard for premium frozen food packaging.",
    why_u:"Aggressive mono-PE approach. MDO-PE provides PET-like stiffness in a PE-based film. Higher sealant gauge compensates for loss of nylon toughness."},

  /* ââ SNACKS / CONFECTIONERY ââââââââââââââââââââââââ */
  {id:"snacks_std",app:["snacks","confectionery"],sMin:1,sMax:3,
    c:{s:"OPP / VMPET / CPP",p:"OPP/VMPET/CPP",l:[
      {m:"BOPP",r:"surface",f:"Print / gloss",t:"20\u00B5m"},
      {m:"VMPET",r:"barrier",f:"OTR + light barrier (OTR \u22642.5)",t:"12\u00B5m"},
      {m:"CPP",r:"sealant",f:"Sealant",t:"25\u201330\u00B5m"}]},
    u:{s:"BOPP / VMOPP / BOPP-HS (mono-PP)",p:"BOPP/VMOPP/BOPP-HS",l:[
      {m:"BOPP",r:"surface",f:"Print carrier",t:"20\u00B5m"},
      {m:"VMOPP",r:"barrier",f:"Metallised OTR + moisture barrier",t:"20\u00B5m"},
      {m:"BOPP_HS",r:"sealant",f:"Heat-seal BOPP",t:"25\u00B5m"}],
      n:"Mono-PP recyclable. Validate bond strength on metallised surface."},
    why_c:"VMPET provides excellent OTR barrier (2.5 cc/m\u00B2/day), light barrier, and moisture barrier in one layer. BOPP surface gives high gloss print quality. Standard for snack packaging.",
    why_u:"All-PP structure enables recycling in PP stream. VMOPP (metallised BOPP) provides adequate barrier for snack shelf-life though lower OTR performance than VMPET."},
  {id:"snacks_sust",app:["snacks","confectionery"],sMin:4,sMax:5,
    c:{s:"OPP / VMPET / CPP",p:"OPP/VMPET/CPP",l:[
      {m:"BOPP",r:"surface",f:"Print / gloss",t:"20\u00B5m"},
      {m:"VMPET",r:"barrier",f:"OTR + light barrier",t:"12\u00B5m"},
      {m:"CPP",r:"sealant",f:"Sealant",t:"25\u201330\u00B5m"}]},
    u:{s:"BOPP / VMCPP (mono-PP, 2-layer)",p:"BOPP/VMCPP",l:[
      {m:"BOPP",r:"surface",f:"Print carrier",t:"20\u00B5m"},
      {m:"VMCPP",r:"barrier",f:"Metallised barrier + sealant",t:"25\u00B5m"}],
      n:"Mono-PP. VMCPP dual-function: barrier and sealant in one layer."},
    why_c:"Same proven conventional structure as standard priority.",
    why_u:"Simplified 2-layer mono-PP. VMCPP (metallised CPP) combines barrier and sealant functions, reducing layer count while maintaining recyclability."},

  /* ââ PUFFED SNACKS âââââââââââââââââââââââââââââââââ */
  {id:"puffed_std",app:["puffed_snacks"],sMin:1,sMax:3,
    c:{s:"OPP / VMPET / PE",p:"PET/VMPET/PE",l:[
      {m:"BOPP",r:"surface",f:"Print / stiffness",t:"20\u00B5m"},
      {m:"VMPET",r:"barrier",f:"OTR + light barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"VFFS sealant / hot tack",t:"40\u00B5m"}]},
    u:{s:"BOPP / VMOPP / BOPP-HS (mono-PP)",p:"BOPP/VMOPP/BOPP-HS",l:[
      {m:"BOPP",r:"surface",f:"Print carrier",t:"20\u00B5m"},
      {m:"VMOPP",r:"barrier",f:"Metallised OTR barrier",t:"20\u00B5m"},
      {m:"BOPP_HS",r:"sealant",f:"PP sealant",t:"25\u00B5m"}],
      n:"Mono-PP recyclable. Validate N\u2082 retention with VMOPP barrier."},
    why_c:"N\u2082 flushed puffed snacks require reliable OTR barrier to maintain pillow pack inflation. VMPET provides OTR \u22642.5 cc/m\u00B2/day plus light barrier.",
    why_u:"Mono-PP with VMOPP provides OTR ~5 cc/m\u00B2/day \u2014 adequate for shorter shelf-life puffed snacks. Validate N\u2082 retention over target shelf-life."},
  {id:"puffed_sust",app:["puffed_snacks"],sMin:4,sMax:5,
    c:{s:"OPP / VMPET / PE",p:"PET/VMPET/PE",l:[
      {m:"BOPP",r:"surface",f:"Print / stiffness",t:"20\u00B5m"},
      {m:"VMPET",r:"barrier",f:"OTR + light barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"VFFS sealant",t:"40\u00B5m"}]},
    u:{s:"BOPP / VMCPP (mono-PP, 2-layer)",p:"BOPP/VMCPP",l:[
      {m:"BOPP",r:"surface",f:"Print carrier",t:"20\u00B5m"},
      {m:"VMCPP",r:"barrier",f:"Metallised barrier + seal",t:"25\u00B5m"}],
      n:"Mono-PP. VMCPP dual barrier and sealant."},
    why_c:"Same conventional benchmark.",
    why_u:"Simplified 2-layer mono-PP. VMCPP acts as both barrier and sealant, minimising material complexity."},

  /* ââ VACUUM ââââââââââââââââââââââââââââââââââââââââ */
  {id:"vacuum_std",app:["vacuum"],sMin:1,sMax:3,
    c:{s:"PET / NY / LLDPE",p:"PET/NY/LLDPE",l:[
      {m:"BOPET",r:"surface",f:"Print / stiffness",t:"12\u00B5m"},
      {m:"BOPA",r:"core",f:"Puncture / vacuum hold",t:"15\u201325\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Vacuum sealant",t:"50\u201380\u00B5m"}]},
    u:{s:"PE / EVOH / PE (mono-PE)",p:"PE/EVOH/PE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web (PE-based)",t:"25\u00B5m"},
      {m:"EVOH",r:"barrier",f:"OTR barrier (<5% wt)",t:"3\u20135\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}],
      n:"Mono-PE with EVOH. Reduced puncture vs nylon \u2014 validate for application."},
    why_c:"Nylon is essential for vacuum hold and puncture resistance in vacuum packaging. PET provides stiffness and print quality. Combined OTR ~41 cc/m\u00B2/day sufficient for chilled distribution.",
    why_u:"Mono-PE with EVOH functional barrier achieves OTR ~0.5 cc/m\u00B2/day while enabling PE-stream recycling. Loss of nylon means reduced puncture resistance \u2014 must be validated."},
  {id:"vacuum_sust",app:["vacuum"],sMin:4,sMax:5,
    c:{s:"PET / NY / LLDPE",p:"PET/NY/LLDPE",l:[
      {m:"BOPET",r:"surface",f:"Print / stiffness",t:"12\u00B5m"},
      {m:"BOPA",r:"core",f:"Puncture / vacuum hold",t:"15\u201325\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Vacuum sealant",t:"50\u201380\u00B5m"}]},
    u:{s:"MDO-PE / EVOH / PE (mono-PE)",p:"PE/EVOH/PE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web (mono-PE)",t:"25\u201330\u00B5m"},
      {m:"EVOH",r:"barrier",f:"OTR barrier (<5%)",t:"3\u20135\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"High-toughness PE",t:"60\u00B5m"}],
      n:"Full mono-PE recyclable. Validate vacuum hold without nylon."},
    why_c:"Same proven conventional benchmark for vacuum.",
    why_u:"Heavy-gauge mono-PE maximises recyclability. Thicker LLDPE sealant partially compensates for nylon removal."},

  /* ââ HOT-FILL / LIQUIDS ââââââââââââââââââââââââââââ */
  {id:"hotfill_std",app:["liquids_hotfill"],sMin:1,sMax:3,
    c:{s:"PET / AL / CPP",p:"PET/AL/CPP",l:[
      {m:"BOPET",r:"surface",f:"Print / heat resistance (220\u00B0C)",t:"12\u00B5m"},
      {m:"AL_FOIL",r:"barrier",f:"Absolute barrier",t:"7\u00B5m"},
      {m:"CPP",r:"sealant",f:"Hot-fill sealant (\u2264100\u00B0C)",t:"50\u201370\u00B5m"}]},
    u:{s:"MDO-PE / AlOx / PE",p:"MDO-PE/AlOx/PE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web (PE-based)",t:"25\u00B5m"},
      {m:"PET_ALOX",r:"barrier",f:"AlOx transparent barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}],
      n:"AlOx replaces AL foil. Transparent barrier. Validate heat tolerance for hot-fill."},
    why_c:"PET provides heat resistance up to 220\u00B0C as the outer layer. AL foil gives zero-permeation barrier. CPP sealant handles hot-fill temperatures up to 100\u00B0C.",
    why_u:"AlOx-coated PET provides transparent high barrier (OTR ~0.5) without aluminium, paired with PE sealant. Heat tolerance of AlOx layer during filling must be validated."},
  {id:"hotfill_sust",app:["liquids_hotfill"],sMin:4,sMax:5,
    c:{s:"PET / AL / CPP",p:"PET/AL/CPP",l:[
      {m:"BOPET",r:"surface",f:"Print / heat resistance",t:"12\u00B5m"},
      {m:"AL_FOIL",r:"barrier",f:"Absolute barrier",t:"7\u00B5m"},
      {m:"CPP",r:"sealant",f:"Hot-fill sealant",t:"50\u201370\u00B5m"}]},
    u:{s:"MDO-PE / SiOx / PE",p:"MDO-PE/SiOx/PE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web (mono-PE)",t:"25\u00B5m"},
      {m:"PET_SIOX",r:"barrier",f:"SiOx transparent barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}],
      n:"SiOx barrier is microwave-safe. Validate for hot-fill temperatures."},
    why_c:"Same proven conventional benchmark.",
    why_u:"SiOx coating offers excellent clarity and microwave compatibility. OTR ~0.3 cc/m\u00B2/day \u2014 superior OTR to AlOx. Crack-sensitive: validate for filling line handling."},

  /* ââ COFFEE / TEA ââââââââââââââââââââââââââââââââââ */
  {id:"coffee_std",app:["coffee_tea"],sMin:1,sMax:3,
    c:{s:"PET / VMPET / PE",p:"PET/VMPET/PE",l:[
      {m:"BOPET",r:"surface",f:"Print carrier",t:"12\u00B5m"},
      {m:"VMPET",r:"barrier",f:"OTR + aroma + light barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}]},
    u:{s:"BOPP / VMOPP / BOPP-HS (mono-PP)",p:"BOPP/VMOPP/BOPP-HS",l:[
      {m:"BOPP",r:"surface",f:"Print carrier (PP)",t:"20\u00B5m"},
      {m:"VMOPP",r:"barrier",f:"Met OTR + aroma barrier",t:"20\u00B5m"},
      {m:"BOPP_HS",r:"sealant",f:"Heat-seal BOPP",t:"25\u00B5m"}],
      n:"Mono-PP recyclable. Metallised barrier critical for aroma retention. Validate shelf-life."},
    why_c:"Coffee requires high OTR barrier plus aroma retention and light protection. VMPET delivers all three functions. Laminate OTR ~2.4 cc/m\u00B2/day protects volatile aromatics.",
    why_u:"Mono-PP with metallised BOPP barrier. VMOPP provides OTR ~5 cc/m\u00B2/day with aroma and light barrier. Full PP recyclability. Verify extended shelf-life aroma retention vs VMPET benchmark."},
  {id:"coffee_sust",app:["coffee_tea"],sMin:4,sMax:5,
    c:{s:"PET / AL / PE",p:"PET/AL/PE",l:[
      {m:"BOPET",r:"surface",f:"Print carrier",t:"12\u00B5m"},
      {m:"AL_FOIL",r:"barrier",f:"Absolute aroma + OTR barrier",t:"7\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}]},
    u:{s:"BOPP / VMOPP / BOPP-HS (mono-PP)",p:"BOPP/VMOPP/BOPP-HS",l:[
      {m:"BOPP",r:"surface",f:"PP print carrier",t:"20\u00B5m"},
      {m:"VMOPP",r:"barrier",f:"Metallised aroma + OTR barrier",t:"20\u00B5m"},
      {m:"BOPP_HS",r:"sealant",f:"PP sealant",t:"25\u00B5m"}],
      n:"Mono-PP. Metallised PP provides best recyclable aroma barrier solution."},
    why_c:"Premium coffee uses AL foil for absolute aroma and OTR barrier. This is the conventional gold standard.",
    why_u:"Mono-PP with VMOPP is the industry-recommended sustainable alternative for coffee. Metallised PP preserves aroma function while enabling full recyclability."},

  /* ââ PET FOOD ââââââââââââââââââââââââââââââââââââââ */
  {id:"petfood_std",app:["pet_food"],sMin:1,sMax:3,
    c:{s:"PET / VMPET / PE",p:"PET/VMPET/PE",l:[
      {m:"BOPET",r:"surface",f:"Print / puncture",t:"12\u00B5m"},
      {m:"VMPET",r:"barrier",f:"OTR + light + aroma barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Tough sealant (70\u00B5m)",t:"70\u00B5m"}]},
    u:{s:"MDO-PE / EVOH / PE (mono-PE)",p:"PE/EVOH/PE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web",t:"25\u00B5m"},
      {m:"EVOH",r:"barrier",f:"OTR barrier (<5% wt)",t:"5\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Tough sealant",t:"70\u00B5m"}],
      n:"Mono-PE with EVOH. Validate EVOH for fat/oil migration resistance."},
    why_c:"Pet food requires high OTR barrier, light protection, and thick sealant for heavy product. VMPET provides multi-function barrier. Thick LLDPE handles puncture from kibble and bones.",
    why_u:"Mono-PE with EVOH achieves OTR ~0.5 cc/m\u00B2/day. Thick PE sealant maintains puncture resistance. EVOH fat/oil resistance must be validated for greasy pet food products."},
  {id:"petfood_sust",app:["pet_food"],sMin:4,sMax:5,
    c:{s:"PET / AL / PE",p:"PET/AL/PE",l:[
      {m:"BOPET",r:"surface",f:"Print / puncture",t:"12\u00B5m"},
      {m:"AL_FOIL",r:"barrier",f:"Absolute barrier",t:"7\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Tough sealant",t:"70\u00B5m"}]},
    u:{s:"MDO-PE / AlOx / PE",p:"MDO-PE/AlOx/PE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web (mono-PE)",t:"25\u00B5m"},
      {m:"PET_ALOX",r:"barrier",f:"AlOx transparent barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Tough sealant",t:"70\u00B5m"}],
      n:"AlOx replaces AL foil. Validate barrier for fat/oil products."},
    why_c:"AL foil provides absolute barrier for extended shelf-life pet food.",
    why_u:"AlOx-coated PET provides transparent high barrier without aluminium. Recyclable profile. Must validate fat/oil migration resistance for pet food shelf-life."},

  /* ââ POWDER ââââââââââââââââââââââââââââââââââââââââ */
  {id:"powder_std",app:["powder"],sMin:1,sMax:3,
    c:{s:"PET / VMPET / PE",p:"PET/VMPET/PE",l:[
      {m:"BOPET",r:"surface",f:"Print carrier",t:"12\u00B5m"},
      {m:"VMPET",r:"barrier",f:"Moisture + OTR barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant (WVTR \u22641.0)",t:"50\u00B5m"}]},
    u:{s:"MDO-PE / SiOx / PE",p:"MDO-PE/SiOx/PE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web",t:"25\u00B5m"},
      {m:"PET_SIOX",r:"barrier",f:"SiOx transparent moisture barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}],
      n:"SiOx excels at moisture barrier. Validate for hygroscopic powder products."},
    why_c:"Hygroscopic powders require excellent moisture barrier. VMPET delivers WVTR ~1.0 g/m\u00B2/day combined with PE sealant (WVTR ~1.0). Laminate WVTR ~0.47 g/m\u00B2/day.",
    why_u:"SiOx coating provides WVTR ~1.0 g/m\u00B2/day with transparency. Laminate WVTR ~0.33 g/m\u00B2/day \u2014 actually superior moisture barrier to conventional. Excellent for powder products."},
  {id:"powder_sust",app:["powder"],sMin:4,sMax:5,
    c:{s:"PET / AL / PE",p:"PET/AL/PE",l:[
      {m:"BOPET",r:"surface",f:"Print carrier",t:"12\u00B5m"},
      {m:"AL_FOIL",r:"barrier",f:"Absolute moisture barrier",t:"7\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}]},
    u:{s:"MDO-PE / AlOx / PE",p:"MDO-PE/AlOx/PE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web (mono-PE)",t:"25\u00B5m"},
      {m:"PET_ALOX",r:"barrier",f:"AlOx high barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}],
      n:"AlOx replaces AL. Validate moisture protection for hygroscopic powders."},
    why_c:"AL foil provides zero-permeation moisture barrier for maximum protection.",
    why_u:"AlOx coating provides WVTR ~1.8 g/m\u00B2/day, laminate WVTR ~0.39. Excellent moisture protection without aluminium. Recyclable PE structure."},

  /* ââ DETERGENTS ââââââââââââââââââââââââââââââââââââ */
  {id:"detergents_std",app:["detergents"],sMin:1,sMax:3,
    c:{s:"PET / NY / LLDPE",p:"PET/NY/LLDPE",l:[
      {m:"BOPET",r:"surface",f:"Print / chemical resistance",t:"12\u00B5m"},
      {m:"BOPA",r:"core",f:"Puncture / chemical barrier",t:"15\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Heavy-duty sealant",t:"80\u2013100\u00B5m"}]},
    u:{s:"MDO-PE / LLDPE (mono-PE)",p:"MDO-PE/LLDPE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web / stiffness",t:"30\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Heavy-duty sealant",t:"80\u2013100\u00B5m"}],
      n:"Full mono-PE recyclable. Low barrier requirement. Validate chemical compatibility."},
    why_c:"Nylon provides chemical resistance and puncture protection essential for detergent and chemical pouches. PET surface resists chemical attack. Heavy-gauge LLDPE sealant for durability.",
    why_u:"Detergents require minimal gas/moisture barrier. Mono-PE heavy-duty structure is sufficient. MDO-PE provides stiffness. Validate chemical resistance of PE print web with specific product."},
  {id:"detergents_sust",app:["detergents"],sMin:4,sMax:5,
    c:{s:"PET / NY / LLDPE",p:"PET/NY/LLDPE",l:[
      {m:"BOPET",r:"surface",f:"Print / chemical resistance",t:"12\u00B5m"},
      {m:"BOPA",r:"core",f:"Puncture / chemical barrier",t:"15\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Heavy-duty sealant",t:"80\u2013100\u00B5m"}]},
    u:{s:"MDO-PE / LLDPE + PCR",p:"MDO-PE/LLDPE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web (mono-PE)",t:"30\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"PCR-PE sealant",t:"80\u2013100\u00B5m"}],
      n:"Mono-PE with PCR sealant. Maximum recyclability for low-barrier application."},
    why_c:"Same conventional benchmark.",
    why_u:"At maximum sustainability, incorporate post-consumer recycled (PCR) PE in sealant layer. Detergent\u2019s low barrier requirement makes it ideal for PCR adoption."},

  /* ââ COSMETICS âââââââââââââââââââââââââââââââââââââ */
  {id:"cosmetics_std",app:["cosmetics"],sMin:1,sMax:3,
    c:{s:"OPP / VMPET / PE",p:"PET/VMPET/PE",l:[
      {m:"BOPP",r:"surface",f:"Print / gloss / premium",t:"20\u00B5m"},
      {m:"VMPET",r:"barrier",f:"Light + moisture barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}]},
    u:{s:"BOPP / VMOPP / BOPP-HS (mono-PP)",p:"BOPP/VMOPP/BOPP-HS",l:[
      {m:"BOPP",r:"surface",f:"Print carrier (PP)",t:"20\u00B5m"},
      {m:"VMOPP",r:"barrier",f:"Met light + barrier",t:"20\u00B5m"},
      {m:"BOPP_HS",r:"sealant",f:"PP sealant",t:"25\u00B5m"}],
      n:"Mono-PP recyclable. Metallised appearance maintained for premium aesthetic."},
    why_c:"Cosmetics packaging prioritises shelf appeal. BOPP gives high gloss print quality. VMPET provides light and moisture barrier to protect active ingredients. Metallised look conveys premium positioning.",
    why_u:"Mono-PP preserves the premium metallised aesthetic through VMOPP while enabling full recyclability. Matt or gloss BOPP surface for brand differentiation."},
  {id:"cosmetics_sust",app:["cosmetics"],sMin:4,sMax:5,
    c:{s:"OPP / VMPET / PE",p:"PET/VMPET/PE",l:[
      {m:"BOPP",r:"surface",f:"Print / gloss / premium",t:"20\u00B5m"},
      {m:"VMPET",r:"barrier",f:"Light + moisture barrier",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Sealant",t:"50\u00B5m"}]},
    u:{s:"BOPP / VMOPP / BOPP-HS (mono-PP)",p:"BOPP/VMOPP/BOPP-HS",l:[
      {m:"BOPP",r:"surface",f:"Matt/gloss PP print",t:"20\u00B5m"},
      {m:"VMOPP",r:"barrier",f:"Met premium finish + barrier",t:"20\u00B5m"},
      {m:"BOPP_HS",r:"sealant",f:"PP sealant",t:"25\u00B5m"}],
      n:"Full mono-PP. Premium appearance maintained."},
    why_c:"Same conventional benchmark.",
    why_u:"Mono-PP with premium metallised finish. Ideal for brands with strong sustainability positioning. Full PP-stream recyclability."},

  /* ââ LIDDING / PEELABLE ââââââââââââââââââââââââââââ */
  {id:"lidding_std",app:["lidding"],sMin:1,sMax:3,
    c:{s:"PET / PE (peelable)",p:"PET/PE",l:[
      {m:"BOPET",r:"surface",f:"Print / stiffness",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Peelable sealant (4\u20138 N/15mm)",t:"30\u201350\u00B5m"}]},
    u:{s:"Mono-PE peelable lid",p:"MDO-PE/LLDPE",l:[
      {m:"MDO_PE",r:"surface",f:"Print web (PE-based)",t:"25\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Peelable PE sealant",t:"30\u201340\u00B5m"}],
      n:"Mono-PE peelable. Match sealant to tray material for recyclability."},
    why_c:"PET surface provides stiffness for die-cutting and print quality. Peelable LLDPE sealant delivers controlled peel force (4\u20138 N/15mm) for consumer convenience.",
    why_u:"Mono-PE lid for PE trays enables full mono-material recyclability. Peel force must be matched to specific tray substrate. PE-to-PE peel system."},
  {id:"lidding_sust",app:["lidding"],sMin:4,sMax:5,
    c:{s:"PET / PE (peelable)",p:"PET/PE",l:[
      {m:"BOPET",r:"surface",f:"Print / stiffness",t:"12\u00B5m"},
      {m:"LLDPE",r:"sealant",f:"Peelable sealant",t:"30\u201350\u00B5m"}]},
    u:{s:"Mono-PP peelable lid",p:"BOPP/BOPP-HS",l:[
      {m:"BOPP",r:"surface",f:"PP print carrier",t:"20\u00B5m"},
      {m:"CPP",r:"sealant",f:"Peelable PP sealant",t:"25\u201330\u00B5m"}],
      n:"Mono-PP peelable for PP trays. Peel force calibration critical."},
    why_c:"Same conventional benchmark.",
    why_u:"Mono-PP lid for PP trays. PP-to-PP peel system enables full PP-stream recyclability. Peel force calibration is critical for consumer experience."},
];

/* ââ RISK NOTES ââââââââââââââââââââââââââââââââââââââââââââââ */
const RN = {
  BOPA:["Hygroscopic: store below 60% RH, condition before lamination","Excellent flex crack resistance; OTR 40\u2013100 cc/m\u00B2/day but WVTR 20\u201340 g/m\u00B2/day"],
  AL_FOIL:["Flex crack risk below 9\u00B5m causing pinhole formation","Zero permeation (OTR ~0, WVTR ~0) but not recyclable in laminate form"],
  EVOH:["OTR <1 dry but degrades to 10\u2013100 cc/m\u00B2/day above 75% RH","Must be sandwiched between PE or PP moisture barrier layers","Keep below 5\u20136% by weight for recyclability claims"],
  VMPET:["OTR 0.5\u20135 cc/m\u00B2/day, WVTR 0.5\u20131.5 g/m\u00B2/day","Bond strength to metallised surface is critical \u2013 delamination risk"],
  VMOPP:["OTR 1\u201310 cc/m\u00B2/day, WVTR 0.8\u20132 g/m\u00B2/day","Metallisation adhesion lower than VMPET \u2013 validate bond strength"],
  RCPP:["Retort-grade: validate seal integrity at 121\u2013135\u00B0C","Seal initiation temp higher than standard CPP"],
  MDO_PE:["Machine direction orientation gives PET-like stiffness in PE","Key enabler for mono-PE recyclable structures","OTR ~3500 cc/m\u00B2/day, WVTR ~1.0 g/m\u00B2/day"],
  LLDPE:["Seal initiation: 105\u2013135\u00B0C, excellent hot tack for VFFS/HFFS","WVTR 0.5\u20132 g/m\u00B2/day \u2014 excellent moisture barrier"],
  PET_ALOX:["OTR 0.1\u20131, WVTR 0.5\u20133 \u2014 transparent ceramic barrier","Flex-sensitive: avoid sharp creasing during converting"],
  PET_SIOX:["OTR 0.05\u20130.5, WVTR 0.3\u20132 \u2014 microwave compatible","Transparent, excellent clarity, crack-sensitive"],
  CPP:["Hot-fill compatible up to ~100\u00B0C","OTR 2000\u20135000, WVTR 0.6\u20132 g/m\u00B2/day"],
  BOPP:["OTR 1200\u20132500, WVTR 3\u20138 g/m\u00B2/day","Excellent clarity and print surface, weak moisture barrier"],
  BOPET:["OTR 80\u2013120, WVTR 6\u201310 g/m\u00B2/day","Excellent heat resistance (220\u00B0C), dimensional stability"],
};

/* ââ CONFIG ââââââââââââââââââââââââââââââââââââââââââââââââââ */
const APPS = [
  {id:"frozen_food",l:"Frozen Food",i:"\u2744\uFE0F"},
  {id:"snacks",l:"Snacks / Biscuits",i:"\uD83C\uDF6A"},
  {id:"puffed_snacks",l:"Puffed Snacks",i:"\uD83E\uDDC0"},
  {id:"vacuum",l:"Vacuum Pack",i:"\uD83E\uDED9"},
  {id:"liquids_hotfill",l:"Liquids / Hot-Fill",i:"\uD83E\uDDF4"},
  {id:"retort",l:"Retort 121\u2013135\u00B0C",i:"\uD83D\uDD25"},
  {id:"coffee_tea",l:"Coffee / Tea",i:"\u2615"},
  {id:"pet_food",l:"Pet Food",i:"\uD83D\uDC3E"},
  {id:"powder",l:"Powder Products",i:"\uD83E\uDDC2"},
  {id:"detergents",l:"Detergents & Chem",i:"\uD83E\uDDF4"},
  {id:"cosmetics",l:"Cosmetics",i:"\uD83D\uDC84"},
  {id:"confectionery",l:"Confectionery",i:"\uD83C\uDF6C"},
  {id:"lidding",l:"Lidding / Peelable",i:"\uD83D\uDCE6"},
];
const BOPT = [{id:"low",l:"Low"},{id:"medium",l:"Medium"},{id:"high_otr",l:"High OTR"},{id:"high_moisture",l:"High WVTR"},{id:"light",l:"Light-Sensitive"},{id:"aroma",l:"Aroma Critical"}];
const MOPT = [{id:"vacuum",l:"Vacuum"},{id:"n2",l:"N\u2082 Flush"},{id:"cold",l:"Cold Chain"},{id:"puncture",l:"High Puncture"},{id:"retort",l:"Retort"},{id:"hffs",l:"HFFS"},{id:"vffs",l:"VFFS"},{id:"peel",l:"Peelable Seal"}];
const ROPT = [{id:"no_al",l:"Avoid Aluminium"},{id:"no_ny",l:"Avoid Nylon"},{id:"pe_mono",l:"Prefer PE Mono"},{id:"pp_mono",l:"Prefer PP Mono"},{id:"pcr",l:"PCR Required"}];

const RC = {surface:B.blue, barrier:B.greenLight, core:B.coreFill, sealant:B.sealant};
const RL = {surface:"Surface / Print", barrier:"Barrier", core:"Core", sealant:"Sealant"};

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   ENGINE v4.0 â ALL inputs connected, PDF-verified data
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */

function resolve(app, sust, barriers, mech, rest) {
  let rule = RULES.find(r => r.app.includes(app) && sust >= r.sMin && sust <= r.sMax);
  if (!rule) rule = RULES.find(r => r.app.includes(app));
  if (!rule) rule = RULES[0];
  let result = JSON.parse(JSON.stringify(rule));
  const warnings = [];

  /* Restriction overrides */
  if (rest.includes("no_al")) {
    const sw = l => l.map(x => x.m === "AL_FOIL" ? {...x, m:"PET_ALOX", f:"AlOx barrier (replaces AL)"} : x);
    result.c.l = sw(result.c.l); result.u.l = sw(result.u.l);
    if (rule.c.l.some(x=>x.m==="AL_FOIL")||rule.u.l.some(x=>x.m==="AL_FOIL"))
      warnings.push("\u26A0 Aluminium replaced with AlOx coating per restriction. AlOx OTR ~0.5 vs AL ~0. Validate barrier equivalence for shelf-life.");
  }
  if (rest.includes("no_ny")) {
    const sw = l => l.map(x => x.m === "BOPA" ? {...x, m:"MDO_PE", r:"surface", f:"MDO-PE (replaces NY)"} : x);
    result.c.l = sw(result.c.l); result.u.l = sw(result.u.l);
    if (rule.c.l.some(x=>x.m==="BOPA")||rule.u.l.some(x=>x.m==="BOPA"))
      warnings.push("\u26A0 Nylon replaced with MDO-PE. Puncture resistance reduced ~30%. Vacuum hold performance must be revalidated.");
  }
  if (rest.includes("pe_mono")) warnings.push("PE mono-material preference active. Sustainable alternative prioritises PE-based structures.");
  if (rest.includes("pp_mono")) warnings.push("PP mono-material preference active. Sustainable alternative prioritises PP-based structures.");
  if (rest.includes("pcr")) warnings.push("PCR content required. Specify PCR-PE or PCR-PP sealant layers with supplier. Mass balance or mechanical recycling certification needed.");

  /* Barrier requirement checks */
  const hasBarrier = (ls, ms) => ls.some(l => ms.includes(l.m));
  const highBarrierMats = ["AL_FOIL","VMPET","EVOH","PET_ALOX","PET_SIOX","VMOPP","VMCPP"];
  if (barriers.includes("high_otr") && !hasBarrier(result.c.l, highBarrierMats))
    warnings.push("High OTR barrier selected but structure lacks dedicated barrier layer. Laminate OTR may exceed target.");
  if (barriers.includes("high_moisture") && !hasBarrier(result.c.l, ["AL_FOIL","VMPET","VMOPP","VMCPP","PET_ALOX","PET_SIOX"]))
    warnings.push("High WVTR barrier selected. Note: PE family has excellent inherent WVTR (0.5\u20132 g/m\u00B2/day).");
  if (barriers.includes("aroma") && !hasBarrier(result.c.l, ["AL_FOIL","VMPET","PET_ALOX","VMOPP"]))
    warnings.push("Aroma-critical application. Metallised or AL barrier layer recommended for volatile aroma retention.");
  if (barriers.includes("light") && !hasBarrier(result.c.l, ["AL_FOIL","VMPET","VMOPP","VMCPP"]))
    warnings.push("Light-sensitive product. Metallised or opaque barrier layer needed to prevent photo-oxidation.");

  /* Mechanical checks */
  if (mech.includes("retort") && !app.includes("retort"))
    warnings.push("Retort processing: all layers must tolerate 121\u2013135\u00B0C. Use RCPP sealant (seal initiation 140\u2013170\u00B0C).");
  if (mech.includes("vacuum") && app !== "vacuum")
    warnings.push("Vacuum pack: nylon (OTR ~70) or high-puncture PE essential for vacuum hold and puncture resistance.");
  if (mech.includes("cold")) warnings.push("Cold chain: validate seal integrity at \u221240\u00B0C. LLDPE preferred (seal initiation 105\u2013135\u00B0C).");
  if (mech.includes("puncture") && !hasBarrier(result.c.l, ["BOPA","MDO_PE","BOPE"]))
    warnings.push("High puncture required but no puncture-resistant layer in structure.");
  if (mech.includes("n2")) warnings.push("N\u2082 flush: OTR barrier must maintain MAP atmosphere. Target laminate OTR <5 cc/m\u00B2/day for 6+ month shelf-life.");
  if (mech.includes("hffs")) warnings.push("HFFS: sealant needs low seal initiation temp and good hot tack. LLDPE preferred (105\u2013135\u00B0C).");
  if (mech.includes("vffs")) warnings.push("VFFS: film stiffness and COF critical for machine runnability. MDO-PE or PET surface recommended.");
  if (mech.includes("peel") && app !== "lidding") warnings.push("Peelable seal: match peel force to application (4\u20138 N/15mm typical). Verify cohesive vs adhesive peel mode.");

  /* Rebuild barrier profile keys after any swaps */
  const bp = ls => ls.map(l => (MAT[l.m]||{a:l.m}).a).join("/");
  result.c.p = bp(result.c.l); result.u.p = bp(result.u.l);
  result.warnings = warnings;
  return result;
}

function getRecyc(layers) {
  const fams = new Set(layers.map(l => {
    const m = MAT[l.m]; if (!m) return "X";
    if (m.fam === "EVOH") return "__E__";
    if (["OPP","PP"].includes(m.fam)) return "PP";
    return m.fam === "PE" ? "PE" : m.fam === "PET" ? "PET" : m.fam;
  }));
  const main = new Set([...fams].filter(f => f !== "__E__"));
  if (main.size === 1 && !fams.has("__E__")) return {s:95,l:"High",mono:true};
  if (main.size === 1 && fams.has("__E__")) return {s:80,l:"Mod-High",mono:false};
  if (fams.has("AL")) return {s:25,l:"Low",mono:false};
  if (fams.has("PA")) return {s:40,l:"Mod-Low",mono:false};
  return {s:55,l:"Moderate",mono:false};
}

/* âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   COMPONENTS
   âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
const CS = {background:B.card,borderRadius:12,border:`1px solid ${B.light}`,boxShadow:"0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)"};

function Tog({active,onClick,children}){
  return <button onClick={onClick} style={{border:`1.5px solid ${active?B.green:"transparent"}`,background:active?"rgba(200,214,54,0.12)":B.surface,
    color:active?B.charcoal:B.mid,padding:"6px 12px",borderRadius:8,fontSize:11.5,fontWeight:active?600:500,cursor:"pointer",
    transition:"all 0.2s",fontFamily:"inherit",lineHeight:1.3,letterSpacing:0.1}}>{children}</button>;
}

function Sec({letter,children}){
  return <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,marginTop:22}}>
    <span style={{width:22,height:22,borderRadius:6,background:B.charcoal,color:B.white,fontSize:10,fontWeight:700,
      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,letterSpacing:0.5}}>{letter}</span>
    <span style={{fontSize:10.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:B.charcoal}}>{children}</span>
  </div>;
}

function Stack({layers,title,type}){
  const isC = type === "conv";
  const ac = isC ? B.blue : B.green;
  const abg = isC ? "rgba(109,201,201,0.06)" : "rgba(200,214,54,0.06)";
  return <div style={{...CS,padding:16,borderTop:`3px solid ${ac}`}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <span style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:ac}}>{title}</span>
      <span style={{fontSize:8,fontWeight:600,padding:"3px 8px",borderRadius:20,background:abg,color:ac,letterSpacing:0.5}}>
        {layers.length} LAYER{layers.length!==1?"S":""}
      </span>
    </div>
    <div style={{fontSize:15,fontWeight:700,color:B.black,marginBottom:14,letterSpacing:-0.2}}>
      {layers.map(l=>(MAT[l.m]||{a:l.m}).a).join("  /  ")}
    </div>
    <div style={{borderRadius:8,overflow:"hidden",border:`1px solid ${B.light}`}}>
      {layers.map((layer,i)=>{
        const rc = RC[layer.r]||"#999";
        return <div key={i} style={{display:"flex",minHeight:40,borderBottom:i<layers.length-1?`1px solid ${B.light}`:"none"}}>
          <div style={{width:6,flexShrink:0,background:rc}} />
          <div style={{flex:1,padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",background:`${rc}08`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:12.5,fontWeight:700,color:B.black,minWidth:60}}>{(MAT[layer.m]||{a:layer.m}).a}</span>
              <span style={{fontSize:10,color:B.mid,fontWeight:400}}>{layer.f}</span>
            </div>
            <span style={{fontSize:10,color:B.mid,fontWeight:500,flexShrink:0,background:B.surface,padding:"2px 8px",borderRadius:4}}>{layer.t}</span>
          </div>
        </div>;
      })}
    </div>
    <div style={{display:"flex",gap:16,marginTop:12}}>
      {Object.entries(RL).filter(([k])=>layers.some(l=>l.r===k)).map(([k,v])=>
        <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:10,height:10,borderRadius:3,background:RC[k]}} />
          <span style={{fontSize:9,color:B.mid,fontWeight:500}}>{v}</span>
        </div>)}
    </div>
  </div>;
}

function Radial({score,label,mono}){
  const r=38,c=2*Math.PI*r,off=c-(score/100)*c;
  const sc=score>=80?B.green:score>=55?B.coreFill:B.red;
  const bg=score>=80?"rgba(200,214,54,0.08)":score>=55?"rgba(232,146,63,0.08)":"rgba(217,85,85,0.08)";
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 16px",borderRadius:12,background:bg}}>
    <svg width="92" height="92" viewBox="0 0 92 92">
      <circle cx="46" cy="46" r={r} fill="none" stroke={B.light} strokeWidth="5" />
      <circle cx="46" cy="46" r={r} fill="none" stroke={sc} strokeWidth="5" strokeDasharray={c} strokeDashoffset={off}
        strokeLinecap="round" transform="rotate(-90 46 46)" style={{transition:"stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)"}} />
      <text x="46" y="42" textAnchor="middle" style={{fontSize:22,fontWeight:800}} fill={B.black}>{score}</text>
      <text x="46" y="57" textAnchor="middle" style={{fontSize:8.5,fontWeight:600}} fill={B.mid}>{label}</text>
    </svg>
    <div style={{marginTop:6,fontSize:8,fontWeight:700,padding:"3px 10px",borderRadius:20,
      background:mono?"rgba(200,214,54,0.2)":B.light,color:mono?"#5a6108":B.mid,letterSpacing:0.8,textTransform:"uppercase"}}>
      {mono?"Mono-Material":"Multi-Material"}
    </div>
  </div>;
}

function BChart({cp,sp}){
  const cb=LB[cp]||{otr:100,wvtr:5},sb=LB[sp]||{otr:500,wvtr:3};
  const refs=BREFS.map(r=>({x:Math.log10(Math.max(r.otr,0.001)),y:Math.log10(Math.max(r.wvtr,0.001)),label:r.l,color:r.c}));
  const recs=[
    {x:Math.log10(Math.max(cb.otr,0.001)),y:Math.log10(Math.max(cb.wvtr,0.001)),label:"Conventional",color:B.blue},
    {x:Math.log10(Math.max(sb.otr,0.001)),y:Math.log10(Math.max(sb.wvtr,0.001)),label:"Sustainable",color:B.green},
  ];
  const fmt=v=>{const n=Math.pow(10,v);if(n>=1000)return(n/1000).toFixed(0)+"k";if(n>=1)return n.toFixed(0);if(n>=0.01)return n.toFixed(2);return"<0.01";};
  const CTip=({active,payload})=>{
    if(active&&payload?.length){const d=payload[0].payload;
      return <div style={{background:B.charcoal,color:B.white,padding:"8px 12px",borderRadius:8,fontSize:10,boxShadow:"0 4px 12px rgba(0,0,0,0.15)",lineHeight:1.6}}>
        <div style={{fontWeight:700,marginBottom:2}}>{d.label}</div>
        <div>OTR: {fmt(d.x)} cc/m{"\u00B2"}/day</div><div>WVTR: {fmt(d.y)} g/m{"\u00B2"}/day</div>
      </div>;}return null;};
  return <div style={{width:"100%",height:220}}>
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{top:10,right:14,bottom:30,left:10}}>
        <CartesianGrid stroke={B.light} strokeDasharray="3 3" />
        <XAxis type="number" dataKey="x" domain={[-3,4.2]} tickFormatter={fmt}
          tick={{fontSize:9,fill:B.mid,fontWeight:500}}
          label={{value:"OTR (cc/m\u00B2/day) \u2192 log scale",position:"bottom",offset:12,style:{fontSize:9,fill:B.mid,fontWeight:500}}} stroke={B.light} />
        <YAxis type="number" dataKey="y" domain={[-3,2.5]} tickFormatter={fmt}
          tick={{fontSize:9,fill:B.mid,fontWeight:500}}
          label={{value:"WVTR (g/m\u00B2/day)",angle:-90,position:"insideLeft",offset:2,style:{fontSize:9,fill:B.mid,fontWeight:500}}} stroke={B.light} />
        <Tooltip content={<CTip />} />
        <Scatter data={refs}>{refs.map((e,i)=><Cell key={i} fill={e.color} r={5} opacity={0.4} />)}</Scatter>
        <Scatter data={recs} shape="diamond">{recs.map((e,i)=><Cell key={i} fill={e.color} r={10} stroke={B.charcoal} strokeWidth={2} />)}</Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  </div>;
}

function Risks({layers,notes,warnings}){
  const [open,setOpen]=useState(true);
  const allM=[...new Set(layers.map(l=>l.m))];
  const ns=allM.flatMap(m=>(RN[m]||[]).map(n=>({mat:(MAT[m]||{a:m}).a,note:n})));
  if(!ns.length&&!notes&&(!warnings||!warnings.length))return null;
  return <div style={{...CS,overflow:"hidden"}}>
    <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"12px 16px",background:B.card,border:"none",cursor:"pointer",fontFamily:"inherit",
      borderBottom:open?`1px solid ${B.light}`:"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:6,height:6,borderRadius:3,background:B.coreFill}} />
        <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:B.charcoal}}>Processing & Risk Notes</span>
        {warnings&&warnings.length>0&&<span style={{fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:10,background:"rgba(217,85,85,0.12)",color:B.red}}>
          {warnings.length} ALERT{warnings.length>1?"S":""}
        </span>}
      </div>
      <span style={{fontSize:11,color:B.mid,fontWeight:500,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}>{"\u25BC"}</span>
    </button>
    {open&&<div style={{padding:"12px 16px"}}>
      {warnings&&warnings.length>0&&<div style={{marginBottom:12}}>
        {warnings.map((w,i)=><div key={i} style={{fontSize:10.5,color:"#8B4513",background:"rgba(217,85,85,0.06)",
          padding:"8px 12px",borderRadius:8,border:"1px solid rgba(217,85,85,0.15)",marginBottom:6,lineHeight:1.6,
          display:"flex",gap:8,alignItems:"flex-start"}}>
          <span style={{flexShrink:0,fontWeight:800,color:B.red,fontSize:11}}>{"\u26A0"}</span><span>{w}</span>
        </div>)}
      </div>}
      {notes&&<div style={{fontSize:10.5,color:B.charcoal,background:"rgba(200,214,54,0.08)",padding:"10px 14px",borderRadius:8,
        border:"1px solid rgba(200,214,54,0.25)",marginBottom:10,lineHeight:1.6}}>
        <span style={{fontWeight:700,color:B.green}}>CTL Note: </span>{notes}
      </div>}
      <div style={{display:"grid",gap:6}}>
        {ns.map((n,i)=><div key={i} style={{fontSize:10,color:B.mid,display:"flex",gap:10,lineHeight:1.5}}>
          <span style={{fontWeight:700,color:B.charcoal,flexShrink:0,width:56,fontSize:9.5}}>{n.mat}</span><span>{n.note}</span>
        </div>)}
      </div>
    </div>}
  </div>;
}

/* ââ WHY THIS RECOMMENDATION ââââââââââââââââââââââââ */
function WhySection({result, app, cR, sR}){
  const meta = APP_META[app];
  if(!meta) return null;
  return <div style={{...CS,padding:18,marginTop:16}}>
    <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:B.charcoal,marginBottom:14,
      display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:6,height:6,borderRadius:3,background:B.green}} />
      Why This Recommendation
    </div>
    <div style={{fontSize:10,color:B.mid,marginBottom:14,lineHeight:1.6,padding:"8px 12px",borderRadius:8,background:B.surface}}>
      <span style={{fontWeight:700,color:B.charcoal}}>Application Context: </span>
      Shelf life {meta.shelf} at {meta.temp}. Key requirements: {meta.needs}.
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <div style={{padding:"10px 14px",borderRadius:8,borderLeft:`3px solid ${B.blue}`,background:"rgba(109,201,201,0.04)"}}>
        <div style={{fontSize:9,fontWeight:700,color:B.blue,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Conventional Rationale</div>
        <div style={{fontSize:10,color:B.charcoal,lineHeight:1.7}}>{result.why_c}</div>
        <div style={{fontSize:9,color:B.mid,marginTop:8}}>Recyclability: {cR.l} ({cR.s}/100) {"\u2014"} {cR.mono?"Mono-material":"Multi-material"}</div>
      </div>
      <div style={{padding:"10px 14px",borderRadius:8,borderLeft:`3px solid ${B.green}`,background:"rgba(200,214,54,0.04)"}}>
        <div style={{fontSize:9,fontWeight:700,color:B.green,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Sustainable Rationale</div>
        <div style={{fontSize:10,color:B.charcoal,lineHeight:1.7}}>{result.why_u}</div>
        <div style={{fontSize:9,color:B.mid,marginTop:8}}>Recyclability: {sR.l} ({sR.s}/100) {"\u2014"} {sR.mono?"Mono-material":"Multi-material"}</div>
      </div>
    </div>
  </div>;
}

/* âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   MAIN DASHBOARD
   âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
export default function Dashboard(){
  const [app,setApp]=useState("snacks");
  const [barriers,setBarriers]=useState(["medium"]);
  const [mech,setMech]=useState([]);
  const [sust,setSust]=useState(3);
  const [rest,setRest]=useState([]);
  const toggle=useCallback(setter=>id=>{setter(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);},[]);
  const result=useMemo(()=>resolve(app,sust,barriers,mech,rest),[app,sust,barriers,mech,rest]);
  const cR=useMemo(()=>getRecyc(result.c.l),[result]);
  const sR=useMemo(()=>getRecyc(result.u.l),[result]);
  const ai=APPS.find(a=>a.id===app);

  return <div style={{height:"100vh",display:"flex",flexDirection:"column",fontFamily:"'Inter',system-ui,-apple-system,sans-serif",background:B.surface,color:B.black,overflow:"hidden"}}>
    {/* HEADER */}
    <div style={{padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:B.black,flexShrink:0,borderBottom:`2px solid ${B.green}`}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:34,height:34,borderRadius:8,background:B.green,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{color:B.black,fontWeight:800,fontSize:11,letterSpacing:0.5}}>CTL</span>
        </div>
        <div>
          <div style={{color:B.white,fontSize:14,fontWeight:700,letterSpacing:0.3}}>Flexible Packaging Audit</div>
          <div style={{color:"#666",fontSize:9,letterSpacing:2.5,textTransform:"uppercase",marginTop:1}}>Close the Loop {"\u00B7"} Packaging Division</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <span style={{fontSize:9,color:"#555",letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>Engineering Decision Tool</span>
        <div style={{width:8,height:8,borderRadius:4,background:B.green,boxShadow:`0 0 8px ${B.green}`}} />
      </div>
    </div>

    {/* BODY */}
    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      {/* LEFT: INPUT */}
      <div style={{width:340,flexShrink:0,borderRight:`1px solid ${B.light}`,overflowY:"auto",padding:"12px 18px 24px",background:B.white}}>
        <Sec letter="A">Application Type</Sec>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {APPS.map(a=><Tog key={a.id} active={app===a.id} onClick={()=>setApp(a.id)}>{a.i}{" "}{a.l}</Tog>)}
        </div>

        <Sec letter="B">Barrier Requirement</Sec>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {BOPT.map(o=><Tog key={o.id} active={barriers.includes(o.id)} onClick={()=>toggle(setBarriers)(o.id)}>{o.l}</Tog>)}
        </div>

        <Sec letter="C">Mechanical & Processing</Sec>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {MOPT.map(o=><Tog key={o.id} active={mech.includes(o.id)} onClick={()=>toggle(setMech)(o.id)}>{o.l}</Tog>)}
        </div>

        <Sec letter="D">Sustainability Priority</Sec>
        <div style={{padding:"4px 0"}}>
          <input type="range" min={1} max={5} step={1} value={sust} onChange={e=>setSust(Number(e.target.value))}
            style={{width:"100%",accentColor:B.green,cursor:"pointer"}} />
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            {["Performance","","Balanced","","Recyclability"].map((l,i)=>
              <span key={i} style={{fontSize:9,color:sust===i+1?B.charcoal:B.mid,fontWeight:sust===i+1?700:400,transition:"all 0.2s"}}>{l}</span>)}
          </div>
        </div>

        <Sec letter="E">Material Restrictions</Sec>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {ROPT.map(o=><Tog key={o.id} active={rest.includes(o.id)} onClick={()=>toggle(setRest)(o.id)}>{o.l}</Tog>)}
        </div>

        {/* Config Summary */}
        <div style={{marginTop:28,padding:14,borderRadius:10,background:B.surface,border:`1px solid ${B.light}`}}>
          <div style={{fontSize:8.5,textTransform:"uppercase",letterSpacing:2.5,color:B.mid,marginBottom:10,fontWeight:700}}>Active Configuration</div>
          <div style={{display:"grid",gap:6}}>
            <div style={{fontSize:10,display:"flex",justifyContent:"space-between"}}>
              <span style={{color:B.mid}}>Application</span>
              <span style={{fontWeight:700,color:B.charcoal}}>{ai?.i} {ai?.l}</span>
            </div>
            <div style={{fontSize:10,display:"flex",justifyContent:"space-between"}}>
              <span style={{color:B.mid}}>Sustainability</span>
              <span style={{fontWeight:700,color:B.charcoal}}>{sust} / 5</span>
            </div>
            <div style={{fontSize:10,display:"flex",justifyContent:"space-between"}}>
              <span style={{color:B.mid}}>Barrier</span>
              <span style={{fontWeight:700,color:B.charcoal}}>{barriers.map(b=>BOPT.find(o=>o.id===b)?.l).join(", ")||"None"}</span>
            </div>
            {mech.length>0&&<div style={{fontSize:10,display:"flex",justifyContent:"space-between"}}>
              <span style={{color:B.mid}}>Mechanical</span>
              <span style={{fontWeight:700,color:B.charcoal}}>{mech.map(m=>MOPT.find(o=>o.id===m)?.l).join(", ")}</span>
            </div>}
            {rest.length>0&&<div style={{fontSize:10,display:"flex",justifyContent:"space-between"}}>
              <span style={{color:B.mid}}>Restrictions</span>
              <span style={{fontWeight:700,color:B.red}}>{rest.map(r=>ROPT.find(o=>o.id===r)?.l).join(", ")}</span>
            </div>}
            {result.warnings&&result.warnings.length>0&&<div style={{fontSize:10,display:"flex",justifyContent:"space-between",marginTop:4,padding:"4px 0",borderTop:`1px solid ${B.light}`}}>
              <span style={{color:B.red,fontWeight:600}}>Alerts</span>
              <span style={{fontWeight:700,color:B.red}}>{result.warnings.length}</span>
            </div>}
          </div>
        </div>
      </div>

      {/* RIGHT: OUTPUT */}
      <div style={{flex:1,overflowY:"auto",padding:"18px 22px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          <Stack layers={result.c.l} title="Conventional Structure" type="conv" />
          <Stack layers={result.u.l} title="Sustainable Alternative" type="sust" />
        </div>

        <div style={{display:"grid",gridTemplateColumns:"5fr 3fr",gap:16,marginBottom:16}}>
          <div style={{...CS,padding:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:B.charcoal}}>Barrier Trade-Off Chart</div>
                <div style={{fontSize:9,color:B.mid,marginTop:2}}>OTR vs WVTR (log scale). Lower = better barrier. Source: Flexible Packaging Guide.</div>
              </div>
            </div>
            <BChart cp={result.c.p} sp={result.u.p} />
            <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:6}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:12,height:12,transform:"rotate(45deg)",background:B.blue,borderRadius:2}} />
                <span style={{fontSize:9,color:B.mid,fontWeight:500}}>Conventional</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:12,height:12,transform:"rotate(45deg)",background:B.green,borderRadius:2}} />
                <span style={{fontSize:9,color:B.mid,fontWeight:500}}>Sustainable</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:9,height:9,borderRadius:5,background:"#ccc"}} />
                <span style={{fontSize:9,color:B.mid,fontWeight:500}}>Raw materials</span>
              </div>
            </div>
          </div>

          <div style={{...CS,padding:16,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
            <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:B.charcoal}}>Recyclability Score</div>
            <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:8,color:B.mid,textTransform:"uppercase",fontWeight:600,letterSpacing:1.5,marginBottom:6}}>Conv.</div>
                <Radial score={cR.s} label={cR.l} mono={cR.mono} />
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:8,color:B.green,textTransform:"uppercase",fontWeight:600,letterSpacing:1.5,marginBottom:6}}>Sust.</div>
                <Radial score={sR.s} label={sR.l} mono={sR.mono} />
              </div>
            </div>
          </div>
        </div>

        <Risks layers={[...result.c.l,...result.u.l]} notes={result.u.n} warnings={result.warnings} />

        {/* WHY THIS RECOMMENDATION */}
        <WhySection result={result} app={app} cR={cR} sR={sR} />

        {/* Footer */}
        <div style={{marginTop:18,paddingTop:14,borderTop:`1px solid ${B.light}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:8,color:B.mid,letterSpacing:2,textTransform:"uppercase",fontWeight:500}}>
            CTL Packaging Division {"\u00B7"} Barrier data per Flexible Packaging Guide {"\u00B7"} Validate with supplier specifications
          </span>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:6,height:6,borderRadius:3,background:B.green,boxShadow:`0 0 6px ${B.green}`}} />
            <span style={{fontSize:8.5,color:B.mid,fontWeight:600}}>v4.0</span>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
