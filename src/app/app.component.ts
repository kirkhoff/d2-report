import {Component, OnInit} from '@angular/core';
import {MatSelectChange} from '@angular/material';
import {BungieService} from './core/bungie.service';
import {AuthService} from './core/auth.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {GeneralUser} from './core/bungie.model';
import {forkJoin, Observable} from 'rxjs';
import {DestinyComponentType, MembershipType} from './core/bungie.enums';
import {FormControl} from '@angular/forms';

interface MembershipDisplayName {
  displayName: string;
  membershipId?: string;
  membershipType: MembershipType;
  membershipIcon: string;
}

@Component({
  selector: 'dr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {
  memberships: MembershipDisplayName[];
  membershipCtrl = new FormControl();

  constructor(
    public auth: AuthService,
    private bungie: BungieService
  ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated) {
      this.loadMemberships();
    }
  }

  logIn() {
    location.replace(this.auth.tokenRequestUrl);
  }

  changeMembership(change: MatSelectChange): void {
    this.setMembership(change.value);
  }

  setMembership(membership: MembershipDisplayName): void {
    this.bungie.membershipType = membership.membershipType;
    this.bungie.membershipId$.next(membership.membershipId);
  }

  /**
   * Get bungie.net user from token's membershipId (not the same as a Destiny membershipId)
   */
  private loadMemberships(): void {
    const membershipId = this.auth.membershipId;
    this.bungie.getBungieNetUserById(membershipId).pipe(
      switchMap(user => this.getDestinyMemberships(user)),
    ).subscribe(result => {
      this.memberships = result;
      this.membershipCtrl.setValue(this.memberships[0]);
      this.setMembership(this.memberships[0]);
    });
  }

  /**
   * Get potential Destiny memberships from a bungie.net GeneralUser
   * @param user - GeneralUser from bungie.net
   */
  private getDestinyMemberships(user: GeneralUser): Observable<MembershipDisplayName[]> {
    const memberships: MembershipDisplayName[] = [
      {
        displayName: user.psnDisplayName,
        membershipType: MembershipType.PSN,
        membershipIcon: 'psn'
      },
      {
        displayName: user.xboxDisplayName,
        membershipType: MembershipType.Xbox,
        membershipIcon: 'xbox'
      },
      {
        displayName: user.blizzardDisplayName,
        membershipType: MembershipType.Blizzard,
        membershipIcon: 'blizzard'
      }
    ].filter(m => !!m.displayName);

    // This is hacky, but for some reason the filter operator stops the stream
    const destinyMemberships = [];

    return forkJoin(memberships
      .map(m => this.bungie.searchPlayer(m.displayName, m.membershipType).pipe(
        map(players => players[0]),
        tap(({ membershipId }) => m.membershipId = membershipId),
        switchMap(player => this.bungie.getProfile(player.membershipId, {
          components: [DestinyComponentType.Profiles]
        }, m.membershipType)),
        tap(({ profile }) => {
          if (profile) {
            destinyMemberships.push(m);
          }
        })
      ))
    ).pipe(map(() => destinyMemberships));
  }
}
