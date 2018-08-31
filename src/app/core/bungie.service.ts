import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';

import {
  AccountStats,
  DestinyProfileResponse,
  DestinyCharacterResponse,
  PostGameCarnageReportData,
  SearchResultOfFireteamSummary,
  UserInfoCard
} from './bungie.model';
import {CoreModule} from './core.module';
import {
  DestinyComponentType,
  FireteamActivityType,
  FireteamDateRange,
  FireteamPlatform,
  FireteamSlotSearch,
  MembershipType
} from './bungie.enums';

export const bungie = 'https://www.bungie.net';

@Injectable({
  providedIn: CoreModule
})
export class BungieService {
  platform: MembershipType = MembershipType.All;

  constructor(private http: HttpClient) {
    this.platform = MembershipType.PSN; // TODO: Allow the user to choose their own platform
  }

  private getQueryString(options: {}): string {
    if (!options) {
      return '';
    }
    const params = new URLSearchParams();
    Object.keys(options).forEach(key => params.set(key, options[key]));
    return `?${params.toString()}`;
  }

  // Forum endpoints

  joinFireteamThread(topicId: number): Observable<any> {
    const url = `${bungie}/Platform/Forum/Recruit/Join/${topicId}/`;
    return this.http.post<any>(url, null);
  }

  // Fireteam endpoints

  searchPublicAvailableClanFireteams(platform: FireteamPlatform, activityType: FireteamActivityType, dateRange: FireteamDateRange, slotFilter: FireteamSlotSearch, page: number): Observable<SearchResultOfFireteamSummary> {
    const url = `${bungie}/Platform/Fireteam/Search/Available/${platform}/${activityType}/${dateRange}/${slotFilter}/${page}/`;
    return this.http.get<SearchResultOfFireteamSummary>(url);
  }

  // User endpoints

  searchUser(user: string | Observable<string>): Observable<any> {
    return (typeof user === 'string') ?
      this.http.get<any>(`${bungie}/Platform/User/SearchUsers/?q=${user}`) :
      user.pipe(
        debounceTime(400),
        switchMap(term => this.http.get<any>(`${bungie}/Platform/User/SearchUsers/?q=${term}`))
      );
  }

  // Destiny 2 endpoints

  getManifest(): Observable<any> {
    const url = `${bungie}/Platform/Destiny2/Manifest/`;
    return this.http.get<any>(url);
  }

  getEntityDefinition(entityType: string, hashIdentifier: string): Observable<any> {
    const url = `${bungie}/Platform/Destiny2/Manifest/${entityType}/${hashIdentifier}/`;
    return this.http.get<any>(url);
  }

  searchPlayer(player: string): Observable<UserInfoCard[]> {
    const url = `${bungie}/Platform/Destiny2/SearchDestinyPlayer/${this.platform}/${player}/?components=100`;
    return this.http.get<UserInfoCard[]>(url);
  }

  getMembershipsById(id: string): Observable<UserInfoCard[]> {
    const url = `${bungie}/Platform/User/GetMembershipsById/${id}/${this.platform}`;
    return this.http.get<UserInfoCard[]>(url);
  }

  getMemberId(player: string): Observable<string> {
    const url = `${bungie}/d1/platform/Destiny/${this.platform}/Stats/GetMembershipIdByDisplayName/${player}/?components=100`;
    return this.http.get<string>(url).pipe();
  }

  getProfile(destinyMembershipId: string, options = { components: [DestinyComponentType.Profiles] }): Observable<DestinyProfileResponse> {
    const url = `${bungie}/Platform/Destiny2/${this.platform}/Profile/${destinyMembershipId}/${this.getQueryString(options)}`;
    return this.http.get<DestinyProfileResponse>(url);
  }

  getCharacter(destinyMembershipId: string, characterId: string, options?: any): Observable<DestinyCharacterResponse> {
    const url = `${bungie}/Platform/Destiny2/${this.platform}/Profile/${destinyMembershipId}/Character/${characterId}/${this.getQueryString(options)}`;
    return this.http.get<DestinyCharacterResponse>(url);
  }

  getPostGameCarnageReport(activityId: string): Observable<PostGameCarnageReportData> {
    const url = `${bungie}/Platform/Destiny2/Stats/PostGameCarnageReport/${activityId}/`;
    return this.http.get<PostGameCarnageReportData>(url);
  }

  getHistoricalStats(destinyMembershipId: string, characterId: string, options?: any): Observable<any> {
    const url = `${bungie}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Character/${characterId}/Stats/${this.getQueryString(options)}`;
    return this.http.get<any>(url);
  }

  getHistoricalStatsForAccount(destinyMembershipId: string): Observable<AccountStats> {
    const url = `${bungie}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Stats/?components=${DestinyComponentType.Profiles}`;
    return this.http.get<AccountStats>(url);
  }

  getCharacterStats(destinyMembershipId: string, characterId: string): Observable<AccountStats> {
    const url = `${bungie}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Character/${characterId}/Stats/?components=${DestinyComponentType.Characters}`;
    return this.http.get<AccountStats>(url);
  }

  getLeaderboards(destinyMembershipId: string): Observable<any> {
    const url = `${bungie}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Stats/Leaderboards?components=${DestinyComponentType.Profiles}`;
    return this.http.get<any>(url);
  }

  getActivityHistory(destinyMembershipId: string, characterId: string, mode?: string | number): Observable<any> {
    const q = mode !== undefined ? `?mode=${mode}` : '';
    const url = `${bungie}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Character/${characterId}/Stats/Activities/${q}`;
    return this.http.get<any>(url);
  }

  getDestinyAggregateActivityStats(destinyMembershipId: string, characterId: string): Observable<any> {
    const url = `${bungie}/Platform/Destiny2/${this.platform}/Account/${destinyMembershipId}/Character/${characterId}/Stats/AggregateActivityStats/`;
    return this.http.get<any>(url);
  }
}
