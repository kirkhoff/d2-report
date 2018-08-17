import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BungieService} from '../core/bungie.service';
import {FireteamService} from './fireteam.service';
import {map, mergeMap, tap} from 'rxjs/operators';
import {DestinyComponentType, FireteamActivityType, ProgressionHash} from '../core/bungie.enums';
import {Observable} from 'rxjs';
import {CrucibleService} from '../crucible/crucible.service';

@Component({
  selector: 'dr-fireteam',
  styleUrls: ['./fireteam.component.styl'],
  templateUrl: './fireteam.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FireteamComponent implements OnInit {
  search: any = {};
  displayNames = {};
  kds = {};
  gloryRanks = {};

  constructor(private cdr: ChangeDetectorRef, private bungie: BungieService, private fireteam: FireteamService, private crucible: CrucibleService) {}

  ngOnInit() {
    // Get listing of current fireteam postings
    this.fireteam.getAvailableFireteams().pipe(
      tap(rsp => this.search = rsp),
      tap(() => this.cdr.detectChanges()),
      mergeMap(rsp => rsp.results),
      tap(result => {
        this.displayNames[result.ownerMembershipId] = this.getFireteamLeader(result.ownerMembershipId);
        this.kds[result.ownerMembershipId] = this.getKd(result.ownerMembershipId);
        this.gloryRanks[result.ownerMembershipId] = this.getGloryRank(result.ownerMembershipId);
      })
    ).subscribe();
  }

  getActivityType(type: FireteamActivityType): string {
    switch (type) {
      case FireteamActivityType.Anything: return 'Anything';
      case FireteamActivityType.Crucible: return 'Crucible';
      case FireteamActivityType.Nightfall: return 'Nightfall';
      case FireteamActivityType.Raid: return 'Raid';
      case FireteamActivityType.Trials: return 'Trials';
      default: return 'All';
    }
  }

  private getFireteamLeader(membershipId: number): Observable<string> {
    return this.bungie.getProfile(membershipId.toString()).pipe(
      map(rsp => rsp.profile.data.userInfo.displayName),
    );
  }

  private getKd(membershipId: number): Observable<string> {
    return this.bungie.getHistoricalStatsForAccount(membershipId.toString()).pipe(
      map(stats => stats.mergedAllCharacters.results.allPvP.allTime),
      map(allTime => allTime ? allTime.killsDeathsRatio.basic.displayValue : '?')
    );
  }

  private getGloryRank(membershipId: number): Observable<number> {
    return this.bungie.getProfile(membershipId.toString(), { components: [DestinyComponentType.CharacterProgressions, DestinyComponentType.Profiles] }).pipe(
      map(rsp => rsp.characterProgressions.data[rsp.profile.data.characterIds[0]].progressions[ProgressionHash.GloryRank].currentProgress)
    );
  }
}
