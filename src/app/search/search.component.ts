import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {BungieService} from '../core/bungie.service';
import {UserInfoCard} from '../core/bungie.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'dr-search',
  styleUrls: ['./search.component.styl'],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  @Output() results = new EventEmitter<UserInfoCard[]>();

  players: UserInfoCard[];
  playerCtrl = new FormControl();
  title: string;

  private playerParam: string;
  private searchTerm = new Subject<string>();

  constructor(
    private bungie: BungieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ title }) => this.title = title);

    // Observable to search for users on keypress (debounce used in service to prevent unnecessary API calls)
    this.bungie
      .searchUser(this.searchTerm)
      .subscribe(players => {
        this.players = players;
        this.results.emit(this.players);
      });

    this.route
      .queryParams
      .subscribe(({ player }) => this.playerParam = player || null);
  }

  // Bound to form submit
  submit() {
    this.players = [];
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        player: this.playerCtrl.value
      }
    });
  }

  // Bound to keypress event
  searchPlayer() {
    this.searchTerm.next(this.playerCtrl.value);
  }

  clear() {
    this.playerCtrl.setValue('');
    this.players = [];
  }
}
