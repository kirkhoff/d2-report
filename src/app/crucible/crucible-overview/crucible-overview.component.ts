import {Component, OnInit} from '@angular/core';
import {CrucibleService} from '../crucible.service';
import {BungieService} from '../../core/bungie.service';
import {map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {DestinyCharacter} from '../../core/bungie.model';
import {ActivityMode, DestinyClassType} from '../../core/bungie.enums';
import {Observable} from 'rxjs';

@Component({
  selector: 'dr-crucible-overview',
  styleUrls: ['./crucible-overview.component.styl'],
  templateUrl: './crucible-overview.component.html'
})
export class CrucibleOverviewComponent implements OnInit {
  username: string;
  guardians: DestinyCharacter[] = [];
  stats: { characterId: string, stats: any }[] = [];
  avgKdAcrossCharacters: Observable<string>;

  constructor(private bungie: BungieService, private crucible: CrucibleService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      tap(({ player }) => {
        this.username = player;
        this.avgKdAcrossCharacters = this.crucible.getKD(player);
      }),
      switchMap(({ player }) => this.crucible.getGuardians(player)),
      tap(guardian => this.guardians.push(guardian)),
      mergeMap(guardian => this.bungie.getHistoricalStats(guardian.membershipId, guardian.characterId, {
        modes: [
          ActivityMode.Survival,
          ActivityMode.Countdown,
          ActivityMode.Control,
          ActivityMode.Clash,
          ActivityMode.IronBanner,
          ActivityMode.AllPvP
        ]
      }).pipe(
        map(stats => ({ characterId: guardian.characterId, stats }))
      )),
      tap(stats => this.stats.push(stats))
    ).subscribe();
  }

  getGuardianClass(classType: DestinyClassType) {
    switch (classType) {
      case DestinyClassType.Hunter: return 'Hunter';
      case DestinyClassType.Titan: return 'Titan';
      case DestinyClassType.Warlock: return 'Warlock';
      default: return 'Unknown';
    }
  }

  getKd(characterId: string, mode: string): string {
    const character = this.stats.find(x => x.characterId === characterId);
    return character ? character.stats[mode].allTime.killsDeathsRatio.basic.displayValue : '';
  }
}