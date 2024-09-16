import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { BtButtonComponent } from '../bt-button/bt-button.component';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'button-submit',
  template: `<bt-button text="{{text}}" icon="{{icon}}" redirect="{{redirect}}" className="{{className}}" (onClick)="handleClick()"></bt-button>`,
  styleUrls: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [RouterLink, BtButtonComponent]
})
export class ButtonSubmitComponent extends BtButtonComponent {
}
