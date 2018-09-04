import {BucketCategory, BucketScope, DestinyClass, DestinyGender, DestinyRace, ItemLocation} from './bungie.enums';

export interface DestinyDefinition<T> {
  [hash: number]: T;
}

export interface BungieManifestResponse {
  id: string;
  lastUpdated: string;
  bungieManifestVersion: string;
  en: {
    raw: RawBungieManifest;
    reducedCollectableInventoryItems: string;
    reducedActivities: string;
  };
  history: string;
}

export interface RawBungieManifest {
  DestinyRaceDefinition: string;
  DestinyGenderDefinition: string;
  DestinyClassDefinition: string;
  DestinyInventoryItemDefinition: string;
  DestinyInventoryBucketDefinition: string;
}

export interface DestinyRaceDefinition {
  raceType: DestinyRace;
  displayProperties: DestinyDisplayPropertiesDefinition;
  hash: number;
  index: number;
  redacted: boolean;
}

export interface DestinyGenderDefinition {
  genderType: DestinyGender;
  displayProperties: DestinyDisplayPropertiesDefinition;
  hash: number;
  index: number;
  redacted: boolean;
}

export interface DestinyClassDefinition {
  classType: DestinyClass;
  displayProperties: DestinyDisplayPropertiesDefinition;
  hash: number;
  index: number;
  redacted: boolean;
}

export interface DestinyDisplayPropertiesDefinition {
  description: string;
  name: string;
  icon: string;
  hasIcon: boolean;
}

export interface DestinyInventoryItemDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  secondaryIcon: string;
  secondaryOverlay: string;
  secondarySpecial: string;
  backgroundColor: DestinyColor;
  screenshot: string;
  itemDisplayName: string;
  classType: DestinyClass;
  // TODO fill this out (there's a lot)
}

export interface DestinyInventoryBucketDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  scope: BucketScope;
  category: BucketCategory;
  bucketOrder: number;
  itemCount: number;
  location: ItemLocation;
  hasTransferDestination: boolean;
  fifo: boolean;
  hash: number;
  index: number;
  redacted: boolean;
}

export interface DestinyColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}
