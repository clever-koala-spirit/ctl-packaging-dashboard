// decisionRules.js
// Close the Loop – Flexible Packaging Audit Dashboard
// Modular decision engine for packaging structure recommendation
// Priority: Application → Barrier → Mechanical → Sustainability overlay

export const decisionRules = [
  // ═══════════════════════════════════════════════════════════════
  // RETORT APPLICATIONS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'retort_standard',
    priority: 1,
    conditions: {
      application: ['retort'],
      sustainability: { max: 3 }
    },
    conventional: {
      structure: 'PET / NY / AL / RCPP',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier / heat resistance', thickness: '12µm' },
        { material: 'BOPA', role: 'core', function: 'Puncture resistance / thermoforming', thickness: '15–25µm' },
        { material: 'AL_FOIL', role: 'barrier', function: 'Absolute barrier', thickness: '7–9µm' },
        { material: 'RCPP', role: 'sealant', function: 'Retort sealant 121–135°C', thickness: '70–100µm' }
      ],
      barrierProfile: 'PET/NY/AL/RCPP'
    },
    sustainable: {
      structure: 'PP-based retort (emerging)',
      layers: [
        { material: 'BOPP', role: 'surface', function: 'Print carrier', thickness: '20µm' },
        { material: 'EVOH', role: 'barrier', function: 'OTR barrier (<5% wt)', thickness: '5µm' },
        { material: 'RCPP', role: 'sealant', function: 'Retort sealant', thickness: '70–100µm' }
      ],
      barrierProfile: 'PE/EVOH/PE',
      notes: 'Emerging mono-PP retort. Limited commercial validation. EVOH humidity sensitivity post-retort is a risk factor.'
    }
  },
  {
    id: 'retort_sustainable',
    priority: 1,
    conditions: {
      application: ['retort'],
      sustainability: { min: 4 }
    },
    conventional: {
      structure: 'PET / AL / RCPP',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier / heat resistance', thickness: '12µm' },
        { material: 'AL_FOIL', role: 'barrier', function: 'Absolute barrier', thickness: '7µm' },
        { material: 'RCPP', role: 'sealant', function: 'Retort sealant', thickness: '70µm' }
      ],
      barrierProfile: 'PET/AL/RCPP'
    },
    sustainable: {
      structure: 'Mono-PP / EVOH / RCPP',
      layers: [
        { material: 'BOPP', role: 'surface', function: 'Print carrier (PP-based)', thickness: '20µm' },
        { material: 'EVOH', role: 'barrier', function: 'OTR barrier (<5% wt)', thickness: '3–5µm' },
        { material: 'RCPP', role: 'sealant', function: 'Retort sealant', thickness: '70–100µm' }
      ],
      barrierProfile: 'PE/EVOH/PE',
      notes: 'Mono-PP retort is emerging technology. Post-retort EVOH barrier degradation must be validated for shelf-life.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // FROZEN FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'frozen_standard',
    priority: 2,
    conditions: {
      application: ['frozen_food'],
      sustainability: { max: 3 }
    },
    conventional: {
      structure: 'NY / LLDPE',
      layers: [
        { material: 'BOPA', role: 'surface', function: 'Puncture resistance / print', thickness: '15µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Cold-chain sealant / toughness', thickness: '50–80µm' }
      ],
      barrierProfile: 'NY/LLDPE'
    },
    sustainable: {
      structure: 'MDO-PE / LLDPE (high-toughness)',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print carrier / stiffness', thickness: '25µm' },
        { material: 'LLDPE', role: 'sealant', function: 'High-toughness PE sealant', thickness: '60–80µm' }
      ],
      barrierProfile: 'MDO-PE/LLDPE',
      notes: 'Mono-PE recyclable. Reduced puncture resistance vs NY. Validate cold-chain flex crack performance.'
    }
  },
  {
    id: 'frozen_sustainable',
    priority: 2,
    conditions: {
      application: ['frozen_food'],
      sustainability: { min: 4 }
    },
    conventional: {
      structure: 'PET / NY / LLDPE',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier / stiffness', thickness: '12µm' },
        { material: 'BOPA', role: 'core', function: 'Puncture resistance', thickness: '15µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'PET/NY/LLDPE'
    },
    sustainable: {
      structure: 'MDO-PE / LLDPE',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web / stiffness', thickness: '25–30µm' },
        { material: 'LLDPE', role: 'sealant', function: 'High-toughness cold-chain sealant', thickness: '70µm' }
      ],
      barrierProfile: 'MDO-PE/LLDPE',
      notes: 'Full mono-PE structure. Recyclable. MDO-PE replaces PET as print web. High-toughness sealant compensates for NY removal.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // SNACKS / BISCUITS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'snacks_standard',
    priority: 3,
    conditions: {
      application: ['snacks', 'confectionery'],
      sustainability: { max: 3 }
    },
    conventional: {
      structure: 'OPP / VMPET / CPP',
      layers: [
        { material: 'BOPP', role: 'surface', function: 'Print carrier / gloss', thickness: '20µm' },
        { material: 'VMPET', role: 'barrier', function: 'OTR + light barrier', thickness: '12µm' },
        { material: 'CPP', role: 'sealant', function: 'Sealant', thickness: '25–30µm' }
      ],
      barrierProfile: 'OPP/VMPET/CPP'
    },
    sustainable: {
      structure: 'BOPP / VMOPP / BOPP-HS (mono-PP)',
      layers: [
        { material: 'BOPP', role: 'surface', function: 'Print carrier', thickness: '20µm' },
        { material: 'VMOPP', role: 'barrier', function: 'OTR + moisture barrier (met)', thickness: '20µm' },
        { material: 'BOPP_HEAT_SEAL', role: 'sealant', function: 'PP sealant', thickness: '25µm' }
      ],
      barrierProfile: 'BOPP/VMOPP/BOPP-HS',
      notes: 'Mono-PP recyclable. Metallised BOPP provides adequate barrier for snack shelf-life. Verify bond strength.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // PUFFED SNACKS (N₂ flush critical)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'puffed_snacks',
    priority: 3,
    conditions: {
      application: ['puffed_snacks'],
      sustainability: { max: 3 }
    },
    conventional: {
      structure: 'OPP / VMPET / PE',
      layers: [
        { material: 'BOPP', role: 'surface', function: 'Print carrier / stiffness', thickness: '20µm' },
        { material: 'VMPET', role: 'barrier', function: 'OTR + light barrier', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'VFFS sealant / hot tack', thickness: '40µm' }
      ],
      barrierProfile: 'PET/VMPET/PE'
    },
    sustainable: {
      structure: 'BOPP / VMCPP (mono-PP)',
      layers: [
        { material: 'BOPP', role: 'surface', function: 'Print carrier', thickness: '20µm' },
        { material: 'VMCPP', role: 'barrier', function: 'Barrier + sealant (met CPP)', thickness: '25µm' }
      ],
      barrierProfile: 'BOPP/VMCPP',
      notes: 'Mono-PP recyclable. VMCPP dual-function (barrier + seal). Adequate for puffed snack shelf-life.'
    }
  },
  {
    id: 'puffed_snacks_sustainable',
    priority: 3,
    conditions: {
      application: ['puffed_snacks'],
      sustainability: { min: 4 }
    },
    conventional: {
      structure: 'OPP / VMPET / PE',
      layers: [
        { material: 'BOPP', role: 'surface', function: 'Print carrier', thickness: '20µm' },
        { material: 'VMPET', role: 'barrier', function: 'OTR + light barrier', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '40µm' }
      ],
      barrierProfile: 'PET/VMPET/PE'
    },
    sustainable: {
      structure: 'Mono-PP (BOPP / VMCPP)',
      layers: [
        { material: 'BOPP', role: 'surface', function: 'Print carrier', thickness: '20µm' },
        { material: 'VMCPP', role: 'barrier', function: 'Metallised barrier + seal', thickness: '25µm' }
      ],
      barrierProfile: 'BOPP/VMCPP',
      notes: 'Full mono-PP. Recyclable. VMCPP combines barrier and sealant.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // VACUUM PACKAGING
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'vacuum_standard',
    priority: 2,
    conditions: {
      application: ['vacuum'],
      sustainability: { max: 3 }
    },
    conventional: {
      structure: 'PET / NY / LLDPE',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier / stiffness', thickness: '12µm' },
        { material: 'BOPA', role: 'core', function: 'Puncture resistance / vacuum hold', thickness: '15–25µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Vacuum sealant', thickness: '50–80µm' }
      ],
      barrierProfile: 'PET/NY/LLDPE'
    },
    sustainable: {
      structure: 'PE / EVOH / PE',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web (PE-based)', thickness: '25µm' },
        { material: 'EVOH', role: 'barrier', function: 'OTR barrier (<5% wt)', thickness: '3–5µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'PE/EVOH/PE',
      notes: 'Mono-PE with EVOH barrier. Recyclable if EVOH <5%. Reduced puncture vs NY – validate for application.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // HOT FILL / LIQUIDS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'hotfill_standard',
    priority: 3,
    conditions: {
      application: ['liquids_hotfill'],
      sustainability: { max: 5 }
    },
    conventional: {
      structure: 'PET / AL / CPP',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier / heat resistance', thickness: '12µm' },
        { material: 'AL_FOIL', role: 'barrier', function: 'Barrier', thickness: '7µm' },
        { material: 'CPP', role: 'sealant', function: 'Hot-fill sealant (up to 100°C)', thickness: '50–70µm' }
      ],
      barrierProfile: 'PET/AL/RCPP'
    },
    sustainable: {
      structure: 'MDO-PE / AlOx / PE',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web (PE-based)', thickness: '25µm' },
        { material: 'PET_ALOX', role: 'barrier', function: 'Transparent barrier (AlOx)', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'MDO-PE/AlOx/PE',
      notes: 'AlOx provides transparent high barrier without AL. Heat tolerance limit must be validated for hot-fill.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // COFFEE / TEA
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'coffee_standard',
    priority: 2,
    conditions: {
      application: ['coffee_tea'],
      sustainability: { max: 3 }
    },
    conventional: {
      structure: 'PET / VMPET / PE',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier', thickness: '12µm' },
        { material: 'VMPET', role: 'barrier', function: 'OTR + aroma + light barrier', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'PET/VMPET/PE'
    },
    sustainable: {
      structure: 'High-barrier MDO-PE / Metallised PP',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web (PE-based)', thickness: '25µm' },
        { material: 'VMOPP', role: 'barrier', function: 'Metallised OTR + aroma barrier', thickness: '20µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'OPP/VMOPP/CPP',
      notes: 'Metallised barrier is critical for coffee aroma retention. VMOPP provides good OTR but verify for extended shelf-life.'
    }
  },
  {
    id: 'coffee_sustainable',
    priority: 2,
    conditions: {
      application: ['coffee_tea'],
      sustainability: { min: 4 }
    },
    conventional: {
      structure: 'PET / AL / PE',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier', thickness: '12µm' },
        { material: 'AL_FOIL', role: 'barrier', function: 'Absolute aroma + OTR barrier', thickness: '7µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'PET/AL/RCPP'
    },
    sustainable: {
      structure: 'MDO-PE / AlOx / PE',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web (mono-PE)', thickness: '25µm' },
        { material: 'PET_ALOX', role: 'barrier', function: 'High-barrier AlOx coating', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'MDO-PE/AlOx/PE',
      notes: 'AlOx replaces AL foil. Transparent. Recyclable profile. Aroma retention must be validated vs AL baseline.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // PET FOOD
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'petfood_standard',
    priority: 3,
    conditions: {
      application: ['pet_food'],
      sustainability: { max: 3 }
    },
    conventional: {
      structure: 'PET / VMPET / PE',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier / puncture', thickness: '12µm' },
        { material: 'VMPET', role: 'barrier', function: 'OTR + light + aroma barrier', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Tough sealant', thickness: '70µm' }
      ],
      barrierProfile: 'PET/VMPET/PE'
    },
    sustainable: {
      structure: 'MDO-PE / EVOH / PE',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web', thickness: '25µm' },
        { material: 'EVOH', role: 'barrier', function: 'OTR barrier (<5% wt)', thickness: '5µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Tough sealant', thickness: '70µm' }
      ],
      barrierProfile: 'PE/EVOH/PE',
      notes: 'Mono-PE with EVOH. Recyclable. Validate EVOH performance for fat/oil migration and shelf-life.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // POWDER PRODUCTS (hygroscopic)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'powder_standard',
    priority: 3,
    conditions: {
      application: ['powder'],
      sustainability: { max: 3 }
    },
    conventional: {
      structure: 'PET / VMPET / PE',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier', thickness: '12µm' },
        { material: 'VMPET', role: 'barrier', function: 'Moisture + OTR barrier', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'PET/VMPET/PE'
    },
    sustainable: {
      structure: 'High-barrier MDO-PE / SiOx / PE',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web', thickness: '25µm' },
        { material: 'PET_SIOX', role: 'barrier', function: 'SiOx transparent barrier', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'MDO-PE/SiOx/PE',
      notes: 'SiOx provides transparent moisture barrier. Validate for hygroscopic powder shelf-life requirements.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // DETERGENTS & CHEMICALS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'detergents_standard',
    priority: 4,
    conditions: {
      application: ['detergents'],
      sustainability: { max: 5 }
    },
    conventional: {
      structure: 'PET / PE',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier / chemical resistance', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Tough sealant / puncture', thickness: '80–100µm' }
      ],
      barrierProfile: 'PET/PE'
    },
    sustainable: {
      structure: 'MDO-PE / LLDPE (mono-PE)',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web / stiffness', thickness: '30µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Tough sealant', thickness: '80–100µm' }
      ],
      barrierProfile: 'MDO-PE/LLDPE',
      notes: 'Full mono-PE recyclable. Low barrier requirement. Validate chemical resistance of PE-based print web.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // COSMETICS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cosmetics_standard',
    priority: 4,
    conditions: {
      application: ['cosmetics'],
      sustainability: { max: 5 }
    },
    conventional: {
      structure: 'PET / VMPET / PE',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print / gloss / premium feel', thickness: '12µm' },
        { material: 'VMPET', role: 'barrier', function: 'Light + moisture barrier', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'PET/VMPET/PE'
    },
    sustainable: {
      structure: 'MDO-PE / VMOPP / PE',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web', thickness: '25µm' },
        { material: 'VMOPP', role: 'barrier', function: 'Light + barrier', thickness: '20µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
      ],
      barrierProfile: 'OPP/VMOPP/CPP',
      notes: 'Metallised look preserved. Mixed polymer (PE/PP) – verify local recycling stream compatibility.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // LIDDING / PEELABLE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'lidding_standard',
    priority: 3,
    conditions: {
      application: ['lidding'],
      sustainability: { max: 3 }
    },
    conventional: {
      structure: 'PET / PE (peel)',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier / stiffness', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Peelable sealant layer', thickness: '30–50µm' }
      ],
      barrierProfile: 'PET/PE'
    },
    sustainable: {
      structure: 'Mono-PE peelable lid',
      layers: [
        { material: 'MDO_PE', role: 'surface', function: 'Print web (PE-based)', thickness: '25µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Peelable PE sealant', thickness: '30–40µm' }
      ],
      barrierProfile: 'MDO-PE/LLDPE',
      notes: 'Mono-PE peelable. Match sealant to tray material for recyclability. PE-to-PE or PP-to-PP peel systems.'
    }
  },
  {
    id: 'lidding_sustainable',
    priority: 3,
    conditions: {
      application: ['lidding'],
      sustainability: { min: 4 }
    },
    conventional: {
      structure: 'PET / PE (peel)',
      layers: [
        { material: 'BOPET', role: 'surface', function: 'Print carrier', thickness: '12µm' },
        { material: 'LLDPE', role: 'sealant', function: 'Peelable sealant', thickness: '30–50µm' }
      ],
      barrierProfile: 'PET/PE'
    },
    sustainable: {
      structure: 'Mono-PP peelable lid',
      layers: [
        { material: 'BOPP', role: 'surface', function: 'Print carrier (PP-based)', thickness: '20µm' },
        { material: 'CPP', role: 'sealant', function: 'Peelable PP sealant', thickness: '25–30µm' }
      ],
      barrierProfile: 'BOPP/BOPP-HS',
      notes: 'Mono-PP peelable for PP trays. Match material family to tray. Peel force calibration critical.'
    }
  }
];

// ═══════════════════════════════════════════════════════════════
// MATERIAL RESTRICTION OVERRIDES
// ═══════════════════════════════════════════════════════════════
export const restrictionOverrides = {
  avoid_aluminium: {
    replace: 'AL_FOIL',
    with: ['PET_ALOX', 'PET_SIOX', 'VMPET'],
    note: 'Replace AL foil with AlOx/SiOx coated films or metallised alternatives.'
  },
  avoid_nylon: {
    replace: 'BOPA',
    with: ['MDO_PE', 'BOPE', 'BOPET'],
    note: 'Replace NY with MDO-PE (mono-PE) or PET. Puncture/vacuum performance may be reduced.'
  },
  prefer_pe_mono: {
    preferFamily: 'PE',
    note: 'Prioritise PE-based structures: MDO-PE + LLDPE with EVOH if barrier needed.'
  },
  prefer_pp_mono: {
    preferFamily: 'PP',
    note: 'Prioritise PP-based structures: BOPP + VMOPP/VMCPP or BOPP-HS.'
  },
  pcr_required: {
    note: 'Incorporate post-consumer recycled content. PCR-PE or PCR-PP sealant layers. Mass balance or mechanical recycling.'
  }
};

// ═══════════════════════════════════════════════════════════════
// RECYCLABILITY SCORING
// ═══════════════════════════════════════════════════════════════
export const recyclabilityScoring = {
  monoMaterial: (layers) => {
    const families = new Set(layers.map(l => {
      const matId = l.material;
      if (['MDO_PE','BOPE','LDPE','LLDPE','HDPE','PE_COEX'].includes(matId)) return 'PE';
      if (['BOPP','BOPP_HEAT_SEAL','CPP','RCPP','VMOPP','VMCPP'].includes(matId)) return 'PP';
      if (['BOPET','VMPET','PET_ALOX','PET_SIOX'].includes(matId)) return 'PET';
      if (matId === 'EVOH') return 'EVOH_MINOR';
      return matId;
    }));

    const mainFamilies = new Set([...families].filter(f => f !== 'EVOH_MINOR'));
    const hasEVOH = families.has('EVOH_MINOR');
    const hasAL = families.has('AL_FOIL');
    const hasNY = families.has('BOPA');

    if (mainFamilies.size === 1 && !hasEVOH) return { score: 95, label: 'High', mono: true, note: 'Mono-material structure. Recyclable in standard stream.' };
    if (mainFamilies.size === 1 && hasEVOH) return { score: 80, label: 'Moderate-High', mono: false, note: 'Mono-material with EVOH <5%. Recyclable with minor functional barrier.' };
    if (hasAL) return { score: 25, label: 'Low', mono: false, note: 'Contains aluminium. Not recyclable in standard streams.' };
    if (hasNY) return { score: 40, label: 'Moderate-Low', mono: false, note: 'Contains nylon. Multi-material – limited recyclability.' };
    return { score: 55, label: 'Moderate', mono: false, note: 'Multi-material laminate. Check local recycling infrastructure.' };
  }
};

// ═══════════════════════════════════════════════════════════════
// PROCESSING RISK NOTES DATABASE
// ═══════════════════════════════════════════════════════════════
export const processingRiskNotes = {
  BOPA: [
    'Nylon is hygroscopic – store at <60% RH. Condition before lamination.',
    'Excellent flex crack resistance but moisture pickup affects barrier.',
    'Essential for vacuum hold and retort puncture resistance.'
  ],
  AL_FOIL: [
    'Flex crack risk at <9µm – pinhole formation under repeated flexing.',
    'Dead fold property useful for wrap applications.',
    'Not recyclable in laminate form. Consider AlOx/SiOx alternatives.'
  ],
  EVOH: [
    'Humidity sensitivity: OTR barrier degrades significantly above 75% RH.',
    'Must be sandwiched between PE or PP moisture barrier layers.',
    'Post-retort barrier recovery time must be validated.',
    'Keep below 5–6% by weight for recyclability claims.'
  ],
  VMPET: [
    'Bond strength to metallised surface is critical – delamination risk.',
    'Corona/flame treatment of met surface required for adhesion.',
    'Light barrier function important for photosensitive products.'
  ],
  VMOPP: [
    'Metallisation adhesion lower than VMPET – validate bond strength.',
    'Enables mono-PP barrier structures.'
  ],
  RCPP: [
    'Retort grade – validate seal integrity at 121–135°C.',
    'Seal initiation temperature higher than standard CPP.',
    'Dimensional stability under retort conditions is critical.'
  ],
  MDO_PE: [
    'Machine direction orientation gives PET-like stiffness in PE.',
    'Print quality approaching PET/OPP but not yet equivalent.',
    'Key enabler for mono-PE recyclable structures.'
  ],
  LLDPE: [
    'Seal initiation temperature: 105–135°C depending on grade.',
    'Cold chain: validate seal performance at -40°C.',
    'HFFS/VFFS compatible with good hot tack.'
  ],
  CPP: [
    'Hot-fill compatible up to ~100°C (verify with supplier).',
    'Higher seal initiation temperature than PE sealants.',
    'Good clarity for shelf appeal.'
  ]
};

// ═══════════════════════════════════════════════════════════════
// DECISION ENGINE RESOLVER
// ═══════════════════════════════════════════════════════════════
export function resolveRecommendation(inputs) {
  const { application, sustainability, barriers, mechanical, restrictions } = inputs;

  // Find matching rules
  let candidates = decisionRules.filter(rule => {
    const appMatch = rule.conditions.application.includes(application);
    const sustMin = rule.conditions.sustainability?.min || 0;
    const sustMax = rule.conditions.sustainability?.max || 5;
    const sustMatch = sustainability >= sustMin && sustainability <= sustMax;
    return appMatch && sustMatch;
  });

  // Sort by priority (lower = higher priority)
  candidates.sort((a, b) => a.priority - b.priority);

  if (candidates.length === 0) {
    // Fallback: general purpose
    return {
      conventional: {
        structure: 'PET / PE',
        layers: [
          { material: 'BOPET', role: 'surface', function: 'Print carrier', thickness: '12µm' },
          { material: 'LLDPE', role: 'sealant', function: 'General sealant', thickness: '50µm' }
        ],
        barrierProfile: 'PET/PE'
      },
      sustainable: {
        structure: 'MDO-PE / LLDPE (mono-PE)',
        layers: [
          { material: 'MDO_PE', role: 'surface', function: 'Print web', thickness: '25µm' },
          { material: 'LLDPE', role: 'sealant', function: 'Sealant', thickness: '50µm' }
        ],
        barrierProfile: 'MDO-PE/LLDPE',
        notes: 'General-purpose mono-PE structure.'
      },
      riskNotes: []
    };
  }

  const selected = candidates[0];

  // Collect risk notes for materials used
  const allMaterials = [
    ...selected.conventional.layers.map(l => l.material),
    ...selected.sustainable.layers.map(l => l.material)
  ];
  const uniqueMaterials = [...new Set(allMaterials)];
  const riskNotes = {};
  uniqueMaterials.forEach(mat => {
    if (processingRiskNotes[mat]) {
      riskNotes[mat] = processingRiskNotes[mat];
    }
  });

  // Calculate recyclability
  const convRecyclability = recyclabilityScoring.monoMaterial(selected.conventional.layers);
  const sustRecyclability = recyclabilityScoring.monoMaterial(selected.sustainable.layers);

  return {
    ruleId: selected.id,
    conventional: selected.conventional,
    sustainable: { ...selected.sustainable },
    convRecyclability,
    sustRecyclability,
    riskNotes,
    restrictions: restrictions || []
  };
}

export default decisionRules;
