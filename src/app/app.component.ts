import {Component} from '@angular/core';
import {filter, map, switchMap, tap} from 'rxjs/operators';

import {CrucibleService} from './crucible/crucible.service';
import {BungieService} from './core/bungie.service';
import {FormControl} from '@angular/forms';
import {BungieUser} from './core/bungie.model';
import {BehaviorSubject, Subject} from 'rxjs';
import {CrucibleData, CrucibleDataSource} from './crucible/crucible-data-source';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  displayedPlayer: string;
  kd: string;
  playerCtrl = new FormControl();
  foundPlayers: BungieUser[];
  players: CrucibleData[] = [];
  playerSubject = new BehaviorSubject([]);
  dataSource = new CrucibleDataSource(this.playerSubject.asObservable());
  displayedColumns = ['name', 'avgKd'];

  private searchTerm = new Subject<string>();

  constructor(private bungie: BungieService, private crucible: CrucibleService) {
    // Observable to search for users on keypress (debounce used in service to prevent unnecessary API calls)
    this.bungie.searchUser(this.searchTerm).pipe(
      tap(players => this.foundPlayers = players)
    ).subscribe();
  }

  // Bound to keypress event
  searchPlayer() {
    this.searchTerm.next(this.playerCtrl.value);
  }

  // Bound to form submit
  submit() {
    this.kd = null;
    this.displayedPlayer = null;
    this.bungie.searchPlayer(this.playerCtrl.value).pipe(
      filter(players => players && players.length > 0),
      map(players => players[0]),
      tap(({ displayName }) => this.displayedPlayer = displayName),
      switchMap(({ displayName }) => this.crucible.getKD(displayName)),
    ).subscribe(kd => {
      this.players.push({ name: this.playerCtrl.value, avgKd: kd });
      this.playerSubject.next(this.players);
    });
  }
}
