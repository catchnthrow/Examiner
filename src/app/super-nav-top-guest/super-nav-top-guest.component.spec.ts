import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperNavTopGuestComponent } from './super-nav-top-guest.component';

describe('SuperNavTopComponent', () => {
  let component: SuperNavTopGuestComponent;
  let fixture: ComponentFixture<SuperNavTopGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperNavTopGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperNavTopGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
