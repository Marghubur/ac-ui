import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BhConfettiComponent } from './bh.confetti.component';

describe('BhConfettiComponent', () => {
  let component: BhConfettiComponent;
  let fixture: ComponentFixture<BhConfettiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BhConfettiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BhConfettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
