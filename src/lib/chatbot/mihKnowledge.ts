export const MIH_KNOWLEDGE_VERSION = '2026-04-26-v1'

export const MIH_COMPANY_PROFILE = {
  businessName: 'MIH Interiors',
  clientName: 'Mohit Mahajan',
  officeAddress: 'SCO 62-63, 3rd Floor, Sector 17A, Chandigarh - 160017',
  officePhone: '+91 98885 45403',
  established: 'circa 2007',
  brandRating: '5.0',
  operatingRegions: ['Chandigarh', 'Mohali', 'Panchkula', 'Punjab', 'Pathankot'],
  philosophy: 'Democratizing elite architectural services through design rigor, transparency, and cost-efficient execution.',
  targetClientProfile: 'Individuals and businesses with project budgets above Rs. 1 Crore.',
} as const

export const MIH_SERVICE_DOMAINS = {
  residential: [
    'Full home interiors for 1 BHK, 2 BHK, 3 BHK, 4 BHK, Kothis, villas, and row houses.',
    'Architectural construction for bungalows and row houses.',
    'Baby room design with child-safe and low-VOC material focus.',
    'Wellness-first planning including bathrooms and ergonomic workspaces.',
    'Passive thermal comfort planning for North Indian climates.',
  ],
  commercial: [
    'Corporate offices with executive cabins, open workspaces, and boardrooms.',
    'Retail environments including showrooms and luxury jewelry spaces.',
    'Hospitality interiors including cafes, restaurants, resorts, and banquet spaces.',
    'Industrial and factory interiors with occupational safety planning.',
    'Healthcare spaces including hospitals, clinics, and wellness centers.',
  ],
  process: [
    'Every project starts with comprehensive 3D visualization before execution.',
    'Material and finish guidance is provided with visual references.',
    'Design revisions are incorporated before site execution begins.',
    'Execution is personally supervised by Mohit and Ravi.',
  ],
} as const

export const MIH_ENGAGEMENT_MODELS = [
  { label: 'Design & Execution', value: 'design_execution' },
  { label: 'With Materials', value: 'with_materials' },
  { label: 'Without Materials', value: 'without_materials' },
  { label: 'Percentage Basis', value: 'percentage_basis' },
] as const

export const BUDGET_RANGE_OPTIONS = [
  { label: 'Under Rs. 10L', value: 'under_10' },
  { label: 'Rs. 10L - Rs. 25L', value: '10_25' },
  { label: 'Rs. 25L - Rs. 50L', value: '25_50' },
  { label: 'Rs. 50L - Rs. 1Cr', value: '50_100' },
  { label: 'Above Rs. 1Cr', value: 'above_100' },
] as const

export const TIMELINE_OPTIONS = [
  { label: 'Within 1 month', value: '0_1_month' },
  { label: '1 - 3 months', value: '1_3_months' },
  { label: '3 - 6 months', value: '3_6_months' },
  { label: '6+ months', value: '6_plus_months' },
] as const

export const RESIDENTIAL_PACKAGE_RATES = {
  '1BHK': { essential: 5.5, premium: 7, luxury: 8.5 },
  '2BHK': { essential: 9, premium: 12, luxury: 16 },
  '3BHK': { essential: 15, premium: 18, luxury: 22 },
  '4BHK': { essential: 22, premium: 27, luxury: 35 },
  Kothi: { essential: 22, premium: 27, luxury: 35 },
} as const

export const RESIDENTIAL_PACKAGE_INCLUSIONS = {
  essential: [
    'False ceilings',
    'Lighting and LED panels',
    'Living room wall panel',
    'Modular wardrobe',
    'Modular kitchen (on-site built)',
    'Wallpaper',
  ],
  premium: [
    'False ceilings',
    'Lighting and LED panels',
    'Living room wall panel',
    'Modular wardrobe',
    'Modular kitchen (on-site built)',
    'Wallpaper',
    'Living room furniture',
    'Dining table',
    'Curtains',
    'Modular kitchen (factory-made)',
  ],
  luxury: [
    'False ceilings',
    'Lighting and LED panels',
    'Living room wall panel',
    'Modular wardrobe',
    'Modular kitchen (on-site built)',
    'Wallpaper',
    'Living room furniture',
    'Dining table',
    'Curtains',
    'Modular kitchen (factory-made)',
    'Air conditioning (AC)',
    'Jhumar / chandelier',
    'Wall art',
    'Accessories and decor',
  ],
} as const

export const CONSTRUCTION_RATE_CARD = {
  constructionOnly: {
    minPerSqFt: 1250,
    maxPerSqFt: 1500,
    note: 'Civil and structural scope without interiors.',
  },
  constructionWithInteriors: {
    minPerSqFt: 2000,
    note: 'Construction plus full interiors as per brief and finish selection.',
  },
} as const

export type ResidentialHomeType = keyof typeof RESIDENTIAL_PACKAGE_RATES
export type PackageTier = keyof (typeof RESIDENTIAL_PACKAGE_RATES)['1BHK']

export const BUDGET_RANGE_BASELINES = {
  under_10: { minLakh: 6, maxLakh: 10 },
  '10_25': { minLakh: 10, maxLakh: 25 },
  '25_50': { minLakh: 25, maxLakh: 50 },
  '50_100': { minLakh: 50, maxLakh: 100 },
  above_100: { minLakh: 100, maxLakh: 140 },
} as const

export const FINAL_QUOTE_DISCLAIMER =
  'This is an indicative estimate range. Final quotation is confirmed after detailed discussion and site review by Mohit.'
