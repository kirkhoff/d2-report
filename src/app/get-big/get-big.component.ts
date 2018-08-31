import {Component, OnInit} from '@angular/core';
import {BungieService} from '../core/bungie.service';
import {ActivatedRoute} from '@angular/router';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {DestinyComponentType} from '../core/bungie.enums';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'dr-get-big',
  styleUrls: ['./get-big.component.styl'],
  templateUrl: './get-big.component.html'
})
export class GetBigComponent implements OnInit {
  constructor(
    private bungie: BungieService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(({ player }) => this.bungie.searchPlayer(player)),
      filter(players => players && players.length > 0),
      map(players => players[0]),
      switchMap(({ membershipId }) => this.bungie.getProfile(membershipId, {
        components: [
          DestinyComponentType.Profiles,
          DestinyComponentType.ProfileProgression,
          DestinyComponentType.CharacterProgressions,
          DestinyComponentType.CharacterActivities,
          DestinyComponentType.CharacterEquipment,
          DestinyComponentType.Characters,
          DestinyComponentType.ProfileInventories
        ]
      }))
    )
      .subscribe(console.log);

    const manifestUrl = 'https://destiny.plumbing/en/raw/DestinyActivityTypeDefinition.json';
    this.http.get(manifestUrl).subscribe(console.log);
  }
}
