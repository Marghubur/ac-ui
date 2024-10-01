import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInvestmentComponent } from './user-investment.component';

describe('UserInvestmentComponent', () => {
  let component: UserInvestmentComponent;
  let fixture: ComponentFixture<UserInvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInvestmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
