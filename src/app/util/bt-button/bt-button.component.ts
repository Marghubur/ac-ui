import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../../providers/common-service/common.service';

@Component({
  standalone: true,
  selector: 'bt-button',
  templateUrl: './bt-button.component.html',
  styleUrls: ['./bt-button.component.scss'],
  imports: [RouterLink, CommonModule]
})
export class BtButtonComponent {
  private _className: string = "";
  @Output() onClick = new EventEmitter();

  @Input() text: string = ""
  @Input() buttonType: number = 0;
  @Input() redirect: string = "";
  @Input() icon: string = "";
  isLoading: boolean = false;

  @Input() set className(value: string) {
    this._className = ` btn rounded-pill
                        ${
                            value.includes('bt-success') ? `btn-success ${value}` :
                            value.includes('bt-dark') ? `btn-primary-dark  ${value}` :
                            value.includes('bt-primary') ? 'btn-primary-c' : value} `;
  }

  get className(): string {
    return this._className;
  }

  constructor(private commonService: CommonService) {
    this.commonService.isLoading.subscribe(res => this.isLoading = res)
  }


  handleClick(): void {
    this.onClick.emit();
  }
}
