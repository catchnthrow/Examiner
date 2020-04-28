import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperNavTopAdminComponent } from './super-nav-top-admin.component';

describe('SuperNavTopAdminComponent', () => {
  let component: SuperNavTopAdminComponent;
  let fixture: ComponentFixture<SuperNavTopAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperNavTopAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperNavTopAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
