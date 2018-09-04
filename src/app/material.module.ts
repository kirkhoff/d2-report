import {NgModule} from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSidenavModule,
} from '@angular/material';

const matModules = [
  MatButtonModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatSelectModule,
  MatSidenavModule
];

@NgModule({
  imports: matModules,
  exports: matModules
})
export class MaterialModule {}
