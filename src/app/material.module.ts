import {NgModule} from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatSidenavModule,
  MatTableModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

const matModules = [
  MatButtonModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatTableModule,
  MatSidenavModule
];

@NgModule({
  imports: matModules,
  exports: matModules.concat([
    CdkTableModule
  ])
})
export class MaterialModule {}
