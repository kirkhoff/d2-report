import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { AccountStats, BungieProfile, BungieResponse, BungieUser } from './bungie.model';
import { CoreModule } from './core.module';

const api = 'https://www.bungie.net';

enum Platform {
  None = 0,
  Xbox = 1,
  PSN = 2,
  Blizzard = 4,
  Demon = 10,
  BungieNext = 254,
  All = -1
}

@Injectable({
  providedIn: CoreModule
})
export class BungieService {
  platform: Platform = Platform.All;

  constructor(private http: HttpClient) {
    this.platform = Platform.PSN; // TODO: Allow the user to choose their own platform
  }

  searchPlayer(player: string): Observable<BungieResponse<BungieUser>> {
    const url = `${api}/Platform/Destiny2/SearchDestinyPlayer/${this.platform}/${player}/`;
    return this.http.get<any>(url);
  }

  getMemberId(player: string): Observable<string> {
    const url = `${api}/d1/platform/Destiny/${this.platform}/Stats/GetMembershipIdByDisplayName/${player}/`;
    return this.http.get<BungieResponse<string>>(url).pipe(
      map(({ Response }) => Response)
    );
  }

  getProfile(destinyMembershipId: string): Observable<BungieProfile> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Profile/${destinyMembershipId}/?components=100`;
    return this.http.get<BungieResponse<BungieProfile>>(url).pipe(
      map(({ Response }) => Response)
    );
  }

  getStats(destinyMembershipId: string): Observable<AccountStats> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Stats/?components=100`;
    return this.http.get<BungieResponse<AccountStats>>(url).pipe(
      map(({ Response }) => Response)
    );
  }

  getLeaderboards(destinyMembershipId: string): Observable<any> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Stats/Leaderboards?components=100`;
    return this.http.get<any>(url);
  }
}
