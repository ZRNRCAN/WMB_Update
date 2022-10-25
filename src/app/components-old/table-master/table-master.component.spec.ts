import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMasterComponent } from './table-master.component';

describe('TableMasterComponent', () => {
  let component: TableMasterComponent;
  let fixture: ComponentFixture<TableMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
