export interface ApplianceItem {
  id: string;
  name: string;
  category: 'cooling' | 'lighting' | 'entertainment' | 'heavy' | 'pumps' | 'office';
  wattage: number; // Watts per unit
  defaultHours: number; // Hours run per day
  defaultQuantity: number;
  iconName: string;
  description: string;
}

export interface ApplianceState {
  appliance: ApplianceItem;
  quantity: number;
  hours: number;
}

export interface CustomAppliance {
  id: string;
  name: string;
  wattage: number;
  quantity: number;
  hours: number;
}

export interface SolarSystemCalculation {
  totalPeakWatts: number;
  totalPeakKW: number;
  dailyEnergyWattHours: number;
  dailyEnergyKWh: number;
  
  // Recommended Sizing
  recommendedInverterKW: number;
  recommendedInverterKVA: number;
  recommendedBatteryKWh: number;
  recommendedBatteryAh48V: number;
  recommendedSolarArrayWp: number;
  recommendedPanelCount550W: number;
  
  // Financial & Fuel Savings Estimation (Ethiopia context)
  estimatedSystemCostETB: number;
  monthlyDieselGenSavingsETB: number;
  annualCO2ReductionKg: number;
}

export interface SolarPackageRecommendation {
  id: string;
  title: string;
  tier: 'economy' | 'recommended' | 'premium';
  inverter: string;
  battery: string;
  panels: string;
  panelCount: number;
  estimatedPriceETB: number;
  suitableKWRange: string;
  features: string[];
  isPopular?: boolean;
}

export const PRESET_APPLIANCES: ApplianceItem[] = [
  {
    id: 'fridge',
    name: 'Refrigerator / Freezer (Inverter/Standard)',
    category: 'cooling',
    wattage: 150,
    defaultHours: 12,
    defaultQuantity: 1,
    iconName: 'Refrigerator',
    description: 'Compressor duty cycle (~150W continuous avg)',
  },
  {
    id: 'tv',
    name: 'LED TV (43"-65") + Satellite Receiver',
    category: 'entertainment',
    wattage: 100,
    defaultHours: 6,
    defaultQuantity: 1,
    iconName: 'Tv',
    description: 'Smart TV, soundbar & decoder',
  },
  {
    id: 'lights',
    name: 'Energy-Saving LED Light Bulbs (10W)',
    category: 'lighting',
    wattage: 10,
    defaultHours: 6,
    defaultQuantity: 6,
    iconName: 'Lightbulb',
    description: 'Indoor & outdoor security lighting',
  },
  {
    id: 'water_pump',
    name: 'Household Water Pump (0.75kW / 1HP)',
    category: 'pumps',
    wattage: 750,
    defaultHours: 2,
    defaultQuantity: 0,
    iconName: 'Waves',
    description: 'Submersible / booster pressure pump',
  },
  {
    id: 'washing_machine',
    name: 'Automatic Washing Machine',
    category: 'heavy',
    wattage: 500,
    defaultHours: 1,
    defaultQuantity: 0,
    iconName: 'WashingMachine',
    description: 'Front or top load motor cycle',
  },
  {
    id: 'fan',
    name: 'Ceiling / Standing Fan',
    category: 'cooling',
    wattage: 60,
    defaultHours: 8,
    defaultQuantity: 1,
    iconName: 'Fan',
    description: 'Multi-speed cooling fan',
  },
  {
    id: 'computer',
    name: 'Laptop / Desktop Computer & Monitor',
    category: 'office',
    wattage: 100,
    defaultHours: 8,
    defaultQuantity: 1,
    iconName: 'Laptop',
    description: 'Workstation, monitor & charging',
  },
  {
    id: 'wifi_cctv',
    name: 'Wi-Fi Router & Security Cameras',
    category: 'office',
    wattage: 40,
    defaultHours: 24,
    defaultQuantity: 1,
    iconName: 'Wifi',
    description: '24/7 continuous network & surveillance',
  },
  {
    id: 'microwave',
    name: 'Microwave Oven / Air Fryer',
    category: 'heavy',
    wattage: 1200,
    defaultHours: 0.5,
    defaultQuantity: 0,
    iconName: 'Microwave',
    description: 'High intermittent heating load',
  },
  {
    id: 'kettle',
    name: 'Electric Kettle / Water Dispenser',
    category: 'heavy',
    wattage: 1500,
    defaultHours: 0.3,
    defaultQuantity: 0,
    iconName: 'Coffee',
    description: 'Instant boiling hot water load',
  },
  {
    id: 'air_conditioner',
    name: 'Inverter Air Conditioner (1.5 HP / 12,000 BTU)',
    category: 'cooling',
    wattage: 1200,
    defaultHours: 4,
    defaultQuantity: 0,
    iconName: 'Wind',
    description: 'Split unit bedroom/lounge climate control',
  },
];

// Average daily solar peak sun hours in Ethiopia (Addis Ababa & surrounding regions)
export const ETHIOPIA_PEAK_SUN_HOURS = 5.2;

// Safety & sizing factors
export const INVERTER_SURGE_SAFETY_FACTOR = 1.25;
export const BATTERY_DEPTH_OF_DISCHARGE = 0.85; // LiFePO4 85% recommended DOD
export const SYSTEM_LOSS_FACTOR = 1.20; // 20% wiring and thermal losses

/**
 * Calculates complete solar sizing based on peak load (kW), daily energy (kWh), and autonomy hours.
 */
export function calculateSolarSizing(
  peakWatts: number,
  dailyWattHours: number,
  autonomyHours: number = 12
): SolarSystemCalculation {
  const clampedPeakWatts = Math.max(peakWatts, 200);
  const clampedDailyWattHours = Math.max(dailyWattHours, 1000);

  const totalPeakKW = Number((clampedPeakWatts / 1000).toFixed(2));
  const dailyEnergyKWh = Number((clampedDailyWattHours / 1000).toFixed(2));

  // Inverter Sizing (kW & kVA with 1.25x headroom)
  const rawInverterKW = (clampedPeakWatts * INVERTER_SURGE_SAFETY_FACTOR) / 1000;
  // Snap to common inverter sizes: 1.5kW, 3.0kW, 5.5kW, 8.0kW, 11.0kW, 15.0kW
  let recommendedInverterKW = 3.0;
  if (rawInverterKW <= 1.5) recommendedInverterKW = 1.5;
  else if (rawInverterKW <= 3.2) recommendedInverterKW = 3.5;
  else if (rawInverterKW <= 5.5) recommendedInverterKW = 5.5;
  else if (rawInverterKW <= 8.2) recommendedInverterKW = 8.0;
  else if (rawInverterKW <= 11.5) recommendedInverterKW = 11.0;
  else recommendedInverterKW = Math.ceil(rawInverterKW);

  const recommendedInverterKVA = Number((recommendedInverterKW * 1.1).toFixed(1));

  // Battery Storage Sizing
  // Fraction of energy needed during night / off-sun hours
  const nightFraction = Math.min(autonomyHours / 24, 1.0);
  const nightEnergyKWh = dailyEnergyKWh * nightFraction;
  const rawBatteryKWh = (nightEnergyKWh * SYSTEM_LOSS_FACTOR) / BATTERY_DEPTH_OF_DISCHARGE;
  
  // Snap to common battery sizes (2.56kWh, 5.12kWh, 10.24kWh, 15.36kWh, 20.48kWh)
  let recommendedBatteryKWh = 5.12;
  if (rawBatteryKWh <= 2.8) recommendedBatteryKWh = 2.56;
  else if (rawBatteryKWh <= 5.5) recommendedBatteryKWh = 5.12;
  else if (rawBatteryKWh <= 10.8) recommendedBatteryKWh = 10.24;
  else if (rawBatteryKWh <= 16.0) recommendedBatteryKWh = 15.36;
  else recommendedBatteryKWh = Number((Math.ceil(rawBatteryKWh / 5.12) * 5.12).toFixed(2));

  const recommendedBatteryAh48V = Math.round((recommendedBatteryKWh * 1000) / 48);

  // Solar PV Array Sizing
  // Daily generation needed + charging loss factor
  const dailyGenerationNeeded = clampedDailyWattHours * SYSTEM_LOSS_FACTOR;
  const requiredArrayWatts = dailyGenerationNeeded / ETHIOPIA_PEAK_SUN_HOURS;
  const panelCount550W = Math.max(Math.ceil(requiredArrayWatts / 550), 2);
  const recommendedSolarArrayWp = panelCount550W * 550;

  // Estimated System Cost in ETB (Panels ~18.5k ETB, Inverter ~95k ETB for 5.5kW, Battery ~165k ETB for 5.12kWh)
  const panelCost = panelCount550W * 18500;
  const inverterCost = (recommendedInverterKW / 5.5) * 95000;
  const batteryCost = (recommendedBatteryKWh / 5.12) * 165000;
  const balanceOfSystemAndInstallation = 25000 + panelCount550W * 1200;
  const estimatedSystemCostETB = Math.round(panelCost + inverterCost + batteryCost + balanceOfSystemAndInstallation);

  // Monthly Diesel Savings (assuming diesel generator fuel at ~110 ETB/Liter, 0.4L/kWh)
  const monthlyKWh = dailyEnergyKWh * 30;
  const litersSavedMonthly = monthlyKWh * 0.35;
  const monthlyDieselGenSavingsETB = Math.round(litersSavedMonthly * 115);

  // Annual CO2 reduction (approx 0.75 kg CO2 / kWh solar vs thermal grid/diesel)
  const annualCO2ReductionKg = Math.round(dailyEnergyKWh * 365 * 0.75);

  return {
    totalPeakWatts: Math.round(clampedPeakWatts),
    totalPeakKW,
    dailyEnergyWattHours: Math.round(clampedDailyWattHours),
    dailyEnergyKWh,
    recommendedInverterKW,
    recommendedInverterKVA,
    recommendedBatteryKWh,
    recommendedBatteryAh48V,
    recommendedSolarArrayWp,
    recommendedPanelCount550W: panelCount550W,
    estimatedSystemCostETB,
    monthlyDieselGenSavingsETB,
    annualCO2ReductionKg,
  };
}

/**
 * Returns pre-configured matched solar packages based on user load calculation.
 */
export function getMatchedSolarPackages(calc: SolarSystemCalculation): SolarPackageRecommendation[] {
  const kw = calc.totalPeakKW;

  // 1. Essential / Starter Kit
  const economyPanels = Math.max(Math.round(calc.recommendedPanelCount550W * 0.75), 2);
  const economyKWh = calc.recommendedBatteryKWh <= 5.12 ? 2.56 : 5.12;
  const economyInverter = calc.recommendedInverterKW <= 3.5 ? '3.2kVA (24V) Pure Sine Inverter' : '5.5kVA (48V) Hybrid Inverter';
  const economyPrice = Math.round(calc.estimatedSystemCostETB * 0.72);

  // 2. Recommended Hybrid Kit
  const recommendedPanels = calc.recommendedPanelCount550W;
  const recommendedKWh = calc.recommendedBatteryKWh;
  const recommendedInverter = `${calc.recommendedInverterKW}kW / ${calc.recommendedInverterKVA}kVA 48V Hybrid Inverter`;
  const recommendedPrice = calc.estimatedSystemCostETB;

  // 3. Heavy-Duty Pro / Off-Grid Kit
  const proPanels = calc.recommendedPanelCount550W + 2;
  const proKWh = Number((calc.recommendedBatteryKWh * 1.5).toFixed(2));
  const proInverter = `${Math.ceil(calc.recommendedInverterKW * 1.3)}kW Heavy-Duty Smart Hybrid Inverter`;
  const proPrice = Math.round(calc.estimatedSystemCostETB * 1.38);

  return [
    {
      id: 'pkg-economy',
      title: 'Essential Solar Backup Package',
      tier: 'economy',
      inverter: economyInverter,
      battery: `${economyKWh} kWh Deep-Cycle Storage`,
      panels: `${economyPanels}x 550W Tier-1 N-Type (${economyPanels * 550}Wp)`,
      panelCount: economyPanels,
      estimatedPriceETB: economyPrice,
      suitableKWRange: `Up to ${Math.max(Number((kw * 0.8).toFixed(1)), 1.5)} kW Peak Load`,
      features: [
        'Essential daytime & evening backup',
        'Automatic power transfer during outages',
        'LCD status & battery monitoring',
        'Complete mounting brackets & DC cables',
      ],
    },
    {
      id: 'pkg-recommended',
      title: 'Full Household Hybrid Solar Kit',
      tier: 'recommended',
      isPopular: true,
      inverter: recommendedInverter,
      battery: `${recommendedKWh} kWh LiFePO4 Lithium Bank`,
      panels: `${recommendedPanels}x 550W Tier-1 Monocrystalline (${calc.recommendedSolarArrayWp}Wp)`,
      panelCount: recommendedPanels,
      estimatedPriceETB: recommendedPrice,
      suitableKWRange: `Matched for your exact ${kw} kW / ${calc.dailyEnergyKWh} kWh Load`,
      features: [
        '24/7 Zero-interruption uninterrupted power',
        'High-efficiency Tier-1 TOPCon solar panels',
        '6,000+ cycle long-life LiFePO4 battery',
        'Dual AC output & smart generator control',
        'Full Sebrin Trading warranty & local support',
      ],
    },
    {
      id: 'pkg-premium',
      title: 'Heavy-Duty Commercial / Off-Grid Master Kit',
      tier: 'premium',
      inverter: proInverter,
      battery: `${proKWh} kWh High-Capacity Lithium Pack`,
      panels: `${proPanels}x 550W Tier-1 Panels (${proPanels * 550}Wp Array)`,
      panelCount: proPanels,
      estimatedPriceETB: proPrice,
      suitableKWRange: `Heavy Continuous ${Number((kw * 1.4).toFixed(1))} kW Capacity`,
      features: [
        'Extended multi-day rainy weather autonomy',
        'High surge capacity for AC & commercial pumps',
        'Smart BMS with mobile app Wi-Fi monitoring',
        'Surge arrestors, DC breakers & earthing included',
        'Turnkey professional commissioning available',
      ],
    },
  ];
}

/**
 * Builds WhatsApp message prefilled with sizing results.
 */
export function buildWhatsAppSizingMessage(
  calc: SolarSystemCalculation,
  selectedPackage?: SolarPackageRecommendation
): string {
  let text = `Hello Sebrin Trading PLC,\n\n`;
  text += `I used your Solar Sizing Calculator (FR-2) on your website with the following requirements:\n\n`;
  text += `⚡ Peak Continuous Load: ${calc.totalPeakKW} kW (${calc.totalPeakWatts} W)\n`;
  text += `🔋 Daily Energy Demand: ${calc.dailyEnergyKWh} kWh/day\n`;
  text += `🔌 Recommended Inverter: ${calc.recommendedInverterKW} kW (${calc.recommendedInverterKVA} kVA)\n`;
  text += `📦 Recommended Battery Storage: ${calc.recommendedBatteryKWh} kWh LiFePO4\n`;
  text += `☀️ Recommended Solar Array: ${calc.recommendedPanelCount550W}x 550W Panels (${calc.recommendedSolarArrayWp} Wp)\n\n`;

  if (selectedPackage) {
    text += `Interested in Package: *${selectedPackage.title}* (Est. ${selectedPackage.estimatedPriceETB.toLocaleString()} ETB)\n\n`;
  }

  text += `Please send me a formal quotation and product availability. Thank you!`;
  return encodeURIComponent(text);
}
