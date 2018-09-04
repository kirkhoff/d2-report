import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BungieService} from '../core/bungie.service';
import {map, switchMap, switchMapTo, tap} from 'rxjs/operators';
import {DestinyComponentType} from '../core/bungie.enums';
import {DestinyCharacterComponent, DestinyItemComponent, DestinyItemInstanceComponent, DestinyProfileResponse} from '../core/bungie.model';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, ReplaySubject} from 'rxjs';
import {ManifestService} from '../core/manifest.service';
import {DestinyDefinition, DestinyInventoryBucketDefinition} from '../core/manifest.model';
import {AuthService} from '../core/auth.service';
import {OauthDialogComponent} from '../oauth/oauth-dialog.component';

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
  mostPowerfulEquipment: MostPowerfulEquipment = {};
  highestPossibleLight: number;
  lightLevelProgress: string;
  membershipId: string;

  private equipment: ClassEquipment;
  private buckets: DestinyDefinition<DestinyInventoryBucketDefinition>;

  constructor(
    private auth: AuthService,
    private bungie: BungieService,
    private dialog: MatDialog,
    private manifest: ManifestService,
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
    }

    const membershipId$ = new ReplaySubject<string>();
    this.bungie.membershipId$.subscribe(membershipId$);
    membershipId$
      .pipe(
        tap(membershipId => this.membershipId = membershipId),
        switchMap(membershipId => this.bungie.getProfile(membershipId, {
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
          })
        ),
        tap(rsp => this.profile = rsp),
        map(rsp => rsp.profile.data.characterIds.map(id => rsp.characters.data[id])),
        map(characters => characters.sort((a, b) =>
          a.dateLastPlayed === b.dateLastPlayed ? 0 :
            a.dateLastPlayed > b.dateLastPlayed ? -1 : 1)),
        tap(characters => {
          this.characters = characters;
          this.loadCharacter(localStorage.getItem('characterId') || this.characters[0].characterId);
        })
      )
      .subscribe();
  }

  loadCharacter(characterId: string): void {
    this.sortCharacters(characterId);
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
        this.highestPossibleLight = Math.floor(this.getHighestPossibleLight());
        this.lightLevelProgress = (this.getHighestPossibleLight() % 1) * 100 + '%';
      });
  }

  /**
   * Places the targeted character as the first item in the characters array which will
   * prioritize that character in the view. This method will also store the selected
   * characterId in localStorage for persistence.
   * @param characterId - target character that is being prioritized
   */
  private sortCharacters(characterId: string): void {
    const character = this.characters.find(c => c.characterId === characterId);
    const index = this.characters.indexOf(character);
    if (index !== 0) {
      const [prevCharacter] = this.characters;
      this.characters[0] = character;
      this.characters[index] = prevCharacter;
    }
    localStorage.setItem('characterId', characterId);
    this.showAllCharacters = false;
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
      .reduce((x, y) => x + y);
    return total / Object.keys(this.mostPowerfulEquipment).length;
  }
}
