import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperNavTopContainerComponent } from './super-nav-top-container.component';

describe('SuperNavTopContainerComponent', () => {
  let component: SuperNavTopContainerComponent;
  let fixture: ComponentFixture<SuperNavTopContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperNavTopContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperNavTopContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
