import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {DestinyCharacterComponent} from '../core/bungie.model';
import {bungie} from '../core/bungie.service';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {ManifestService} from '../core/manifest.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'dr-character',
  styleUrls: ['./character.component.styl'],
  templateUrl: './character.component.html'
})
export class CharacterComponent implements OnInit {
  @Input() data?: DestinyCharacterComponent;
  @Input() lightLevel?: number;
  @Input() level?: number;
  @Input() classHash?: number;
  @Input() raceHash?: number;
  @Input() genderHash?: number;
  @Input() name?: string;
  @Input() emblemIcon?: string;
  @HostBinding('style.background-image') emblemBackground: SafeStyle;

  characterClass: Observable<string>;
  race: Observable<string>;
  gender: Observable<string>;

  constructor(private domSanitizer: DomSanitizer, private manifest: ManifestService) {}

  ngOnInit() {
    // Set the background image to the character's equipped emblem if data is set
    if (this.data) {
      const backgroundPath = `${bungie}${this.data.emblemBackgroundPath}`;
      this.emblemBackground = this.domSanitizer.bypassSecurityTrustStyle(`url(${backgroundPath})`);
    }

    this.characterClass = this.manifest.getClass().pipe(
      map(rsp => rsp[this.data ? this.data.classHash : this.classHash]),
      map(characterClass => characterClass.displayProperties.name)
    );

    this.race = this.manifest.getRace().pipe(
      map(rsp => rsp[this.data ? this.data.raceHash : this.raceHash]),
      map(race => race.displayProperties.name)
    );

    this.gender = this.manifest.getGender().pipe(
      map(rsp => rsp[this.data ? this.data.genderHash : this.genderHash]),
      map(gender => gender.displayProperties.name)
    );
  }
}
