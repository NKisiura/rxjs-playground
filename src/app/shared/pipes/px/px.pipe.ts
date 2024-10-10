import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "px",
  standalone: true,
})
export class PxPipe implements PipeTransform {
  transform(value: number): `${number}px`;
  transform(value: string): `${string}px`;
  transform(value: null): null;
  transform(value: number | null): `${number}px` | null;
  transform(value: string | null): `${string}px` | null;
  transform(value: number | string | null): `${number | string}px` | null {
    if (!value) return null;

    return `${value.toString()}px`;
  }
}
