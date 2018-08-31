import {Component, OnInit} from '@angular/core';
import {SearchService} from './search.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'dr-search',
  styleUrls: ['./search.component.styl'],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  playerCtrl = new FormControl();
  title: string;

  constructor(
    public search: SearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ title }) => this.title = title);
  }

  submit() {
    this.search.foundPlayers = [];
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        player: this.playerCtrl.value
      }
    });
  }

  clear() {
    this.playerCtrl.setValue('');
    this.search.foundPlayers = [];
  }
}
