import {Injectable} from '@angular/core';
import {CoreModule} from '../core/core.module';
import {UserInfoCard} from '../core/bungie.model';

@Injectable({
  providedIn: CoreModule
})
export class SearchService {
  foundPlayers: UserInfoCard[];
}
