import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';

import {
  AccountStats,
  DestinyCharacterResponse,
  DestinyItemResponse,
  DestinyProfileResponse,
  GeneralUser,
  PostGameCarnageReportData,
  SearchResultOfFireteamSummary,
  UserInfoCard,
  UserMembershipData
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
import {DestinyInventoryItemDefinition} from './manifest.model';

export const bungie = 'https://www.bungie.net';

@Injectable({
  providedIn: CoreModule
})
export class BungieService {
  membershipId: string;
  membershipId$ = new ReplaySubject<string>();
  private _membershipType: MembershipType;

  constructor(private http: HttpClient) {
    const membershipTypeStorageValue = localStorage.getItem('membershipType');
    this._membershipType = membershipTypeStorageValue ? parseInt(membershipTypeStorageValue, 10) : MembershipType.All;
    this.membershipId$.subscribe(id => this.membershipId = id);
  }

  private getQueryString(options: {}): string {
    if (!options) {
      return '';
    }
    const params = new URLSearchParams();
    Object.keys(options).forEach(key => params.set(key, options[key]));
    return `?${params.toString()}`;
  }

  set membershipType(value: MembershipType) {
    localStorage.setItem('membershipType', value.toString());
    this._membershipType = value;
  }

  get membershipType(): MembershipType {
    return this._membershipType;
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

  getBungieNetUserById(id: number | string): Observable<GeneralUser> {
    const url = `${bungie}/Platform/User/GetBungieNetUserById/${id}/`;
    return this.http.get<GeneralUser>(url);
  }

  getMembershipDataById(membershipId: number | string): Observable<UserMembershipData> {
    const url = `${bungie}/Platform/User/GetMembershipsById/${membershipId}/${this._membershipType}/`;
    return this.http.get<UserMembershipData>(url);
  }

  getMembershipsForCurrentUser(): Observable<UserMembershipData> {
    const url = `${bungie}/Platform/User/GetMembershipsForCurrentUser/`;
    return this.http.get<UserMembershipData>(url);
  }

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

  getDestinyEntityDefinition(entityType: string, hashIdentifier: number): Observable<DestinyInventoryItemDefinition> {
    const url = `${bungie}/Platform/Destiny2/Manifest/${entityType}/${hashIdentifier}/`;
    return this.http.get<DestinyInventoryItemDefinition>(url);
  }

  searchPlayer(player: string, membershipType = this.membershipType): Observable<UserInfoCard[]> {
    const url = `${bungie}/Platform/Destiny2/SearchDestinyPlayer/${membershipType}/${player}/?components=100`;
    return this.http.get<UserInfoCard[]>(url);
  }

  getMembershipsById(id: string): Observable<UserInfoCard[]> {
    const url = `${bungie}/Platform/User/GetMembershipsById/${id}/${this._membershipType}`;
    return this.http.get<UserInfoCard[]>(url);
  }

  getMemberId(player: string): Observable<string> {
    const url = `${bungie}/d1/platform/Destiny/${this._membershipType}/Stats/GetMembershipIdByDisplayName/${player}/?components=100`;
    return this.http.get<string>(url).pipe();
  }

  getProfile(destinyMembershipId: string, options = { components: [DestinyComponentType.Profiles] }, membershipType = this.membershipType): Observable<DestinyProfileResponse> {
    const url = `${bungie}/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/${this.getQueryString(options)}`;
    return this.http.get<DestinyProfileResponse>(url);
  }

  getCharacter(destinyMembershipId: number | string, characterId: string, options?: any): Observable<DestinyCharacterResponse> {
    const url = `${bungie}/Platform/Destiny2/${this._membershipType}/Profile/${destinyMembershipId}/Character/${characterId}/${this.getQueryString(options)}`;
    return this.http.get<DestinyCharacterResponse>(url);
  }

  getItem(itemInstanceId: number | string, destinyMembershipId: number | string, options?: any): Observable<DestinyItemResponse> {
    const url = `${bungie}/Platform/Destiny2/${this.membershipType}/Profile/${destinyMembershipId}/Item/${itemInstanceId}/${this.getQueryString(options)}`;
    return this.http.get<DestinyItemResponse>(url);
  }

  getPostGameCarnageReport(activityId: string): Observable<PostGameCarnageReportData> {
    const url = `${bungie}/Platform/Destiny2/Stats/PostGameCarnageReport/${activityId}/`;
    return this.http.get<PostGameCarnageReportData>(url);
  }

  getHistoricalStats(destinyMembershipId: string, characterId: string, options?: any): Observable<any> {
    const url = `${bungie}/Platform/Destiny2/${this._membershipType}/Account/${destinyMembershipId}/Character/${characterId}/Stats/${this.getQueryString(options)}`;
    return this.http.get<any>(url);
  }

  getHistoricalStatsForAccount(destinyMembershipId: string): Observable<AccountStats> {
    const url = `${bungie}/Platform/Destiny2/${this._membershipType}/Account/${destinyMembershipId}/Stats/?components=${DestinyComponentType.Profiles}`;
    return this.http.get<AccountStats>(url);
  }

  getCharacterStats(destinyMembershipId: string, characterId: string): Observable<AccountStats> {
    const url = `${bungie}/Platform/Destiny2/${this._membershipType}/Account/${destinyMembershipId}/Character/${characterId}/Stats/?components=${DestinyComponentType.Characters}`;
    return this.http.get<AccountStats>(url);
  }

  getLeaderboards(destinyMembershipId: string): Observable<any> {
    const url = `${bungie}/Platform/Destiny2/${this._membershipType}/Account/${destinyMembershipId}/Stats/Leaderboards?components=${DestinyComponentType.Profiles}`;
    return this.http.get<any>(url);
  }

  getActivityHistory(destinyMembershipId: string, characterId: string, mode?: string | number): Observable<any> {
    const q = mode !== undefined ? `?mode=${mode}` : '';
    const url = `${bungie}/Platform/Destiny2/${this._membershipType}/Account/${destinyMembershipId}/Character/${characterId}/Stats/Activities/${q}`;
    return this.http.get<any>(url);
  }

  getDestinyAggregateActivityStats(destinyMembershipId: string, characterId: string): Observable<any> {
    const url = `${bungie}/Platform/Destiny2/${this._membershipType}/Account/${destinyMembershipId}/Character/${characterId}/Stats/AggregateActivityStats/`;
    return this.http.get<any>(url);
  }
}
