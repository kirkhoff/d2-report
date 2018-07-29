import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {map, mergeMap, switchMap, tap} from 'rxjs/operators';

import { BungieService } from '../core/bungie.service';
import { CoreModule } from '../core/core.module';

@Injectable({
  providedIn: CoreModule
})
export class CrucibleService {
  constructor(private bungie: BungieService) {}

  getMostRecentCharacter(player: string) {
    return this.bungie.getMemberId(player).pipe(
      mergeMap(id => this.bungie.getProfile(id)),
        mergeMap(rsp => this.bungie.getDestinyAggregateActivityStats(
        rsp.profile.data.userInfo.membershipId, rsp.profile.data.characterIds[0])),
      tap(console.log)
    );
  }

  getKD(player: string): Observable<any> {
    return this.bungie.getMemberId(player).pipe(
      mergeMap((id) => this.bungie.getStats(id)),
      tap(console.log),
      map(stats => stats.mergedAllCharacters.results.allPvP.allTime.killsDeathsRatio.basic.displayValue)
    );
  }
}
