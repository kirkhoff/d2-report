import {ComponentPrivacySetting, DestinyClass, FireteamActivityType, FireteamPlatform, ItemLocation, MembershipType} from './bungie.enums';

export interface BungieResponse<T> {
  ErrorCode: number;
  ErrorStatus: string;
  Response: T;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  membership_id: string;
}

// User

export interface UserMembershipData {
  destinyMemberships: UserInfoCard[];
  bungieNetUser: GeneralUser;
}

export interface GeneralUser {
  membershipId: number;
  uniqueName: string;
  normalizedName: string;
  displayName: string;
  profilePicture: number;
  profileTheme: number;
  userTitle: number;
  successfulMessageFlags: number;
  isDeleted: boolean;
  about: string;
  firstAccess?: string;
  lastUpdate?: string;
  psnDisplayName: string;
  xboxDisplayName: string;
  fbDisplayName: string;
  showActivity?: boolean;
  locale: string;
  profilePicturePath: string;
  profilePictureWidePath: string;
  profileThemeName: string;
  statusText: string;
  statusDate: string;
  profileBanExpire: string;
  blizzardDisplayName: string;
}

export interface UserInfoCard {
  supplementalDisplayName: string;
  iconPath: string;
  membershipType: MembershipType;
  membershipId: string;
  displayName: string;
}

export interface DestinyProfileResponse {
  characters: {
    data: {
      [character: number]: DestinyCharacterComponent;
    }
  };
  itemComponents: {
    instances: {
      data: {
        [itemInstanceId: number]: DestinyItemInstanceComponent;
      }
    }
  };
  profileInventory: {
    data: {
      items: DestinyItemComponent[];
    }
  };
  characterEquipment: {
    data: {
      [characterId: number]: {
        items: DestinyItemComponent[];
      };
    };
  };
  characterInventories: {
    data: {
      [characterId: number]: {
        items: DestinyItemComponent[];
      };
    };
  };
  profile: {
    data: {
      characterIds: string[];
      dateLastPlayed: string;
      userInfo: UserInfoCard;
      versionsOwned: number;
    };
  };
  characterProgressions: any; // TODO
}

export interface DestinyItemResponse {
  characterId: number;
  item: any;
  instance: {
    data: DestinyItemInstanceComponent;
    privacy: ComponentPrivacySetting;
  };
  objectives: any;
  perks: any;
  renderData: any;
  stats: any;
  talentGrid: any;
  sockets: any;
}

export interface DestinyItemComponent {
  itemHash: number;
  itemInstanceId: number;
  quantity: number;
  bindStatus: any;
  location: ItemLocation;
  bucketHash: number;
  transferStatus: any;
  lockable: boolean;
  state: any;
}

export interface DestinyItemInstanceComponent {
  damageType: any;
  damageTypeHash: number;
  primaryStat: any;
  itemLevel: number;
  quality: number;
  isEquipped: boolean;
  canEquip: boolean;
  equipRequiredLevel: number;
  unlockHashesRequiredToEquip: number[];
  cannotEquipReason: any;
}

export interface AccountStats {
  characters: any[];
  mergedAllCharacters: {
    merged: any;
    results: {
      allPvE: any;
      allPvP: {
        allTime: {
          killsDeathsRatio: {
            basic: {
              value: number;
              displayValue: string;
            };
          };
        };
      };
    };
  };
}

export interface ColorRGBA {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export interface DestinyCharacterComponent {
  baseCharacterLevel: number;
  characterId: string;
  classHash: number;
  classType: DestinyClass;
  dateLastPlayed: string;
  emblemBackgroundPath: string;
  emblemColor: ColorRGBA;
  emblemHash: number;
  emblemPath: string;
  genderHash: number;
  genderType: number; // TODO: create enum
  levelProgression: DestinyProgression;
  light: number;
  membershipId: string;
  membershipType: MembershipType,
  minutesPlayedThisSession: string;
  minutesPlayedTotal: string;
  percentToNextLevel: number;
  raceHash: number;
  raceType: number; // TODO: create enum
}

export interface DestinyProgression {
  progressionHash: number;
  dailyProgress: number;
  dailyLimit: number;
  weeklyProgress: number;
  weeklyLimit: number;
  currentProgress: number;
  level: number;
  levelCap: number;
  stepIndex: number;
  progressToNextLevel: number;
  nextLevelAt: number;
}

export interface DestinyCharacterResponse {
  inventory: {
    data: {
      items: DestinyItemComponent[];
    };
    privacy: number;
  };
  character: {
    data: DestinyCharacterComponent
    privacy: number;
  };
  progressions: {};
  renderData: {};
  activities: {};
  equipment: {
    data: {
      items: DestinyItemComponent[];
    };
    privacy: number;
  };
  kiosks: {};
  itemComponents: {
    instances: {
      data: {
        [itemInstanceId: number]: DestinyItemInstanceComponent;
      }
    }
  };
}

export interface HistoricalStatsValuePair {
  value: number;
  displayValue: string;
}

export interface HistoricalStats {
  statId: string;
  basic: HistoricalStatsValuePair;
  pga: HistoricalStatsValuePair;
  weighted: HistoricalStatsValuePair;
  activityId: number;
}

export interface Player {
  destinyUserInfo: UserInfoCard;
  characterClass: string;
  characterLevel: number;
  lightLevel: number;
  bungieNetUserInfo: UserInfoCard;
  clanName: string;
  clanTag: string;
  emblemHash: number;
  genderHash: number;
  classHash: number;
  raceHash: number;
}

export interface PostGameCarnageEntry {
  standing: number;
  score: HistoricalStats;
  player: Player;
  characterId: string;
  values: any; // TODO
}

export interface PostGameCarnageReportData {
  period: string;
  activityDetails: any; // TODO
  entries: PostGameCarnageEntry[];
  teams: any[]; // TODO
}

// Fireteam

export interface PagedQuery {
  itemsPerPage: number;
  currentPage: number;
  requestContinuationToken: string;
}

export interface FireteamSummary {
  fireteamId: number;
  groupId: number;
  platform: FireteamPlatform;
  activityType: FireteamActivityType;
  isImmediate: boolean;
  scheduledTime?: string;
  ownerMembershipId: number;
  playerSlotCount: number;
  alternateSlotCount?: number;
  availablePlayerSlotCount: number;
  availableAlternateSlotCount: number;
  title: string;
  dateCreated: string;
  dateModified?: string;
  isPublic: boolean;
  locale: string;
  isValid: boolean;
  datePlayerModified: string;
}

export interface SearchResultOfFireteamSummary {
  results: FireteamSummary[];
  totalResults: number;
  hasMore: boolean;
  query: PagedQuery;
  replacementContinuationToken: string;
  useTotalResults: boolean;
}
