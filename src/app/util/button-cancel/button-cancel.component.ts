import { Component } from '@angular/core';
import { BtButtonComponent } from '../bt-button/bt-button.component';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'button-cancel',
  template: `<bt-button
                text="{{text}}"
                icon="{{icon}}"
                redirect="{{redirect}}"
                className="{{className}}"
                (onClick)="handleClick()">
              </bt-button>`,
  styleUrls: [],
  imports: [RouterLink, BtButtonComponent]
})
export class ButtonCancelComponent extends BtButtonComponent {

}
