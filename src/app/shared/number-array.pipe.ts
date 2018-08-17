import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numArr'
})
export class NumberArrayPipe implements PipeTransform {
  transform(value: number): number[] {
    return Array(value).fill(value).map((x, i) => i);
  }
}
