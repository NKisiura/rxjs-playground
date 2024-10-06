import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "breakout",
    loadComponent: () =>
      import("./pages/breakout/breakout.component").then(
        ({ BreakoutComponent }) => BreakoutComponent,
      ),
  },
  {
    path: "alphabet-invasion",
    loadComponent: () =>
      import("./pages/alphabet-invasion/alphabet-invasion.component").then(
        ({ AlphabetInvasionComponent }) => AlphabetInvasionComponent,
      ),
  },
  {
    path: "",
    redirectTo: "breakout",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "breakout",
  },
];
