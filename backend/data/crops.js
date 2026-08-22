/**
 * FAO-56 Agronomic Crop Database
 * Contains crop stage definitions, criticality scores, and irrigation intervals.
 */

const CROPS = {
  wheat: {
    id: "wheat",
    name: "Wheat (गेहूं)",
    scientificName: "Triticum aestivum",
    season: "Rabi",
    totalDurationDays: 125,
    stages: {
      initial: {
        name: "Initial / Crown Root Initiation (CRI)",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.4,
        criticality: 95,
        description: "Crown Root Initiation stage (20-25 DAS) — highly sensitive to moisture stress. Delay causes permanent tiller reduction.",
        sensitivityRank: "Extremely High"
      },
      development: {
        name: "Tillering & Jointing",
        durationDays: 35,
        startDay: 21,
        endDay: 55,
        kc: 0.8,
        criticality: 70,
        description: "Active vegetative growth and stem elongation. Moderate to high water demand.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Flowering & Grain Filling / Milking",
        durationDays: 45,
        startDay: 56,
        endDay: 100,
        kc: 1.15,
        criticality: 92,
        description: "Peak anthesis and grain formation. Water deficit causes shriveled grains and severe yield drop.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Dough to Maturation",
        durationDays: 25,
        startDay: 101,
        endDay: 125,
        kc: 0.4,
        criticality: 30,
        description: "Grain ripening and drying. Irrigation stopped to facilitate harvest.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 18
  },

  mustard: {
    id: "mustard",
    name: "Mustard (सरसों)",
    scientificName: "Brassica juncea",
    season: "Rabi",
    totalDurationDays: 110,
    stages: {
      initial: {
        name: "Emergence & Seedling",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.35,
        criticality: 60,
        description: "Establishment of root system and rosette stage.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Branching & Pre-Flowering",
        durationDays: 30,
        startDay: 21,
        endDay: 50,
        kc: 0.75,
        criticality: 82,
        description: "Secondary branch formation (30-40 DAS). Critical for siliqua number.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Flowering & Pod Filling (Siliqua)",
        durationDays: 40,
        startDay: 51,
        endDay: 90,
        kc: 1.05,
        criticality: 90,
        description: "Peak flowering and pod elongation (55-65 DAS). Yield loss up to 40% if stressed.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Pod Maturation & Drying",
        durationDays: 20,
        startDay: 91,
        endDay: 110,
        kc: 0.35,
        criticality: 25,
        description: "Seeds turn black/brown; water withheld.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 25
  },

  paddy: {
    id: "paddy",
    name: "Paddy / Rice (धान)",
    scientificName: "Oryza sativa",
    season: "Kharif",
    totalDurationDays: 130,
    stages: {
      initial: {
        name: "Nursery & Transplanting Establishment",
        durationDays: 25,
        startDay: 1,
        endDay: 25,
        kc: 1.1,
        criticality: 80,
        description: "Seedling recovery after transplanting. Continuous shallow ponding needed.",
        sensitivityRank: "High"
      },
      development: {
        name: "Tillering & Panicle Initiation",
        durationDays: 35,
        startDay: 26,
        endDay: 60,
        kc: 1.2,
        criticality: 88,
        description: "Active tiller production and primordial development. Stress reduces panicle count.",
        sensitivityRank: "Very High"
      },
      midSeason: {
        name: "Heading, Flowering & Milk Stage",
        durationDays: 45,
        startDay: 61,
        endDay: 105,
        kc: 1.35,
        criticality: 98,
        description: "Panicle exertion and anthesis. Even 2-3 days drought causes spikelet sterility.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Dough to Grain Ripening",
        durationDays: 25,
        startDay: 106,
        endDay: 130,
        kc: 0.7,
        criticality: 35,
        description: "Grain hardening. Field drained 10 days before harvest.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 7
  },

  cotton: {
    id: "cotton",
    name: "Cotton (कपास)",
    scientificName: "Gossypium hirsutum",
    season: "Kharif",
    totalDurationDays: 160,
    stages: {
      initial: {
        name: "Germination & Early Vegetative",
        durationDays: 30,
        startDay: 1,
        endDay: 30,
        kc: 0.45,
        criticality: 50,
        description: "Taproot penetration into deeper soil profiles.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Squaring (Floral Bud Formation)",
        durationDays: 40,
        startDay: 31,
        endDay: 70,
        kc: 0.85,
        criticality: 78,
        description: "Square formation. Stress causes square shedding.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Peak Flowering & Boll Development",
        durationDays: 60,
        startDay: 71,
        endDay: 130,
        kc: 1.15,
        criticality: 94,
        description: "Active boll setting and lint elongation. Severe boll drop if water-stressed.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Boll Opening & Maturation",
        durationDays: 30,
        startDay: 131,
        endDay: 160,
        kc: 0.6,
        criticality: 30,
        description: "Bolls burst open for picking. Excess water spoils cotton lint quality.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 20
  },

  gram: {
    id: "gram",
    name: "Gram / Chickpea (चना)",
    scientificName: "Cicer arietinum",
    season: "Rabi",
    totalDurationDays: 115,
    stages: {
      initial: {
        name: "Emergence & Early Vegetative",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.4,
        criticality: 45,
        description: "Seedling emergence; deep taproot establishment.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Branching & Pre-Flowering",
        durationDays: 30,
        startDay: 21,
        endDay: 50,
        kc: 0.7,
        criticality: 80,
        description: "Pre-flowering vegetative pulse (45 DAS). Crucial irrigation turn.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Pod Development & Grain Filling",
        durationDays: 45,
        startDay: 51,
        endDay: 95,
        kc: 1.0,
        criticality: 89,
        description: "Pod enlargement (70-75 DAS). Moisture deficit causes pod abortion.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Senescence & Maturity",
        durationDays: 20,
        startDay: 96,
        endDay: 115,
        kc: 0.35,
        criticality: 20,
        description: "Foliage turns golden brown; dry down.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 30
  },

  maize: {
    id: "maize",
    name: "Maize / Corn (मक्का)",
    scientificName: "Zea mays",
    season: "Kharif/Rabi",
    totalDurationDays: 110,
    stages: {
      initial: {
        name: "Emergence to V4 Leaf Stage",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.4,
        criticality: 55,
        description: "Early seedling growth.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Rapid Stem Elongation (Knee-high)",
        durationDays: 30,
        startDay: 21,
        endDay: 50,
        kc: 0.85,
        criticality: 75,
        description: "Vegetative biomass accumulation.",
        sensitivityRank: "High"
      },
      midSeason: {
        name: "Tasseling, Silking & Cob Filling",
        durationDays: 40,
        startDay: 51,
        endDay: 90,
        kc: 1.2,
        criticality: 96,
        description: "Silking and pollination window (50-65 DAS). 2 days stress reduces yield by 30-40%.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Dent & Black Layer Maturity",
        durationDays: 20,
        startDay: 91,
        endDay: 110,
        kc: 0.6,
        criticality: 25,
        description: "Grain drydown and husk browning.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 14
  },

  potato: {
    id: "potato",
    name: "Potato (आलू)",
    scientificName: "Solanum tuberosum",
    season: "Rabi",
    totalDurationDays: 95,
    stages: {
      initial: {
        name: "Sprouting & Emergence",
        durationDays: 20,
        startDay: 1,
        endDay: 20,
        kc: 0.5,
        criticality: 60,
        description: "Sprout emergence and root development.",
        sensitivityRank: "Moderate"
      },
      development: {
        name: "Stolon Initiation & Tuberization",
        durationDays: 25,
        startDay: 21,
        endDay: 45,
        kc: 0.85,
        criticality: 88,
        description: "Tuber hook formation (30-40 DAS). Moisture stress limits tuber count.",
        sensitivityRank: "Very High"
      },
      midSeason: {
        name: "Tuber Bulking",
        durationDays: 35,
        startDay: 46,
        endDay: 80,
        kc: 1.15,
        criticality: 95,
        description: "Rapid starch storage in tubers. Irregular moisture causes hollow heart or cracked tubers.",
        sensitivityRank: "Critical"
      },
      lateSeason: {
        name: "Skin Curing & Maturation",
        durationDays: 15,
        startDay: 81,
        endDay: 95,
        kc: 0.65,
        criticality: 25,
        description: "Haulm cutting / dehaulming stage; skins harden.",
        sensitivityRank: "Low"
      }
    },
    irrigationIntervalDays: 10
  }
};

module.exports = CROPS;
