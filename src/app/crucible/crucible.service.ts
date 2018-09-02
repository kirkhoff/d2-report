import {Injectable} from '@angular/core';
import {combineAll, map, mergeAll, mergeMap, take, tap} from 'rxjs/operators';

import {BungieService} from '../core/bungie.service';
import {CoreModule} from '../core/core.module';
import {DestinyActivityModeType, DestinyComponentType, ProgressionHash} from '../core/bungie.enums';
import {forkJoin, Observable} from 'rxjs';
import {DestinyCharacterComponent} from '../core/bungie.model';

@Injectable({
  providedIn: CoreModule
})
export class CrucibleService {
  membershipId: string;

  constructor(private bungie: BungieService) {}

  getMostRecentActivity(player: string, modes: DestinyActivityModeType[]) {
    return this.bungie.getMemberId(player).pipe(
      mergeMap(id => this.bungie.getProfile(id)),
      tap(rsp => this.membershipId = rsp.profile.data.userInfo.membershipId),
      mergeMap(rsp => rsp.profile.data.characterIds),
      map(id => forkJoin(modes.map(mode =>
        this.bungie.getActivityHistory(this.membershipId, id, mode)
      )).pipe(
        map(arr => arr.map(a => a.activities || [])),
        map(arr => ({
          characterId: id,
          activities: arr[0].concat(arr[1]).sort((a, b) => (a.period === b.period) ? 0 : (a.period < b.period) ? 1 : -1)
        }))
      )),
      combineAll(),
      map(arr => arr.sort((a, b) => (a.activities[0].period === b.activities[0].period) ? 0 :
        (a.activities[0].period < b.activities[0].period) ? 1 : -1)),
      mergeAll(),
      take(1),
      map(({ characterId, activities }) => ({ characterId, activity: activities[0]}))
    );
  }

  getKD(player: string): Observable<string> {
    return this.bungie.getMemberId(player).pipe(
      mergeMap((id) => this.bungie.getHistoricalStatsForAccount(id)),
      map(stats => stats.mergedAllCharacters.results.allPvP.allTime.killsDeathsRatio.basic.displayValue)
    );
  }

  getGuardians(player: string): Observable<DestinyCharacterComponent> {
    return this.bungie.getMemberId(player).pipe(
      mergeMap(id => this.bungie.getProfile(id)),
      tap(rsp => this.membershipId = rsp.profile.data.userInfo.membershipId),
      mergeMap(rsp => rsp.profile.data.characterIds),
      mergeMap(id => this.bungie.getCharacter(this.membershipId, id, { components: DestinyComponentType.Characters })),
      map(rsp => rsp.character.data)
    );
  }

  getGloryRank(player: string, characterId: string): Observable<number> {
    return this.bungie.getMemberId(player).pipe(
      mergeMap(id => this.bungie.getProfile(id, { components: [DestinyComponentType.CharacterProgressions] })),
      map(rsp => rsp.characterProgressions.data[characterId].progressions[ProgressionHash.GloryRank].currentProgress),
      take(1)
    );
  }

  getReadableStringForMode(mode: DestinyActivityModeType): string {
    switch (mode) {
      case DestinyActivityModeType.AllPvP: return 'All PvP';
      case DestinyActivityModeType.Survival: return 'Survival';
      case DestinyActivityModeType.Clash: return 'Clash';
      case DestinyActivityModeType.Control: return 'Control';
      case DestinyActivityModeType.Countdown: return 'Countdown';
      case DestinyActivityModeType.Gambit: return 'Gambit';
      default: return 'Unknown';
    }
  }
}
