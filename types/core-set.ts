// ICF Core Set Types
export interface ICFCoreSet {
  id: string
  name: string
  description: string
  healthCondition: string
  version: string
  domains: {
    b?: string[] // Body Functions codes
    s?: string[] // Body Structures codes
    d: string[]  // Activities & Participation codes (required)
    e?: string[] // Environmental Factors codes
  }
  items: string[] // Assessment item IDs included in this core set
}

export interface CoreSetSelection {
  coreSetId: string
  selectedAt: string
  notes?: string
}

// Common ICF Core Sets
export const COMMON_CORE_SETS: ICFCoreSet[] = [
  {
    id: 'stroke',
    name: '뇌졸중 (Stroke)',
    description: '뇌졸중 환자를 위한 ICF Core Set',
    healthCondition: 'Stroke',
    version: '1.0',
    domains: {
      b: ['b130', 'b140', 'b144', 'b152', 'b164', 'b167', 'b210', 'b280'],
      s: ['s110', 's120', 's730'],
      d: ['d230', 'd240', 'd310', 'd315', 'd330', 'd350', 'd360', 'd410', 'd415', 'd420', 'd430', 'd450', 'd455', 'd460', 'd465', 'd470', 'd475', 'd510', 'd520', 'd530', 'd540', 'd550', 'd560', 'd570', 'd620', 'd630', 'd640', 'd650', 'd660', 'd710', 'd720', 'd730', 'd740', 'd750', 'd760', 'd770', 'd850', 'd860', 'd870', 'd910', 'd920', 'd930'],
      e: ['e110', 'e115', 'e120', 'e125', 'e130', 'e135', 'e140', 'e150', 'e155', 'e165', 'e225', 'e240', 'e250', 'e260', 'e310', 'e320', 'e325', 'e330', 'e340', 'e355', 'e360', 'e410', 'e420', 'e425', 'e430', 'e440', 'e450', 'e455', 'e460', 'e465', 'e510', 'e515', 'e520', 'e525', 'e530', 'e535', 'e540', 'e545', 'e550', 'e555', 'e560', 'e570', 'e575', 'e580', 'e585', 'e590', 'e595']
    },
    items: []
  },
  {
    id: 'low-back-pain',
    name: '만성 허리 통증 (Chronic Low Back Pain)',
    description: '만성 허리 통증 환자를 위한 ICF Core Set',
    healthCondition: 'Chronic Low Back Pain',
    version: '1.0',
    domains: {
      b: ['b130', 'b134', 'b140', 'b152', 'b280', 'b455'],
      s: ['s760', 's770'],
      d: ['d230', 'd240', 'd410', 'd415', 'd420', 'd430', 'd450', 'd455', 'd460', 'd465', 'd470', 'd475', 'd510', 'd520', 'd530', 'd540', 'd550', 'd560', 'd570', 'd620', 'd630', 'd640', 'd650', 'd660', 'd710', 'd720', 'd730', 'd740', 'd750', 'd760', 'd770', 'd850', 'd860', 'd870', 'd910', 'd920', 'd930'],
      e: ['e110', 'e115', 'e120', 'e125', 'e150', 'e155', 'e225', 'e250', 'e260', 'e310', 'e320', 'e325', 'e330', 'e340', 'e355', 'e360', 'e410', 'e420', 'e425', 'e430', 'e440', 'e450', 'e455', 'e460', 'e465', 'e510', 'e515', 'e520', 'e525', 'e530', 'e535', 'e540', 'e545', 'e550', 'e555', 'e560', 'e570', 'e575', 'e580', 'e585', 'e590', 'e595']
    },
    items: []
  },
  {
    id: 'osteoarthritis',
    name: '퇴행성 관절염 (Osteoarthritis)',
    description: '퇴행성 관절염 환자를 위한 ICF Core Set',
    healthCondition: 'Osteoarthritis',
    version: '1.0',
    domains: {
      b: ['b130', 'b134', 'b140', 'b152', 'b280', 'b455', 'b710', 'b715', 'b720', 'b730', 'b735'],
      s: ['s730', 's740', 's750', 's760', 's770'],
      d: ['d230', 'd240', 'd410', 'd415', 'd420', 'd430', 'd450', 'd455', 'd460', 'd465', 'd470', 'd475', 'd510', 'd520', 'd530', 'd540', 'd550', 'd560', 'd570', 'd620', 'd630', 'd640', 'd650', 'd660', 'd710', 'd720', 'd730', 'd740', 'd750', 'd760', 'd770', 'd850', 'd860', 'd870', 'd910', 'd920', 'd930'],
      e: ['e110', 'e115', 'e120', 'e125', 'e150', 'e155', 'e225', 'e250', 'e260', 'e310', 'e320', 'e325', 'e330', 'e340', 'e355', 'e360', 'e410', 'e420', 'e425', 'e430', 'e440', 'e450', 'e455', 'e460', 'e465', 'e510', 'e515', 'e520', 'e525', 'e530', 'e535', 'e540', 'e545', 'e550', 'e555', 'e560', 'e570', 'e575', 'e580', 'e585', 'e590', 'e595']
    },
    items: []
  },
  {
    id: 'generic',
    name: '일반 (Generic)',
    description: '일반적인 평가를 위한 기본 Core Set',
    healthCondition: 'Generic',
    version: '1.0',
    domains: {
      d: ['d450', 'd455', 'd460', 'd510', 'd520', 'd550', 'd710', 'd720']
    },
    items: []
  }
]




