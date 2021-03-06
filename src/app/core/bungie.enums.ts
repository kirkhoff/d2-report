export enum BungieErrorCode {
  Success = 1,
  WebAuthRequired = 99
}

export enum MembershipType {
  None = 0,
  Xbox = 1,
  PSN = 2,
  Blizzard = 4,
  Demon = 10,
  BungieNext = 254,
  All = -1
}

export enum FireteamActivityType {
  All = 0,
  Raid = 1,
  Crucible = 2,
  Trials = 3,
  Nightfall = 4,
  Anything = 5,
}

export enum FireteamDateRange {
  All = 0,
  Now = 1,
  TwentyFourHours = 2,
  FortyEightHours = 3,
  ThisWeek = 4
}

export enum FireteamPlatform {
  Unknown = 0,
  Playstation4 = 1,
  XboxOne = 2,
  Blizzard = 3
}

export enum FireteamSlotSearch {
  NoSlotRestriction = 0,
  HasOpenPlayerSlots = 1,
  HasOpenPlayerOrAltSlots = 2
}

export enum DestinyActivityModeType {
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
  CrimsonDoubles = 15,
  Nightfall = 16,
  HeroicNightfall = 17,
  AllStrikes = 18,
  IronBanner = 19,
  Reserved20 = 20,
  Reserved21 = 21,
  Reserved22 = 22,
  Reserved24 = 24,
  AllMayhem = 25,
  Reserved26 = 26,
  Reserved27 = 27,
  Reserved28 = 28,
  Reserved29 = 29,
  Reserved30 = 30,
  Supremacy = 31,
  PrivateMatchesAll = 32,
  Survival = 37,
  Countdown = 38,
  TrialsOfTheNine = 39,
  Social = 40,
  TrialsCountdown = 41,
  TrialsSurvival = 42,
  IronBannerControl = 43,
  IronBannerClash = 44,
  IronBannerSupremacy = 45,
  ScoredNightfall = 46,
  ScoredHeroicNightfall = 47,
  Rumble = 48,
  AllDoubles = 49,
  Doubles = 50,
  PrivateMatchesClash = 50,
  PrivateMatchesControl = 51,
  PrivateMatchesSupremecy = 52,
  PrivateMatchesCountdown = 54,
  PrivateMatchesSurvival = 55,
  PrivateMatchesMayhem = 56,
  PrivateMatchesRumble = 57,
  HeroicAdventure = 58,
  Showdown = 59,
  Lockdown = 60,
  Scorched = 61,
  ScorchedTeam = 62,
  Gambit = 63,
  AllPvECompetitive = 64
}

export enum DestinyRace {
  Human = 0,
  Awoken = 1,
  Exo = 2,
  Unknown = 3
}

export enum DestinyGender {
  Male = 0,
  Female = 1,
  Unknown = 2
}

export enum DestinyClass {
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
  ProfileProgression = 104,
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
  Activity = 'DestinyActivityDefinition',
  Progression = 'DestinyProgressionDefinition'
}

export enum ProgressionHash {
  GloryRank = 2679551909
}

export enum ComponentPrivacySetting {
  None = 0,
  Public = 1,
  PRivate = 2
}

export enum BucketScope {
  Character = 0,
  Account = 1
}

export enum BucketCategory {
  Invisible = 0,
  Item = 1,
  Currency = 2,
  Equippable = 3,
  Ignored = 4
}

export enum ItemLocation {
  Unknown = 0,
  Inventory = 1,
  Vault = 2,
  Vendor = 3,
  Postmaster = 4
}

export enum DamageType {
  None = 0,
  Kinetic = 1,
  Arc = 2,
  Thermal = 3,
  Void = 4,
  Raid = 5
}

export enum DestinyItemSubType {
  None = 0,
  AutoRifle = 6,
  Shotgun = 7,
  Machinegun = 8,
  HandCannon = 9,
  RocketLauncher = 10,
  FusionRifle = 11,
  SniperRifle = 12,
  PulseRifle = 13,
  ScoutRifle = 14,
  Sidearm = 17,
  Sword = 18,
  FusionRifleLine = 22,
  GrenadeLauncher = 23,
  SubmachineGun = 24,
  TraceRifle = 25,
  HelmetArmor = 26,
  GauntletsArmor = 27,
  ChestArmor = 28,
  LegArmor = 29,
  ClassArmor = 30,
  Bow = 31
}
