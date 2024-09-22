import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { ErrorToast, FireBrowser, Toast, WarningToast } from '../../../providers/common-service/common.service';
import { CommonModule } from '@angular/common';
import { ResponseModel } from '../../../auth/jwtService';
import { CoreHttpService } from '../../../providers/AjaxServices/core-http.service';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [BreadcrumsComponent, CommonModule],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss'
})
export class MasterDataComponent implements OnInit {
  isUploadFile: boolean = true;
  file: File;
  fileSize: string;
  fileName: string;
  isFileReady: boolean = false;
  noOfRecords: number;
  recordToUpload: any;
  isDisable: boolean = true;
  isAvailable: boolean = false;
  isLoading: boolean = false;

  constructor(private layout: LayoutComponent,
              private http: CoreHttpService
  ) {
  }

  ngOnInit() {
    this.layout.stopSkeleton();
  }

  getEmployeeSampleFile() {
    let sampleFilePath = "https://www.bottomhalf.in/bts/resources/applications/axil/axilcorps.xlsx";
    const a = document.createElement('a');
    a.href = sampleFilePath;
    a.download = 'EmployeeRecordSample.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(sampleFilePath);
  }

  excelfireBrowserFile() {
    FireBrowser("uploadexcelreader");
  }

  uploadEmployeeExcelSheet() {
    this.isLoading = true;
    if (this.file) {
      let formData = new FormData();
      formData.append("userExcel", this.file);
      this.http.post("user/addUserExcel", formData)
      .then((response: ResponseModel) => {
        if (response.ResponseBody) {
          this.cleanFileHandler();
          Toast("Data Uploaded successfull");
          this.isLoading = false;
        } else {
          ErrorToast("Unable to upload the data");
        }
      }).catch(e => {
        ErrorToast(e.HttpStatusMessage)
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
      WarningToast("Please upload atleast one record");
    }
  }

  cleanFileHandler() {
    const uploadExcelElement = document.getElementById('uploadexcelreader') as HTMLInputElement;
    if (uploadExcelElement) {
      uploadExcelElement.value = '';
    }
    this.fileSize = "";
    this.fileName = "";
    this.isFileReady = false;
    this.noOfRecords = 0;
    event.stopPropagation();
    event.preventDefault();
    this.isAvailable=false;
    this.isDisable = true;
    this.isUploadFile = true;
  }

  readExcelData(e: any) {
    this.file = e.target.files[0];
    if (this.file !== undefined && this.file !== null) {
      this.fileSize = (this.file.size / 1024).toFixed(2);
      this.fileName = this.file.name;
      this.isFileReady = true;
      this.isDisable = false;
      this.isUploadFile = false;
    }
  }
}
