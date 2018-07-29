import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

export interface CrucibleData {
  name: string;
  avgKd: number;
}

export class CrucibleDataSource extends DataSource<CrucibleData> {
  constructor(private list: Observable<CrucibleData[]>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<CrucibleData[]> {
    return this.list;
  }

  disconnect(collectionViewer: CollectionViewer) {}
}
