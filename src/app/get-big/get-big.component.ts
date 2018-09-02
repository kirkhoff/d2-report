import {Component, OnInit} from '@angular/core';
import {BungieService} from '../core/bungie.service';
import {ActivatedRoute} from '@angular/router';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {DestinyComponentType} from '../core/bungie.enums';
import {HttpClient} from '@angular/common/http';
import {DestinyCharacterComponent, DestinyProfileResponse} from '../core/bungie.model';

@Component({
  selector: 'dr-get-big',
  styleUrls: ['./get-big.component.styl'],
  templateUrl: './get-big.component.html'
})
export class GetBigComponent implements OnInit {
  characters: DestinyCharacterComponent[];
  profile: DestinyProfileResponse;
  showAllCharacters = false;

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
          DestinyComponentType.CharacterInventories,
          DestinyComponentType.Characters,
          DestinyComponentType.ProfileInventories
        ]
      })),
      tap(console.log),
      tap(rsp => this.profile = rsp),
      map(rsp => rsp.profile.data.characterIds.map(id => rsp.characters.data[id])),
      map(characters => characters.sort((a, b) =>
        a.dateLastPlayed === b.dateLastPlayed ? 0 :
          a.dateLastPlayed > b.dateLastPlayed ? -1 : 1)),
      tap(characters => this.characters = characters)
    )
      .subscribe(console.log);
  }
}
