import {Component, OnInit} from '@angular/core';
import {BungieService} from '../core/bungie.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'dr-oauth',
  template: '<div class="container">Authenticating...please wait.</div>'
})
export class OauthComponent implements OnInit {
  constructor(private bungie: BungieService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(({ code }) => this.bungie.authenticate(code))
    ).subscribe(console.log);
  }
}
