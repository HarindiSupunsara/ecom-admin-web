import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderAlertComponent } from './file-uploader-alert.component';

describe('FileUploaderAlertComponent', () => {
  let component: FileUploaderAlertComponent;
  let fixture: ComponentFixture<FileUploaderAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploaderAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploaderAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
