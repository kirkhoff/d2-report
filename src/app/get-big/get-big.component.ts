import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BungieService} from '../core/bungie.service';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap, switchMap, switchMapTo, tap} from 'rxjs/operators';
import {DestinyComponentType, MembershipType} from '../core/bungie.enums';
import {HttpClient} from '@angular/common/http';
import {
  DestinyCharacterComponent,
  DestinyItemComponent,
  DestinyItemInstanceComponent,
  DestinyProfileResponse,
  GeneralUser
} from '../core/bungie.model';
import {AuthService} from '../core/auth.service';
import {MatDialog, MatIconRegistry, MatSelectChange} from '@angular/material';
import {OauthDialogComponent} from '../oauth/oauth-dialog.component';
import {FormControl} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {forkJoin, Observable} from 'rxjs';
import {ManifestService} from '../core/manifest.service';
import {DestinyDefinition, DestinyInventoryBucketDefinition} from '../core/manifest.model';

interface MembershipDisplayName {
  displayName: string;
  membershipId?: string;
  membershipType: MembershipType;
  membershipIcon: string;
}

interface Equipment {
  item: DestinyItemComponent;
  instance: DestinyItemInstanceComponent;
}

interface MostPowerfulEquipment {
  kinetic?: Equipment;
  energy?: Equipment;
  power?: Equipment;
  helmet?: Equipment;
  arms?: Equipment;
  chest?: Equipment;
  legs?: Equipment;
  classItem?: Equipment;
}

interface ClassEquipment {
  warlock?: MostPowerfulEquipment;
  hunter?: MostPowerfulEquipment;
  titan?: MostPowerfulEquipment;
}

enum BucketType {
  Kinetic = 0,
  Energy = 1,
  Power = 2,
  Helmet = 3,
  Arms = 4,
  Chest = 5,
  Legs = 6,
  ClassItem = 7
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
  mostPowerfulEquipment: MostPowerfulEquipment = {};
  highestPossibleLight: number;

  private membershipId: string;
  private equipment: ClassEquipment;
  private buckets: DestinyDefinition<DestinyInventoryBucketDefinition>;

  constructor(
    public auth: AuthService,
    private bungie: BungieService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private http: HttpClient,
    private manifest: ManifestService,
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
    this.membershipId = membership.membershipId;
    this.bungie.membershipType = membership.membershipType;
    this.bungie.searchPlayer(membership.displayName).pipe(
      map(players => players[0]),
      switchMap(player => this.bungie.getProfile(player.membershipId, {
        components: [
          DestinyComponentType.Profiles,
          DestinyComponentType.Characters,
          DestinyComponentType.CharacterInventories,
          DestinyComponentType.CharacterEquipment,
          DestinyComponentType.CharacterActivities,
          DestinyComponentType.ProfileInventories,
          DestinyComponentType.ProfileCurrencies,
          DestinyComponentType.ItemInstances,
          DestinyComponentType.ItemStats,
        ]
      })),
      tap(rsp => this.profile = rsp),
      map(rsp => rsp.profile.data.characterIds.map(id => rsp.characters.data[id])),
      map(characters => characters.sort((a, b) =>
        a.dateLastPlayed === b.dateLastPlayed ? 0 :
          a.dateLastPlayed > b.dateLastPlayed ? -1 : 1)),
      tap(characters => this.characters = characters),
      tap(() => this.loadCharacter(this.characters[0].characterId))
    ).subscribe();
  }

  loadCharacter(characterId: string): void {
    this.manifest.getInventoryBucket()
      .pipe(
        tap(rsp => this.buckets = rsp),
        switchMapTo(this.getEquipment(characterId))
      )
      .subscribe(equipment => {
        this.mostPowerfulEquipment.kinetic = this.getMostPowerfulItemForBucket(equipment, BucketType.Kinetic);
        this.mostPowerfulEquipment.energy = this.getMostPowerfulItemForBucket(equipment, BucketType.Energy);
        this.mostPowerfulEquipment.power = this.getMostPowerfulItemForBucket(equipment, BucketType.Power);
        this.mostPowerfulEquipment.helmet = this.getMostPowerfulItemForBucket(equipment, BucketType.Helmet);
        this.mostPowerfulEquipment.arms = this.getMostPowerfulItemForBucket(equipment, BucketType.Arms);
        this.mostPowerfulEquipment.chest = this.getMostPowerfulItemForBucket(equipment, BucketType.Chest);
        this.mostPowerfulEquipment.legs = this.getMostPowerfulItemForBucket(equipment, BucketType.Legs);
        this.mostPowerfulEquipment.classItem = this.getMostPowerfulItemForBucket(equipment, BucketType.ClassItem);
        this.highestPossibleLight = this.getHighestPossibleLight();
        console.log('stuff: ', this.mostPowerfulEquipment, this.highestPossibleLight);
      });
  }

  /**
   * Get bungie.net user from token's membershipId (not the same as a Destiny membershipId)
   */
  private loadMemberships(): void {
    const membershipId = this.auth.membershipId;
    this.manifest.getInventoryBucket().pipe(
      tap(rsp => this.buckets = rsp),
      switchMapTo(this.bungie.getBungieNetUserById(membershipId)),
      mergeMap(user => this.getDestinyMemberships(user)),
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
        switchMap(player => this.bungie.getProfile(player.membershipId, { components: [DestinyComponentType.Profiles] }, m.membershipType)),
        tap(({ profile }) => {
          if (profile) {
            destinyMemberships.push(m);
          }
        })
      ))
    ).pipe(map(() => destinyMemberships));
  }

  private getEquipment(characterId: string): Observable<Equipment[]> {
    return this.bungie.getCharacter(this.membershipId, characterId, {
      components: [
        DestinyComponentType.CharacterInventories,
        DestinyComponentType.CharacterEquipment,
        DestinyComponentType.ItemInstances,
        DestinyComponentType.ItemStats
      ]
    })
      .pipe(
        map(c => {
          const instances = c.itemComponents.instances.data;
          return c.equipment.data.items
            .concat(c.inventory.data.items)
            .filter(i => i && i.itemInstanceId)
            .map(item => ({ item, instance: instances[item.itemInstanceId] }))
            .filter(i => i.instance.canEquip && i.instance.primaryStat && i.instance.primaryStat.value > 1);
        })
      );
  }

  private getMostPowerfulItemForBucket(items: Equipment[], bucket: BucketType): Equipment {
    return items
      .filter(i => this.buckets[i.item.bucketHash].index === bucket)
      .sort(this.sortByPower)
      [0];
  }

  private sortByPower(a: Equipment, b: Equipment): number {
    return (a.instance.primaryStat.value === b.instance.primaryStat.value) ? 0 :
      (a.instance.primaryStat.value > b.instance.primaryStat.value) ? -1 : 1;
  }

  private getHighestPossibleLight(): number {
    const total = Object.values(this.mostPowerfulEquipment)
      .map((e: Equipment) => e.instance.primaryStat.value)
      .reduce((total, num) => total + num);
    return total / Object.keys(this.mostPowerfulEquipment).length;
  }
}
