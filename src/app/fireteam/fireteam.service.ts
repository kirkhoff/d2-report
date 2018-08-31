import {Injectable} from '@angular/core';
import {CoreModule} from '../core/core.module';
import {BungieService} from '../core/bungie.service';
import {FireteamActivityType, FireteamDateRange, FireteamPlatform, FireteamSlotSearch,} from '../core/bungie.enums';

@Injectable({
  providedIn: CoreModule
})
export class FireteamService {
  constructor(private bungie: BungieService) {}

  getAvailableFireteams() {
    return this.bungie.searchPublicAvailableClanFireteams(
      FireteamPlatform.Playstation4,
      FireteamActivityType.All,
      FireteamDateRange.ThisWeek,
      FireteamSlotSearch.HasOpenPlayerSlots,
      10
    );
  }
}
