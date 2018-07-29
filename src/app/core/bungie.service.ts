import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';

import {AccountStats, BungieProfile, BungieUser} from './bungie.model';
import {CoreModule} from './core.module';

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

  searchUser(user: string | Observable<string>): Observable<any> {
    return (typeof user === 'string') ?
      this.http.get<any>(`${api}/Platform/User/SearchUsers/?q=${user}`) :
      user.pipe(
        debounceTime(400),
        switchMap(term => this.http.get<any>(`${api}/Platform/User/SearchUsers/?q=${term}`))
      );
  }

  searchPlayer(player: string): Observable<BungieUser[]> {
    const url = `${api}/Platform/Destiny2/SearchDestinyPlayer/${this.platform}/${player}/?components=100`;
    return this.http.get<BungieUser[]>(url);
  }

  getMembershipsById(id: string): Observable<BungieUser[]> {
    const url = `${api}/Platform/User/GetMembershipsById/${id}/${this.platform}`;
    return this.http.get<BungieUser[]>(url);
  }

  getMemberId(player: string): Observable<string> {
    console.log('get member id', player);
    const url = `${api}/d1/platform/Destiny/${this.platform}/Stats/GetMembershipIdByDisplayName/${player}/?components=100`;
    return this.http.get<string>(url);
  }

  getProfile(destinyMembershipId: string): Observable<BungieProfile> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Profile/${destinyMembershipId}/?components=100`;
    return this.http.get<BungieProfile>(url);
  }

  getCharacter(destinyMembershipId: string, characterId): Observable<BungieProfile> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Profile/${destinyMembershipId}/Character/${characterId}/?components=1`;
    return this.http.get<BungieProfile>(url);
  }

  getStats(destinyMembershipId: string): Observable<AccountStats> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Stats/?components=100`;
    return this.http.get<AccountStats>(url);
  }

  getCharacterStats(destinyMembershipId: string, characterId: string): Observable<AccountStats> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Character/${characterId}/Stats/?components=100`;
    return this.http.get<AccountStats>(url);
  }

  getLeaderboards(destinyMembershipId: string): Observable<any> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Stats/Leaderboards?components=100`;
    return this.http.get<any>(url);
  }

  getActivityHistory(destinyMembershipId: string, characterId: string): Observable<any> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Character/${characterId}/Stats/Activities/`;
    return this.http.get<any>(url);
  }

  getDestinyAggregateActivityStats(destinyMembershipId: string, characterId: string): Observable<any> {
    const url = `${api}/Platform/Destiny2/${this.platform}/Account/
    ${destinyMembershipId}/Character/${characterId}/Stats/AggregateActivityStats/`;
    return this.http.get<any>(url);
  }
}
