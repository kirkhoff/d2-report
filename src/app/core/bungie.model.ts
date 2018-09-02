import {DestinyClass, FireteamActivityType, FireteamPlatform, MembershipType} from './bungie.enums';

export interface BungieResponse<T> {
  ErrorCode: number;
  ErrorStatus: string;
  Response: T;
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
  itemComponents: any;
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
  inventory: {};
  character: {
    data: DestinyCharacterComponent
  };
  progressions: {};
  renderData: {};
  activities: {};
  equipment: {};
  kiosks: {};
  itemComponents: {};
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
