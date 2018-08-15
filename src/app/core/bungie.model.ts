import {DestinyClassType, MembershipType} from './bungie.enums';

export interface BungieResponse<T> {
  Response: T;
}

export interface UserInfoCard {
  supplementalDisplayName: string;
  iconPath: string;
  membershipType: MembershipType;
  membershipId: string;
  displayName: string;
}

export interface BungieProfile {
  itemComponents: object;
  profile: {
    data: {
      characterIds: string[];
      dateLastPlayed: string;
      userInfo: UserInfoCard;
      versionsOwned: number;
    };
  };
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

export interface DestinyCharacter {
  baseCharacterLevel: number;
  characterId: string;
  classHash: number;
  classType: DestinyClassType;
  dateLastPlayed: string;
  emblemBackgroundPath: string;
  emblemColor: ColorRGBA;
  emblemHash: number;
  emblemPath: string;
  genderHash: number;
  genderType: number; // TODO: create enum
  levelProgression: any; // TODO
  light: number;
  membershipId: string;
  membershipType: MembershipType,
  minutesPlayedThisSession: string;
  minutesPlayedTotal: string;
  percentToNextLevel: number;
  raceHash: number;
  raceType: number; // TODO: create enum
}

export interface DestinyCharacterResponse {
  inventory: {};
  character: {
    data: DestinyCharacter
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
