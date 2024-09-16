import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bt-record-not-found',
  standalone: true,
  imports: [],
  templateUrl: './bt-record-not-found.component.html',
  styleUrl: './bt-record-not-found.component.scss'
})
export class BtRecordNotFoundComponent {
  @Input() Title: string = "";
  @Input() SubTitle: string = "";

}
