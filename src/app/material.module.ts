import {NgModule} from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
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
  MatTableModule
];

@NgModule({
  imports: matModules,
  exports: matModules.concat([
    CdkTableModule
  ])
})
export class MaterialModule {}
