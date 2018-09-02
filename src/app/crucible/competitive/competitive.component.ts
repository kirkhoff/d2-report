import {Component, OnInit} from '@angular/core';
import {BungieService} from '../../core/bungie.service';
import {CrucibleService} from '../crucible.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, mergeAll, mergeMap, switchMap, tap} from 'rxjs/operators';
import {PostGameCarnageEntry} from '../../core/bungie.model';
import {DestinyActivityModeType} from '../../core/bungie.enums';
import {forkJoin} from 'rxjs';
import {MatSelectChange} from '@angular/material';
import {FormControl} from '@angular/forms';

interface SelectOption {
  label: string;
  value: DestinyActivityModeType[];
}

@Component({
  selector: 'dr-competitive',
  styleUrls: ['./competitive.component.styl'],
  templateUrl: './competitive.component.html'
})
export class CompetitiveComponent implements OnInit {
  username: string;
  fireteam: PostGameCarnageEntry[];
  stats: { characterId: string, stats: any, gloryRank: number }[] = [];
  modeSelectCtrl = new FormControl();
  options: SelectOption[] = [
    { value: [DestinyActivityModeType.AllPvP], label: 'All' },
    { value: [DestinyActivityModeType.Clash], label: 'Clash' },
    { value: [DestinyActivityModeType.Control], label: 'Control' },
    { value: [DestinyActivityModeType.Countdown], label: 'Countdown' },
    { value: [DestinyActivityModeType.Survival], label: 'Survival' }
  ];
  modes: DestinyActivityModeType[];

  constructor(
    private bungie: BungieService,
    public crucible: CrucibleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      tap(q => {
        this.fireteam = [];
        this.stats = [];
        this.username = q.player;
        // modes are defined bia query params, so if there's only one, we need to turn it into an array
        this.modes = this.getSanitizedModesFromQuery(q.modes);
        const option = this.getInitialOption() || this.options[0];
        this.modeSelectCtrl.setValue(option.value);
      }),
      switchMap(({ player }) => this.bungie.searchPlayer(player)),
      filter(players => players && players.length > 0),
      map(players => players[0]),
      switchMap(({ displayName }) => this.crucible.getMostRecentActivity(displayName, this.modes)),
      switchMap(({ activity }) => this.bungie.getPostGameCarnageReport(activity.activityDetails.instanceId).pipe(
        map(rsp => {
          const teamId = activity.values.team.basic.value;
          return rsp.entries.filter(player => player.values.team.basic.value === teamId);
        }),
        tap(fireteam => this.fireteam = fireteam)
      )),
      mergeAll(),
      mergeMap(entry => forkJoin(
        this.bungie.getHistoricalStats(entry.player.destinyUserInfo.membershipId, entry.characterId, { modes: this.modes }),
        this.crucible.getGloryRank(entry.player.destinyUserInfo.displayName, entry.characterId)
      ).pipe(
        tap(([stats, gloryRank]) => this.stats.push({ characterId: entry.characterId, stats, gloryRank}))
      ))
    ).subscribe();
  }

  getKd(characterId: string, mode: DestinyActivityModeType): string {
    // Return if there aren't any stats yet
    if (!this.stats || !this.stats.length) {
      return '';
    }

    const character = this.stats.find(x => x.characterId === characterId);
    let modeName = Object.keys(DestinyActivityModeType).find(key => DestinyActivityModeType[key] === mode);
    // This seems fragile, but for now it will work. Stat keys are enum names but in camelCase.
    modeName = modeName.charAt(0).toLowerCase() + modeName.substr(1);
    return (character && character.stats && character.stats[modeName]) ?
      character.stats[modeName].allTime.killsDeathsRatio.basic.displayValue : '';
  }

  getGloryRank(characterId: string): number {
    const character = this.stats.find(x => x.characterId === characterId);
    return character ? character.gloryRank : 0;
  }

  changeMode(change: MatSelectChange) {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        modes: change.value
      }
    });
  }

  /**
   * Take a query param and sanitize it so that we can be sure it's an array of
   * DestinyActivityModeType. This will also return a default mode should none be provided.
   * @param query - string | string[], typically from query param
   */
  private getSanitizedModesFromQuery(query: string | string[]): DestinyActivityModeType[] {
    const stringsOfModes = typeof query === 'string' ? [query] : query ? query : null;
    return stringsOfModes ?
      stringsOfModes.map(m => parseInt(m, 10)) :
      [DestinyActivityModeType.AllPvP]; // Default modes
  }

  /**
   * Return the select option to select, from a modes array
   */
  private getInitialOption(): SelectOption {
    return this.options.find(o => {
      let equal = false;
      o.value.forEach(v => {
        return equal = equal || this.modes.indexOf(v) > -1;
      });
      return equal;
    });
  }
}
