import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';

import { CrucibleService } from './crucible/crucible.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displayedPlayer: string;
  player: string;
  kd: string;

  constructor(private crucible: CrucibleService) {}

  submit() {
    this.kd = null;
    this.displayedPlayer = null;
    this.crucible.getKD(this.player).pipe(
      tap(kd => {
        this.kd = kd;
        this.displayedPlayer = this.player;
      })
    ).subscribe(kd => this.kd = kd);
  }
}
