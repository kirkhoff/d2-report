import {Component, OnInit} from '@angular/core';
import {CrucibleService} from '../crucible.service';
import {BungieService} from '../../core/bungie.service';
import {filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {DestinyCharacterComponent} from '../../core/bungie.model';
import {DestinyActivityModeType} from '../../core/bungie.enums';
import {Observable} from 'rxjs';

@Component({
  selector: 'dr-crucible-overview',
  styleUrls: ['./crucible-overview.component.styl'],
  templateUrl: './crucible-overview.component.html'
})
export class CrucibleOverviewComponent implements OnInit {
  username: string;
  guardians: DestinyCharacterComponent[] = [];
  stats: { characterId: string, stats: any }[] = [];
  avgKdAcrossCharacters: Observable<string>;

  constructor(private bungie: BungieService, private crucible: CrucibleService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      tap(() => this.guardians = []),
      tap(({ player }) => this.username = player),
      switchMap(({ player }) => this.bungie.searchPlayer(player)),
      filter(players => players && players.length > 0),
      map(players => players[0]),
      tap(({ displayName }) => this.avgKdAcrossCharacters = this.crucible.getKD(displayName)),
      switchMap(({ displayName }) => this.crucible.getGuardians(displayName)),
      tap(guardian => this.guardians.push(guardian)),
      mergeMap(guardian => this.bungie.getHistoricalStats(guardian.membershipId, guardian.characterId, {
        modes: [
          DestinyActivityModeType.Survival,
          DestinyActivityModeType.Countdown,
          DestinyActivityModeType.Control,
          DestinyActivityModeType.Clash,
          DestinyActivityModeType.IronBanner,
          DestinyActivityModeType.AllPvP
        ]
      }).pipe(
        map(stats => ({ characterId: guardian.characterId, stats }))
      )),
      tap(stats => this.stats.push(stats))
    ).subscribe();
  }

  getKd(characterId: string, mode: string): string {
    const character = this.stats.find(x => x.characterId === characterId);
    return character && character.stats && character.stats[mode] ?
      character.stats[mode].allTime.killsDeathsRatio.basic.displayValue : '';
  }
}
