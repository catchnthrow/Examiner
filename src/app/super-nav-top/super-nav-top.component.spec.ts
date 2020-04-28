import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperNavTopComponent } from './super-nav-top.component';

describe('SuperNavTopComponent', () => {
  let component: SuperNavTopComponent;
  let fixture: ComponentFixture<SuperNavTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperNavTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperNavTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
