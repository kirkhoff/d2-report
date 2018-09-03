import {NgModule} from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatSelectModule, MatSidenavModule,
  MatTableModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

const matModules = [
  MatButtonModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatSelectModule,
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
