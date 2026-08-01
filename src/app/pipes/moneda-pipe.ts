import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda'
})
export class MonedaPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '₡0.00';
    }

    return `₡${value.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

}
