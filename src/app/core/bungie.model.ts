export interface BungieResponse<T> {
  Response: T;
}

export interface BungieUser {
  membershipType: number;
  membershipId: string;
  displayName: string;
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
