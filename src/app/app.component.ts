import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
      public matIconRegistry: MatIconRegistry,
    ) {
      matIconRegistry.registerFontClassAlias ('fa');
    }

}
