import {Component, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DestinyItemComponent, DestinyItemInstanceComponent} from '../core/bungie.model';
import {BungieService} from '../core/bungie.service';
import {DestinyInventoryItemDefinition} from '../core/manifest.model';

@Component({
  selector: 'dr-equipment',
  styleUrls: ['./equipment.component.styl'],
  templateUrl: './equipment.component.html'
})
export class EquipmentComponent implements OnChanges {
  @Input() item: DestinyItemComponent;
  @Input() instance: DestinyItemInstanceComponent;
  @Input() characterLight: number;
  @HostBinding('class.warn') lowLight = false;
  manifest: DestinyInventoryItemDefinition;
  icon: string;

  constructor(private bungie: BungieService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.instance && changes.item) {
      this.bungie.getDestinyEntityDefinition('DestinyInventoryItemDefinition', this.item.itemHash)
        .subscribe(rsp => {
          this.manifest = rsp;
          this.icon = `https://bungie.net${rsp.displayProperties.icon}`;
        });
      this.lowLight = this.instance.primaryStat.value < this.characterLight;
    }
  }
}
