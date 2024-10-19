import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTransactionComponent } from './daily-transaction.component';

describe('DailyTransactionComponent', () => {
  let component: DailyTransactionComponent;
  let fixture: ComponentFixture<DailyTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
