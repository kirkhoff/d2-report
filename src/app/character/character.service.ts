import {Injectable} from '@angular/core';
import {CoreModule} from '../core/core.module';
import {BungieService} from '../core/bungie.service';

@Injectable({
  providedIn: CoreModule
})
export class CharacterService {
  constructor(private bungie: BungieService) {}

  getMaxLight(membershipId: number, characterId: number) {

  }
}
