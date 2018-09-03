import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BungieService} from '../core/bungie.service';
import {ActivatedRoute} from '@angular/router';
import {catchError, filter, map, mergeMap, switchMap, takeWhile, tap} from 'rxjs/operators';
import {DestinyComponentType, MembershipType} from '../core/bungie.enums';
import {HttpClient} from '@angular/common/http';
import {DestinyCharacterComponent, DestinyProfileResponse, GeneralUser} from '../core/bungie.model';
import {AuthService} from '../core/auth.service';
import {MatDialog, MatIconRegistry, MatSelectChange} from '@angular/material';
import {OauthDialogComponent} from '../oauth/oauth-dialog.component';
import {FormControl} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {forkJoin, Observable, of} from 'rxjs';

interface MembershipDisplayName {
  displayName: string;
  membershipType: MembershipType;
  membershipIcon: string;
}

@Component({
  selector: 'dr-get-big',
  styleUrls: ['./get-big.component.styl'],
  templateUrl: './get-big.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GetBigComponent implements OnInit {
  characters: DestinyCharacterComponent[];
  profile: DestinyProfileResponse;
  showAllCharacters = false;
  memberships: MembershipDisplayName[];
  membershipCtrl = new FormControl();

  constructor(
    public auth: AuthService,
    private bungie: BungieService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private http: HttpClient,
    private route: ActivatedRoute,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry
      .addSvgIcon('psn', sanitizer.bypassSecurityTrustResourceUrl('assets/psn.svg'))
      .addSvgIcon('xbox', sanitizer.bypassSecurityTrustResourceUrl('assets/xbox.svg'))
      .addSvgIcon('blizzard', sanitizer.bypassSecurityTrustResourceUrl('assets/blizzard.svg'));
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated) {
      setTimeout(() => this.dialog.open(OauthDialogComponent));
    } else {
      this.loadMemberships();
    }
  }

  changeMembership(change: MatSelectChange): void {
    this.setMembership(change.value);
  }

  setMembership(membership: MembershipDisplayName): void {
    this.bungie.membershipType = membership.membershipType;
    this.bungie.searchPlayer(membership.displayName).pipe(
      map(players => players[0]),
      switchMap(player => this.bungie.getProfile(player.membershipId, {
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
      tap(rsp => this.profile = rsp),
      map(rsp => rsp.profile.data.characterIds.map(id => rsp.characters.data[id])),
      map(characters => characters.sort((a, b) =>
        a.dateLastPlayed === b.dateLastPlayed ? 0 :
          a.dateLastPlayed > b.dateLastPlayed ? -1 : 1)),
      tap(characters => this.characters = characters)
    ).subscribe();
  }

  private loadMemberships(): void {
    const membershipId = this.auth.membershipId;
    this.bungie.getBungieNetUserById(membershipId).pipe(
      mergeMap(user => this.getDestinyMemberships(user)),
    ).subscribe(result => {
      this.memberships = result;
      this.membershipCtrl.setValue(this.memberships[0]);
      this.setMembership(this.memberships[0]);
    });
  }

  private getDestinyMemberships(user: GeneralUser): Observable<MembershipDisplayName[]> {
    const memberships = [
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
        mergeMap(player => this.bungie.getProfile(player.membershipId, { components: [DestinyComponentType.Profiles] }, m.membershipType)),
        tap(({ profile }) => { if (profile) { destinyMemberships.push(m); } }),
        // filter(rsp => rsp.profile !== undefined),
        // map(() => m)
      ))
    ).pipe(map(() => destinyMemberships));
  }
}
