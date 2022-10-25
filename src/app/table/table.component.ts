import { Component, OnInit, Input, Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceTable, ServiceData, ZoomToElement, menuElem} from "@ressources/index";
import { exportToCsv } from '@shared/export-element';
import { csvHeaders } from '@ressources/text-items';
import { columnsHeaderLang } from '../table-master/column';

interface RowSelection {
  name: string;
  province: string;
  globalId: string;
}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  step: number = 0;
  dataSource: Array<any> = [];
  totalFeatures: number = 0;

  public  menuListItems: any;
  private allMenuListItems: Array<any>;

  public selection = new SelectionModel<RowSelection>(true, []);
  public dataSourceAdmin: MatTableDataSource<any>;
  public isCloseClicked: boolean = false;
  public zoom: any;

  tableColumnsAdmin: Array<any> = [
    {columnDef: 'select', header: columnsHeaderLang.select, field: 0, cell: (element: Record<string, any>) => `${element['name']}`},
    {columnDef: 'name', header: columnsHeaderLang.name, field: 1, cell: (element: Record<string, any>) => `${element['name']}`},
    {columnDef: 'province', header: columnsHeaderLang.province, field: 2, cell: (element: Record<string, any>) => `${element['province']}`,},
    {columnDef: 'dataset', header: columnsHeaderLang.data, isDownload: true, }
  ];
  tableColumnsProject: Array<any> = [
    { columnDef: 'select', header: columnsHeaderLang.select, field: 0, cell: (element: Record<string, any>) => `${element['projectNumber']}` },
    { columnDef: 'projectNumber', header: columnsHeaderLang.project, field: 1, cell: (element: Record<string, any>) => `${element['projectNumber']}`},
    { columnDef: 'description', header: 'Description', field: 2, cell: (element: Record<string, any>) => `${element['description']}` },
    { columnDef: 'detail', header: columnsHeaderLang.detail, field: 3, title: columnsHeaderLang.projectDetail, detail: (element: Record<string, any>) => `${element['projectDetail']}`, cell: (element: Record<string, any>) => columnsHeaderLang.view},
  ];
  tableColumnsPlan: Array<any> = [
    { columnDef: 'select', header: columnsHeaderLang.select, field: 0, cell: (element: Record<string, any>) => `${element['planNumber']}` },
    { columnDef: 'planNumber', header: columnsHeaderLang.plan, field: 1, cell: (element: Record<string, any>) => `${element['planNumber']}`},
    { columnDef: 'description', header: 'Description', field: 2, cell: (element: Record<string, any>) => `${element['description']}` },
    { columnDef: 'dateSurvey', header: columnsHeaderLang.date, field: 2, cell: (element: Record<string, any>) => `${element['dateSurvey']}` },
    { columnDef: 'planLTO', header:  columnsHeaderLang.lto, field: 2, cell: (element: Record<string, any>) => `${element['planLTO']}` },
    { columnDef: 'detail', header: columnsHeaderLang.detail, field: 3, title: columnsHeaderLang.planDetail, detail: (element: Record<string, any>) => `${element['planDetail']}`, cell: (element: Record<string, any>) => columnsHeaderLang.view},
  ];
  tableColumnsTown: Array<any> = [
    { columnDef: 'select', header: columnsHeaderLang.select, field: 0, cell: (element: Record<string, any>) => `${element['sectionName']}` },
    { columnDef: 'sectionName', header: 'Section', field: 1, cell: (element: Record<string, any>) => `${element['sectionName']}`},
    { columnDef: 'townshipName', header: columnsHeaderLang.town, field: 2, cell: (element: Record<string, any>) => `${element['townshipName']}` },
    { columnDef: 'range', header: columnsHeaderLang.range, field: 2, cell: (element: Record<string, any>) => `${element['range']}` },
    { columnDef: 'meridian', header:  columnsHeaderLang.meridian, field: 2, cell: (element: Record<string, any>) => `${element['meridian']}` },
    { columnDef: 'direction', header: 'Direction', field: 2, cell: (element: Record<string, any>) => `${element['direction']}`},
    { columnDef: 'province', header: columnsHeaderLang.province, field: 2, cell: (element: Record<string, any>) => `${element['province']}`},
  ];
  tableColumnsParcel: Array<any> = [
    { columnDef: 'select', header: columnsHeaderLang.select, field: 0, cell: (element: Record<string, any>) => `${element['parcelName']}`},
    { columnDef: 'parcelName', header: columnsHeaderLang.parcelName, field: 1, cell: (element: Record<string, any>) => `${element['parcelName']}`},
    { columnDef: 'remainder', header: columnsHeaderLang.remainder, field: 2, cell: (element: Record<string, any>) => `${element['remainder']}` },
    { columnDef: 'planNumber', header: columnsHeaderLang.plan, field: 3, title: columnsHeaderLang.planDetail, detail: (element: Record<string, any>) => `${element['planDetail']}`, cell: (element: Record<string, any>) => `${element['planNumber']}` },
    { columnDef: 'parcelType', header:  columnsHeaderLang.parcelType, field: 2, cell: (element: Record<string, any>) => `${element['parcelType']}` },
  ];

  constructor(private serviceData: ServiceData, private serviceTable: ServiceTable) {
    this.allMenuListItems = menuElem.slice();
  }

  @Input() town: any = {features: []};
  @Input() plan: any = {features: []};
  @Input() project: any = {features: []};
  @Input() parcel: any = {features: []};
  @Input() admin: any = {features: []};

  //@ViewChild('table') table: MatTable<any>;

  ngOnInit(): void {
    this.totalFeatures = 0;
    this.zoom = new ZoomToElement(this.serviceTable);
  }

  //ngOnChanges(changes: SimpleChanges) {
  //  this.tableData = this.features;
  //}

  showResultLoading() {
    (document.getElementById("result-spinner") as HTMLElement).hidden = false;
  }
  hideResultLoading() {
    (document.getElementById("result-spinner") as HTMLElement).hidden = true;
  }
  showResultMessage() {
    (document.getElementById("result-message") as HTMLElement).hidden = false;
  }
  hideResultMessage() {
    (document.getElementById("result-message") as HTMLElement).hidden = true;
  }
  showTabButtons() {
    (document.getElementById("tabButton") as HTMLButtonElement).hidden = false;
  }
  hideTabButtons() {
    (document.getElementById("tabButton") as HTMLButtonElement).hidden = true;
  }

  resetGraphic() {
    this.zoom.keepGraph = false;
    this.zoom.resetGraphGlobal();
  }

  keepGraphic() {
    this.zoom.keepGraph = true;
  }

  eraseTableData() {
    this.serviceData.removeData();
    this.serviceTable.mapView.graphics.items = [];
  }

  openDivTable(id: string) {
    let tabContent = <HTMLElement>document.getElementById(id);
    let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>;
    tabContent.classList.remove("hidden");

    if (tabContentActive.length > 0) {
      tabContentActive[0].style.display = "none";
      tabContentActive[0].classList.remove("active")
    }

    tabContent.className+= ' active';
    tabContent.style.display = "block";
  }

  openTab(id: string) {
    this.openDivTable(id);
    this.clickMenuItem(id);
    this.hideResultMessage();
  }

  openTable() {
    let tabContent = <HTMLElement>document.getElementById('tableResults');
    tabContent.classList.remove("hidden");
    tabContent.hidden = false;
  }

  clickMenuItem(id: string) {
    switch (id) {
      case 'divAdmin':
        this.admin = this.serviceData.getAllAdminData();
        break;
      case 'divProject':
        this.project = this.serviceData.getProjectData()[0];
        break;
      case 'divPlan':
        this.plan = this.serviceData.getAllPlanData();
        break;
      case 'divTownship':
        this.town = this.serviceData.getTownData()[0];
        break;
      case 'divParcel':
        this.parcel = this.serviceData.getAllParcelData();
        break;
      default:
        break;
    }
   }

  openMenu() {
    if (typeof this.menuListItems == 'undefined') {
      this.menuListItems = this.allMenuListItems;
    }
  }

  initMenu(menuList: Array<any>) {
    this.menuListItems = menuList;
  }

  resetMenuTitle() {
    let copyMenuItems = this.allMenuListItems.slice();
    let arr = copyMenuItems.splice(0);
    this.initMenu(arr);

    for (let i = 0; i < arr.length; i++) {
      arr[i].total = 0;
      this.menuListItems[i].menuLinkText = arr[i].menuLinkText.split(" (")[0];
      this.menuListItems[i].isDisabled = true;
    }
  }

  setMenuTitle(menuIndex: number) {
    let copyMenuItems = this.allMenuListItems.slice();
    let arr = copyMenuItems.splice(0);

    let total = this.serviceData.getTotalData()[menuIndex];
    let menuString = `${arr[menuIndex].menuLinkText.split(" (")[0]} (${total})`;

    this.menuListItems[menuIndex].menuLinkText = menuString;
    this.menuListItems[menuIndex].isDisabled = false;
    let htmlText = `${this.menuListItems[menuIndex].menuLinkText}`;
    let button: any;

    switch(menuIndex) {
      case 0:
        button = <HTMLButtonElement>document.getElementById('parcelButton');
        break;
      case 1:
        button = <HTMLButtonElement>document.getElementById('projectButton');
        break;
      case 2:
        button = <HTMLButtonElement>document.getElementById('planButton');
        break;
      case 3:
        button = <HTMLButtonElement>document.getElementById('townButton');
        break;
      case 4:
        button = <HTMLButtonElement>document.getElementById('adminButton');
        break;
      default:
        break;
    }
    button.innerText = htmlText;
    button.title = htmlText;

    this.step+= 1;
    if (this.step%10 === 0) {
      this.setLoadingTabs(false);
    }
  }

  setLoadingTabs(isLoading: boolean) {
    let tabs = document.getElementById('tabButton') as HTMLElement;
    let tabChildren = tabs.children as HTMLCollection;

    for (let i=0; i<tabChildren.length; i++) {
      let button = tabChildren.item(i) as HTMLButtonElement;

      if (isLoading) {
        button.disabled = true;
        button.style.cursor = 'progress';
      }
      else {
        button.disabled = false;
        button.style.cursor = 'pointer';
        this.showResultMessage();
        this.hideResultLoading();
      }
    }
  }

  exportResult() {
    let results: any;
    let headers: string[] = [];

    const tabActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>;
    const id = tabActive[0].id;
    switch(id) {
      case 'divAdmin': {
        results = this.admin;
        headers = csvHeaders.divAdmin;
        break;
      }
      case 'divPlan': {
        results = this.plan;
        headers = csvHeaders.divPlan;
        break;
      }
      case 'divParcel': {
        results = this.parcel;
        headers = csvHeaders.divParcel;
        break;
      }
      case 'divTownship': {
        results = this.town;
        headers = csvHeaders.divTownship;
        break;
      }
      case 'divProject': {
        results = this.project;
        headers = csvHeaders.divProject;
        break;
      }
    }

    let filteredResults = results.map(function(item: any) {
      delete item.globalId
      return Object.keys(item).map((key) => item[key]);
    })

    exportToCsv('data.csv', filteredResults, headers);
  }
}