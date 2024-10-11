import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatAnchor, RouterLinkActive],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public readonly sidebarLinks: Link[] = [
    {
      route: "breakout",
      label: "breakout",
    },
    {
      route: "alphabet-invasion",
      label: "alphabet invasion",
    },
  ];
}

interface Link {
  readonly route: string;
  readonly label: string;
}
