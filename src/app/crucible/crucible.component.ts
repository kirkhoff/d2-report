import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BungieUser} from '../core/bungie.model';
import {Subject} from 'rxjs';
import {BungieService} from '../core/bungie.service';
import {tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'dr-crucible',
  styleUrls: ['./crucible.component.styl'],
  templateUrl: './crucible.component.html'
})
export class CrucibleComponent implements OnInit {
  playerCtrl = new FormControl();
  foundPlayers: BungieUser[];
  playerParam: string;

  private searchTerm = new Subject<string>();

  constructor(private bungie: BungieService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Observable to search for users on keypress (debounce used in service to prevent unnecessary API calls)
    this.bungie.searchUser(this.searchTerm).pipe(
      tap(players => this.foundPlayers = players)
    ).subscribe();

    this.route.queryParams.pipe(
      tap(qp => this.playerParam = qp.player || null)
    ).subscribe();
  }

  // Bound to keypress event
  searchPlayer() {
    this.searchTerm.next(this.playerCtrl.value);
  }

  // Bound to form submit
  submit() {
    return this.router.navigate(['/crucible'], {
      queryParams: {
        player: this.playerCtrl.value
      }
    });
  }

  clearSearch() {
    this.playerCtrl.setValue('');
    this.foundPlayers = [];
  }
}
