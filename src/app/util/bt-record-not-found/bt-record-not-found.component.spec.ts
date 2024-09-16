import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtRecordNotFoundComponent } from './bt-record-not-found.component';

describe('BtRecordNotFoundComponent', () => {
  let component: BtRecordNotFoundComponent;
  let fixture: ComponentFixture<BtRecordNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtRecordNotFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtRecordNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
