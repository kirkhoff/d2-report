import {NgModule} from '@angular/core';
import {NumberArrayPipe} from './number-array.pipe';

@NgModule({
  declarations: [NumberArrayPipe],
  exports: [NumberArrayPipe]
})
export class SharedModule {}
