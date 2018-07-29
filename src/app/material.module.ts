import {NgModule} from '@angular/core';
import {MatAutocompleteModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

const matModules = [
  MatButtonModule,
  MatAutocompleteModule,
  MatFormFieldModule,
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
