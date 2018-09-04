import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BungieService} from '../core/bungie.service';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'dr-oauth',
  template: '<div class="container"><div class="loading"></div></div>'
})
export class OauthComponent implements OnInit {
  constructor(private auth: AuthService, private bungie: BungieService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(({ code }) => this.auth.authenticateAndRedirect(code));
  }
}
