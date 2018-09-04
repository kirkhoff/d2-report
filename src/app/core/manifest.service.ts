import {Injectable} from '@angular/core';
import {CoreModule} from './core.module';
import {Observable} from 'rxjs';
import {
  BungieManifestResponse,
  DestinyClassDefinition,
  DestinyDefinition,
  DestinyGenderDefinition, DestinyInventoryBucketDefinition, DestinyInventoryItemDefinition,
  DestinyRaceDefinition,
  RawBungieManifest
} from './manifest.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: CoreModule
})
export class ManifestService {
  constructor(private http: HttpClient) {}

  private getManifest(): Observable<RawBungieManifest> {
    const url = 'https://destiny.plumbing/index.json';
    return this.http.get<BungieManifestResponse>(url).pipe(
      map(rsp => rsp.en.raw)
    );
  }

  getRace(): Observable<DestinyDefinition<DestinyRaceDefinition>> {
    return this.getManifest().pipe(
      switchMap(manifest => this.http.get<DestinyDefinition<DestinyRaceDefinition>>(manifest.DestinyRaceDefinition))
    );
  }

  getGender(): Observable<DestinyDefinition<DestinyGenderDefinition>> {
    return this.getManifest().pipe(
      switchMap(manifest => this.http.get<DestinyDefinition<DestinyGenderDefinition>>(manifest.DestinyGenderDefinition))
    );
  }

  getClass(): Observable<DestinyDefinition<DestinyClassDefinition>> {
    return this.getManifest().pipe(
      switchMap(manifest => this.http.get<DestinyDefinition<DestinyClassDefinition>>(manifest.DestinyClassDefinition))
    );
  }

  getInventoryItem(): Observable<DestinyDefinition<DestinyInventoryItemDefinition>> {
    return this.getManifest().pipe(
      switchMap(manifest => this.http.get<DestinyDefinition<DestinyInventoryItemDefinition>>(manifest.DestinyInventoryItemDefinition))
    );
  }

  getInventoryBucket(): Observable<DestinyDefinition<DestinyInventoryBucketDefinition>> {
    return this.getManifest().pipe(
      switchMap(manifest => this.http.get<DestinyDefinition<DestinyInventoryBucketDefinition>>(manifest.DestinyInventoryBucketDefinition))
    );
  }
}
