import {Component, OnInit} from '@angular/core';
import {BungieService} from '../../core/bungie.service';
import {CrucibleService} from '../crucible.service';
import {ActivatedRoute} from '@angular/router';
import {filter, map, mergeAll, mergeMap, switchMap, tap} from 'rxjs/operators';
import {PostGameCarnageEntry} from '../../core/bungie.model';
import {ActivityMode} from '../../core/bungie.enums';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'dr-competitive',
  styleUrls: ['./competitive.component.styl'],
  templateUrl: './competitive.component.html'
})
export class CompetitiveComponent implements OnInit {
  username: string;
  fireteam: PostGameCarnageEntry[];
  stats: { characterId: string, stats: any, gloryRank: number }[] = [];

  constructor(private bungie: BungieService, public crucible: CrucibleService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      tap(() => this.fireteam = []),
      tap(({ player }) => this.username = player),
      switchMap(({ player }) => this.bungie.searchPlayer(player)),
      filter(players => players && players.length > 0),
      map(players => players[0]),
      switchMap(({ displayName }) => this.crucible.getMostRecentActivity(displayName)),
      switchMap(({ activity }) => this.bungie.getPostGameCarnageReport(activity.activityDetails.instanceId).pipe(
        map(rsp => {
          const teamId = activity.values.team.basic.value;
          return rsp.entries.filter(player => player.values.team.basic.value === teamId);
        }),
        tap(fireteam => this.fireteam = fireteam)
      )),
      mergeAll(),
      mergeMap(entry => forkJoin(
        this.bungie.getHistoricalStats(entry.player.destinyUserInfo.membershipId, entry.characterId, {
          modes: [
            ActivityMode.Survival,
            ActivityMode.Countdown,
            ActivityMode.AllPvP,
          ]
        }),
        this.crucible.getGloryRank(entry.player.destinyUserInfo.displayName, entry.characterId)
      ).pipe(
        tap(([stats, gloryRank]) => this.stats.push({ characterId: entry.characterId, stats, gloryRank}))
      ))
    ).subscribe();
  }

  getKd(characterId: string, mode: string): string {
    const character = this.stats.find(x => x.characterId === characterId);
    return character ? character.stats[mode].allTime.killsDeathsRatio.basic.displayValue : '';
  }

  getGloryRank(characterId: string): number {
    const character = this.stats.find(x => x.characterId === characterId);
    return character ? character.gloryRank : 0;
  }
}
