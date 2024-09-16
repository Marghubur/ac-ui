import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'card-widget',
  templateUrl: './card-widget.component.html',
  styleUrls: ['./card-widget.component.scss'],
  imports: [CommonModule]
})
export class CardWidgetComponent {
  cardTitle: string = null;
  loading: boolean = false;

  @Input()
  set title(value: string) {
    this.cardTitle = value;
  }

  @Input()
  set isLoading(value: boolean) {
    this.loading = value;
  }

  get isLoading(): boolean {
    return this.loading;
  }
}
