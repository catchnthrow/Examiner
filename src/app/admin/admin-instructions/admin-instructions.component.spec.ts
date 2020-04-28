import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstructionsComponent } from './admin-instructions.component';

describe('AdminInstructionsComponent', () => {
  let component: AdminInstructionsComponent;
  let fixture: ComponentFixture<AdminInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
