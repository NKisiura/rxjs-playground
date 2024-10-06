import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-breakout",
  standalone: true,
  imports: [],
  templateUrl: "./breakout.component.html",
  styleUrl: "./breakout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreakoutComponent {}
