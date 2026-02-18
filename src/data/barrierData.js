// barrierData.js
// Close the Loop – Flexible Packaging Audit Dashboard
// Barrier performance dataset – OTR / WVTR indicative ranges
// Source: Flexible Packaging Materials Guide

export const barrierReferencePoints = [
  { id: 'LDPE',     label: 'LDPE',      otr: 6500,  wvtr: 10,   family: 'PE',   color: '#90EE90' },
  { id: 'LLDPE',    label: 'LLDPE',     otr: 6000,  wvtr: 8,    family: 'PE',   color: '#98FB98' },
  { id: 'HDPE',     label: 'HDPE',      otr: 2500,  wvtr: 3,    family: 'PE',   color: '#7CCD7C' },
  { id: 'MDO_PE',   label: 'MDO-PE',    otr: 2000,  wvtr: 6,    family: 'PE',   color: '#66CDAA' },
  { id: 'BOPE',     label: 'BOPE',      otr: 1800,  wvtr: 5,    family: 'PE',   color: '#3CB371' },
  { id: 'BOPP',     label: 'BOPP',      otr: 1600,  wvtr: 4,    family: 'OPP',  color: '#A8D8EA' },
  { id: 'CPP',      label: 'CPP',       otr: 2500,  wvtr: 5,    family: 'PP',   color: '#DDA0DD' },
  { id: 'RCPP',     label: 'RCPP',      otr: 2000,  wvtr: 4,    family: 'PP',   color: '#BA55D3' },
  { id: 'BOPET',    label: 'PET',       otr: 50,    wvtr: 15,   family: 'PET',  color: '#7FB3D8' },
  { id: 'BOPA',     label: 'NY (PA)',   otr: 20,    wvtr: 130,  family: 'PA',   color: '#F4A460' },
  { id: 'VMOPP',    label: 'VMOPP',     otr: 25,    wvtr: 1.5,  family: 'OPP',  color: '#C0C0C0' },
  { id: 'VMPET',    label: 'VMPET',     otr: 1,     wvtr: 1,    family: 'PET',  color: '#A0A0A0' },
  { id: 'VMCPP',    label: 'VMCPP',     otr: 40,    wvtr: 2,    family: 'PP',   color: '#9370DB' },
  { id: 'EVOH',     label: 'EVOH (dry)', otr: 0.5,  wvtr: 50,   family: 'EVOH', color: '#FFD700' },
  { id: 'AL_FOIL',  label: 'AL Foil',   otr: 0.01,  wvtr: 0.01, family: 'AL',   color: '#808080' },
  { id: 'PET_ALOX', label: 'AlOx/PET',  otr: 1,     wvtr: 1,    family: 'PET',  color: '#D4A574' },
  { id: 'PET_SIOX', label: 'SiOx/PET',  otr: 1.5,   wvtr: 1.5,  family: 'PET',  color: '#E8D5B7' },
];

// Barrier classification thresholds
export const barrierClassification = {
  otr: {
    low:    { min: 500,  max: 10000, label: 'Low OTR Barrier' },
    medium: { min: 10,   max: 500,   label: 'Medium OTR Barrier' },
    high:   { min: 0,    max: 10,    label: 'High OTR Barrier' },
    ultra:  { min: 0,    max: 1,     label: 'Ultra-High OTR Barrier' }
  },
  wvtr: {
    low:    { min: 10,   max: 500,   label: 'Low WVTR Barrier' },
    medium: { min: 2,    max: 10,    label: 'Medium WVTR Barrier' },
    high:   { min: 0,    max: 2,     label: 'High WVTR Barrier' },
    ultra:  { min: 0,    max: 0.5,   label: 'Ultra-High WVTR Barrier' }
  }
};

// Laminate structure barrier (approximate combined values)
export const laminateBarrierProfiles = {
  'OPP/CPP':           { otr: 1200, wvtr: 4,   label: 'OPP / CPP' },
  'OPP/VMPET/CPP':     { otr: 1,    wvtr: 1,   label: 'OPP / VMPET / CPP' },
  'OPP/VMOPP/CPP':     { otr: 20,   wvtr: 1.5, label: 'OPP / VMOPP / CPP' },
  'PET/NY/LLDPE':      { otr: 15,   wvtr: 8,   label: 'PET / NY / LLDPE' },
  'PET/AL/RCPP':       { otr: 0.01, wvtr: 0.01,label: 'PET / AL / RCPP' },
  'PET/VMPET/PE':      { otr: 1,    wvtr: 1,   label: 'PET / VMPET / PE' },
  'NY/LLDPE':          { otr: 18,   wvtr: 8,   label: 'NY / LLDPE' },
  'PET/PE':            { otr: 45,   wvtr: 8,   label: 'PET / PE' },
  'MDO-PE/LLDPE':      { otr: 1500, wvtr: 6,   label: 'MDO-PE / LLDPE' },
  'BOPE/PE':           { otr: 1400, wvtr: 5,   label: 'BOPE / PE' },
  'PE/EVOH/PE':        { otr: 0.5,  wvtr: 8,   label: 'PE / EVOH / PE' },
  'BOPP/BOPP-HS':      { otr: 1200, wvtr: 3,   label: 'BOPP / BOPP-HS' },
  'BOPP/VMOPP/BOPP-HS':{ otr: 20,   wvtr: 1.5, label: 'BOPP / VMOPP / BOPP-HS' },
  'MDO-PE/SiOx/PE':    { otr: 1.5,  wvtr: 1.5, label: 'MDO-PE / SiOx / PE' },
  'MDO-PE/AlOx/PE':    { otr: 1,    wvtr: 1,   label: 'MDO-PE / AlOx / PE' },
  'PET/NY/AL/RCPP':    { otr: 0.01, wvtr: 0.01,label: 'PET / NY / AL / RCPP' },
  'BOPP/VMCPP':        { otr: 35,   wvtr: 2,   label: 'BOPP / VMCPP' },
};

export default barrierReferencePoints;
