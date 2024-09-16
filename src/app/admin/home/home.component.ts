import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtRecordNotFoundComponent } from '../../util/bt-record-not-found/bt-record-not-found.component';
import { LayoutComponent } from '../../layout/layout/layout.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ CommonModule, BtRecordNotFoundComponent ],
})
export class HomeComponent implements OnInit {


  constructor(private layout: LayoutComponent) {
  }

  ngOnInit() {
    this.layout.stopSkeleton();
  }


}
