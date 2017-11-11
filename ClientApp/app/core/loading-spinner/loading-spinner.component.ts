import { Component, Input } from '@angular/core';

@Component({
  selector: "loading-spinner",
  templateUrl: "./loading-spinner.component.html",
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  /** Defines how many bar div elements shall be generated for which spinner size. */
  private static readonly barAmounts = Object.freeze({
    small: 10,
    large: 14
  });
  private _size: string = "small";

  @Input()
  public get size(): string {
    return this._size;
  }
  public set size(newSize: string) {
    this._size = newSize;
    this.setBarAmount(LoadingSpinnerComponent.barAmounts[newSize]);
  }

  /** This array allows us to use *ngFor a given amount of times. There is no other purpose. */
  public bars: Array<any>;

  private setBarAmount(amount: number) {
    this.bars = new Array(amount);
  }
}
