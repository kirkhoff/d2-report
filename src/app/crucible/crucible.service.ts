import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { BungieService } from '../core/bungie.service';
import { CoreModule } from '../core/core.module';

@Injectable({
  providedIn: CoreModule
})
export class CrucibleService {
  constructor(private bungie: BungieService) {}

  getKD(player: string): Observable<any> {
    return this.bungie.getMemberId(player).pipe(
      mergeMap((id) => this.bungie.getStats(id)),
      map(stats => stats.mergedAllCharacters.results.allPvP.allTime.killsDeathsRatio.basic.displayValue),
      tap(console.log)
    );
  }
}
