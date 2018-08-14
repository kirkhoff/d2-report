import {DestinyClassType, MembershipType} from './bungie.enums';

export interface BungieResponse<T> {
  Response: T;
}

export interface BungieUser {
  membershipType: number;
  membershipId: string;
  displayName: string;
  iconPath: string;
}

export interface BungieProfile {
  itemComponents: object;
  profile: {
    data: {
      characterIds: string[];
      dateLastPlayed: string;
      userInfo: BungieUser;
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
