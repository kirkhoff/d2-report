export enum MembershipType {
  None = 0,
  Xbox = 1,
  PSN = 2,
  Blizzard = 4,
  Demon = 10,
  BungieNext = 254,
  All = -1
}

export enum ActivityMode {
  None = 0,
  Story = 2,
  Strike = 3,
  Raid = 4,
  AllPvP = 5,
  Patrol = 6,
  AllPvE = 7,
  Reserved9 = 9,
  Control = 10,
  Reserved11 = 11,
  Clash = 12,
  Reserved13 = 13,
  Reserved15 = 15,
  Nightfall = 16,
  HeroicNightfall = 17,
  AllStrikes = 18,
  IronBanner = 19,
  Reserved20 = 20,
  Reserved21 = 21,
  Reserved22 = 22,
  Reserved24 = 24,
  Reserved25 = 25,
  Reserved26 = 26,
  Reserved27 = 27,
  Reserved28 = 28,
  Reserved29 = 29,
  Reserved30 = 30,
  Supremacy = 31,
  Reserved32 = 32,
  Survival = 37,
  Countdown = 38,
  TrialsOfTheNine = 39,
  Social = 40,
  TrialsCountdown = 41,
  TrialsSurvival = 42,
  IronBannerControl = 43,
  IronBannerClash = 44,
  IronBannerSupremacy = 45
}

export enum DestinyClassType {
  Titan = 0,
  Hunter = 1,
  Warlock = 2,
  Unknown = 3
}

export enum DestinyComponentType {
  None = 0,
  Profiles = 100,
  VendorReceipts = 101,
  ProfileInventories = 102,
  ProfileCurrencies = 103,
  ProfilePregression = 104,
  Characters = 200,
  CharacterInventories = 201,
  CharacterProgressions = 202,
  CharacterRenderData = 203,
  CharacterActivities = 204,
  CharacterEquipment = 205,
  ItemInstances = 300,
  ItemObjectives = 301,
  ItemPerks = 302,
  ItemRenderData = 303,
  ItemStats = 304,
  ItemSockets = 305,
  ItemTalentGrids = 306,
  ItemCommonData = 307,
  ItemPlugStates = 308,
  Vendors = 400,
  VendorCategories = 401,
  VendorSales = 402,
  Kiosks = 500,
  CurrencyLookups = 600
}

export enum DestinyDefinition {
  Activity = 'DestinyActivityDefinition'
}
