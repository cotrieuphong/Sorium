import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerConfirmComponent } from './owner-confirm.component';

describe('OwnerConfirmComponent', () => {
  let component: OwnerConfirmComponent;
  let fixture: ComponentFixture<OwnerConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
