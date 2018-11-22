import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceDetailComponent } from './province-detail.component';

describe('ProvinceDetailComponent', () => {
  let component: ProvinceDetailComponent;
  let fixture: ComponentFixture<ProvinceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvinceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
