import Query from "@arcgis/core/rest/support/Query";
import * as RestQuery from "@arcgis/core/rest/query";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Sketch from '@arcgis/core/widgets/Sketch';
import Expand from '@arcgis/core/widgets/Expand';

import { Observable } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { adminElem, searchOptions, widgetText } from "@ressources/index";
import { ServiceTable, ServiceData, optionList, inputList, provinceList } from "@ressources/index";

import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild, Injectable } from '@angular/core';

import { FormControl, FormGroup, Validators} from "@angular/forms";
import { MatExpansionPanel } from "@angular/material/expansion";
import { MatSelectChange } from "@angular/material/select";

import { QueryProxy } from '../testing/test-function'
import { HttpClient } from '@angular/common/http';
import { TableComponent } from "@app/table/table.component";

interface RowSelection {
  name: string;
  province: string;
  globalId: string;
}
interface SelectElement {
  value: string;
  viewValue: string
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class SearchComponent {
  public category: any = {
    mainInput: false, //main
    NationInput: false, //first nations
    planInput: false, //planForParcel
    canLandInput: false, //canadaLand
    tpGroup: false, //township
    provSelect: false, //province
    adminGroup: false, //admin group
    ltoInput: false, // plan with lto
  };

  // Search box elements
  public  inputLabel: string;
  public  inputTitle: string;
  public  options: Array<any> = optionList;
  public  provinces: Array<any>;
  public  form: FormGroup;
  public  filteredOptionsNation: Observable<any>;
  public  filteredOptionsLand: Observable<any>;
  public  adminElements: any = adminElem;
  private allProvinces: Array<any>;
  private searchOption: number;
  private initialValues: object;
  private searchType: string;

  // Selected provinces by user
  public selectedProv: Array<any>;
  public selectedDirection: string;
  public selectedAdminType: Array<any>;

  // Query search and field elements
  public queryFct: any;
  private where: string;
  private wmbQueryUrl: string;
  private outFields: Array<string>;
  public selection = new SelectionModel<RowSelection>(true, []);
  public opt: any;

  adminFeatures: any;
  projectFeatures: any;
  townFeatures: any;
  planFeatures: any;
  parcelFeatures: any;

  @ViewChild('matExpansionPanel', {static: true}) matExpansionPanelElement: MatExpansionPanel;

  constructor(private serviceTable: ServiceTable, private dataService: ServiceData, private httpClient: HttpClient, private tableComponent: TableComponent) {
    this.form = new FormGroup({
      mainInput: new FormControl(''),
      planForParcel: new FormControl(''),
      lto: new FormControl(''),
      sectionInput: new FormControl ('', [Validators.min(1), Validators.max(36)]),
      townshipInput: new FormControl('', [Validators.min(1), Validators.max(126)]),
      rangeInput: new FormControl('', [Validators.min(1), Validators.max(33)]),
      meridianInput: new FormControl('', [Validators.min(1), Validators.max(6)]),
      firstNatControl: new FormControl(''),
      canadaLandControl: new FormControl(''),
    });

    this.initialValues = this.form.value;
    this.queryFct = new QueryProxy(httpClient);
    this.opt = searchOptions;
  }

  private _filterNation(name: any): SelectElement[] {
    if (name.length < 3) {
      return [];
    }

    let where = "DESCRIPTION_E+like+%27%25" + name.toUpperCase() + "%25%27";
    let url = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/WMB_Query_Support/MapServer/2/query?where=" + where + "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=DESCRIPTION_E%2C+FIRSTNATIONID&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=description_e&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson";

    return this.queryFct.getResults(url, ["DESCRIPTION_E", "FIRSTNATIONID"]).then((response: any) => {
      return response.data;
    });
  }

  private _filterLand(name: any): SelectElement[] {
    if (name.length < 3) {
      return [];
    }
    
    let where = "ENGLISHNAME+like+%27%25" + name.toUpperCase() + "%25%27";
    let fields = ["ENGLISHNAME", "ADMINAREAID"];

    if (document.documentElement.lang === 'fr-CA') {
      where = "FRENCHNAME+like+%27%25" + name.toUpperCase() + "%25%27";
      fields = ["FRENCHNAME", "ADMINAREAID"];
    }
    let url = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/WMB_Query_Support/MapServer/0/query?where=" + where + "&outFields=" + fields[0] + "%2C+ADMINAREAID&returnGeometry=false&orderByFields=" + fields[0] + "&returnTrueCurves=false&f=pjson";

    return this.queryFct.getResults(url, fields).then((response: any) => {
      return response.data;
    });
  }

  setMapApi(mapView: any) {
    const graphicsLayerSketch = new GraphicsLayer();

    let sketchDiv = <HTMLElement>document.getElementById("spatial-selection");

    let sketch = new Sketch({
      layer: graphicsLayerSketch,
      view: mapView,
      visibleElements: {
        createTools: {
          circle: false,
          polygon: false,
          point: false,
          polyline: false
        },
        selectionTools: {
          "lasso-selection": false,
          "rectangle-selection":false,
        },
        settingsMenu: false,
        undoRedoMenu: false,
      },
      creationMode: "update",
    });

    mapView.map.layers.push(graphicsLayerSketch);

    const sketchExpand = new Expand({
      expandIconClass: "esri-icon-cursor-marquee \ue90f",
      content: sketch,
      view: mapView,
      expanded: true,
      container: sketchDiv,
      id: "sketchExpand",
      expandTooltip: widgetText.spatialExpand,
      collapseTooltip: widgetText.spatialCollapse
    });

    mapView.ui.add(sketchExpand, "top-right");

    sketch.on("update", (event: any) => {
      this.searchType = "sketch";

      if (event.state === "start") {
        this.setSketchQuery(event.graphics[0].geometry);
        let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>
        let clickedTab = document.getElementsByClassName(' click');

        if (tabContentActive.length > 0) {
          tabContentActive[0].style.display = "none";
          tabContentActive[0].classList.remove("active");
        }
        if (clickedTab.length > 0) {
          for (let i = clickedTab.length-1; i >= 0; i--) {
            clickedTab[i].classList.remove("click");
          }
        }
        this.tableComponent.hideResultMessage();
        this.tableComponent.showResultLoading();
      }
      else if (event.state === "complete") {
        graphicsLayerSketch.remove(event.graphics[0]);
      }
      else if (
        event.toolEventInfo && (
        event.toolEventInfo.type === "scale-stop" || 
        event.toolEventInfo.type === "reshape-stop" || 
        event.toolEventInfo.type === "move-stop" ||
        event.toolEventInfo.type === "rotate-stop")
        ) {
          this.setSketchQuery(event.graphics[0].geometry);
          let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>;
          let clickedTab = document.getElementsByClassName(' click');

          if (tabContentActive.length > 0) {
            tabContentActive[0].style.display = "none";
            tabContentActive[0].classList.remove("active");
          }
          if (clickedTab.length > 0) {
            for (let i = clickedTab.length-1; i >= 0; i--) {
              clickedTab[i].classList.remove("click");
            }
          }
          this.tableComponent.hideResultMessage();
          this.tableComponent.showResultLoading();
        }
    });
  }

  displayValues(user: SelectElement): string {
    return user && user.value ? user.viewValue : '';
  }

  ngOnInit() {
    this.allProvinces = provinceList.slice();

    this.filteredOptionsNation = this.firstNatControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(viewValue => {
          if (typeof(viewValue) != 'string') {
            return [];
          }
          return this._filterNation(viewValue);
        })
      );

    this.filteredOptionsLand = this.canadaLandControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(viewValue => {
          if (typeof(viewValue) != 'string') {
            return [];
          }
          return this._filterLand(viewValue);
        })       
      )}

  get mainInput(): string {
    return this.form.get('mainInput')?.value.toUpperCase();
  }
  get planForParcel(): string {
    return this.form.get('planForParcel')?.value.toUpperCase();
  }
  get lto(): string {
    return this.form.get('lto')?.value.toUpperCase();
  }
  get sectionInput(): number {
    return this.form.get('sectionInput')?.value;
  }
  get townshipInput(): number {
    return this.form.get('townshipInput')?.value;
  }
  get rangeInput(): number {
    return this.form.get('rangeInput')?.value;
  }
  get meridianInput(): number {
    return this.form.get('meridianInput')?.value;
  }
  get firstNatControl(): FormControl  {
    return this.form.controls['firstNatControl'] as FormControl;
  }
  get canadaLandControl(): FormControl  {
    return this.form.controls['canadaLandControl'] as FormControl;
  }

  resetSearchFormElem() {
    for(let key in this.category) {
      this.category[key] = false;
    }
  }

  setSearchFormElem(elemToSet: Array<string>) {
    for (let elem of elemToSet) {
      this.category[elem] = true;
    }
  }

  setSearchForm() {
    switch(this.searchOption) {
      case 0: //Community
      case 2: //Cree
      case 4: //Municipal
      case 5: //Park
      case 8: //QUAD
        this.setSearchFormElem(["mainInput", "provSelect"]);
        break;
      case 3: // Indian Reserve
        this.setSearchFormElem(["mainInput", "NationInput", "provSelect"]);
        break;
      case 6: // Parcel
        this.setSearchFormElem(["mainInput", "planInput", "canLandInput", "provSelect"]);
        break;
      case 7: // Protected Area
        this.setSearchFormElem(["mainInput", "planInput", "provSelect"]);
        break;
      case 9: // Plan
        this.setSearchFormElem(["planInput", "canLandInput", "ltoInput", "provSelect"]);
        break;
      case 10: // Project
        this.setSearchFormElem(["mainInput", "canLandInput", "provSelect"]);
        break;
      case 11: // Township
        this.setSearchFormElem(["tpGroup", "provSelect"]);
        break; 
      case 12: // Admin Group
        this.setSearchFormElem(["mainInput", "adminGroup", "provSelect"]);
        break; 
      default:
        break;
    }
  }

  resetButton() {
    this.selectedProv = [];
    this.selectedDirection = '';
    this.selectedAdminType = [];
    this.form.reset(this.initialValues);

    if ([0,2,3,4,5,7].includes(this.searchOption)) {
      this.searchOption = 12;
      this.setQuery(12, true);}

    this.filterProv(searchOptions[12].filter);
  }

  selectedValue(event: MatSelectChange) {
    // Reset form control
    this.selectedProv = [];
    this.selectedAdminType = [];
    this.form.reset(this.initialValues);

    // Set Param of expansion panel
    this.searchOption = event.value;
    this.inputLabel = inputList[event.value]['viewValue'];
    this.inputTitle = inputList[event.value]['title'];
    this.matExpansionPanelElement.expanded = true;
    this.matExpansionPanelElement.disabled = false;

    this.resetSearchFormElem();
    this.setSearchForm();
    this.setQuery(this.searchOption, true);
  }

  selectedAdminValue(event: MatSelectChange) {
    this.inputLabel = inputList[event.value]['viewValue'];
    this.inputTitle = inputList[event.value]['title'];
    this.searchOption = event.value;

    if (event.value === 3) {
      this.setSearchFormElem(["NationInput"]);
    }
    else if (event.value === 7) {
      this.category["NationInput"] = false;
      this.setSearchFormElem(["planInput"]);
    }
    else {
      this.category["NationInput"] = false;
      this.category["planInput"] = false;
    }
    this.setQuery(event.value, true);
  }

  removeByValue(arr: Array<any>, value: any) {
    let i = arr.length;
    while (i--) {
      if (arr[i] && arr[i].value === value) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }

  initProvince(provinceList: any) {
    this.provinces = provinceList;
  }

  filterProv(filterArr: Array<string>) {
    let copyProv = this.allProvinces.slice();

    for (let arr of filterArr) {
      this.removeByValue(copyProv, arr);
    }
    this.initProvince(copyProv);
  }

  setSketchQuery(geometry: __esri.Geometry) {
    this.dataService.removeData();
    this.tableComponent.resetMenuTitle();
    
    this.selection.clear();
    this.serviceTable.mapView.graphics.items = [];

    let searchOpt = [0, 2, 3, 4, 5, 6, 7, 9, 10, 11];
    this.executeForList(searchOpt, "", geometry);
    this.tableComponent.openTable();
    this.tableComponent.showTabButtons();
  }

  setQuery(option: number, isFilterByProv: boolean) {
    if (isFilterByProv) {
      this.filterProv(searchOptions[option].filter);
    }
    this.wmbQueryUrl = searchOptions[option].url;
    this.outFields = searchOptions[option].fields;
    this.where = this.outFields[0];
  }

  checkErrorAutocomplete(formCtrl: FormControl, list:any): boolean {
    if (formCtrl.value != "") {
      const index = list.findIndex((name: any) => {
        return name.viewValue === formCtrl.value.viewValue;
      });
  
      if (index < 0) {
        formCtrl.reset("");
        formCtrl.setErrors({'incorrect': true})
        return false;
      }
      else {
        return true;
      }
    }
    else {
      formCtrl.updateValueAndValidity();
      return true;
    }
  }

  submitSearch() {
    this.searchType = "box";
    this.tableComponent.hideResultMessage();
    this.tableComponent.showResultLoading();

    if (this.form.valid) {
      let whereOption = "";

      if (this.where == "TOWNSHIPSECTION" && this.form.value.sectionInput !== null && this.form.value.sectionInput !== '') {
        whereOption = `${this.where} = ${ this.sectionInput}`;
      }
      else if (this.where == "TOWNSHIPSECTION" && (this.form.value.sectionInput == null || this.form.value.sectionInput == '')) {
        whereOption = `${this.where} > 0`;
      }
      else {
        whereOption = `${this.where} LIKE '%${this.mainInput}%'`;
      }

      // Add province to search
      if (this.selectedProv.length === 1) {
        whereOption += ` AND PROVINCE LIKE '${this.selectedProv[0].toUpperCase()}%'`;
      }
      else if (this.selectedProv.length > 1) {
        whereOption += ` AND PROVINCE LIKE '${this.selectedProv[0].toUpperCase()}%'`;

        for (let i = 1; i < this.selectedProv.length; i++) {
          whereOption += ` OR PROVINCE LIKE '${this.selectedProv[i].toUpperCase()}%'`;
        }
      }

      // Add firstNation to search
      if (this.firstNatControl?.value) {
        whereOption += ` AND FIRSTNATION = '${this.firstNatControl.value.value}'`;
      }

      // Add plan number for parcel search
      if (this.form.value.planForParcel != "") {
        whereOption += ` AND PLANNO LIKE '%${this.planForParcel}%'`;
      }

      // Add lto for plan search
      if (this.form.value.lto != "") {
        whereOption += ` AND ALTERNATEPLANNO LIKE '%${this.lto}%'`;
      }

      // Add canada land
      if (this.canadaLandControl.value) {
        whereOption += ` AND GEOADMINCODE = '${this.canadaLandControl.value.value}'`;
      }

      // Add township number
      if (this.form.value.townshipInput != "" && this.form.value.townshipInput != null) {
        whereOption += ` AND TP = '${this.townshipInput}'`;
      }

      // Add range number
      if (this.form.value.rangeInput != "" && this.form.value.rangeInput != null) {
        whereOption += ` AND RANGE = ${this.rangeInput}`;
      }

      // Add meridian number
      if (this.form.value.meridianInput != "" && this.form.value.meridianInput != null) {
        whereOption += ` AND MERIDIAN = '${this.meridianInput}'`;
      }

      // Add direction to search
      if (this.selectedDirection) {
        whereOption += ` AND DIRECTION = '${this.selectedDirection}'`;
      }

      this.tableComponent.openTable();
      this.tableComponent.hideTabButtons();
      this.tableComponent.eraseTableData();
      this.tableComponent.resetMenuTitle();
      this.deleteFeatures();

      if (this.searchOption === 12) {
        this.executeForList([0,2,3,4,5,], whereOption);
      }
      else {
        this.tableComponent.showResultLoading();
        this.executeQuery(whereOption, this.wmbQueryUrl, this.searchOption);
      }
    }
    else {
      this.matExpansionPanelElement.expanded = true;
    }
  }

  async executeForList(list: Array<number>, where: string, geometry?: __esri.Geometry) {
    this.tableComponent.setLoadingTabs(true);
    for (let i of list) {
      this.setQuery(i, false);
      this.executeQuery(where, this.wmbQueryUrl, i, geometry);
    }
  }

  async executeSearchQuery(query: any, option: number, url: string): Promise<any> {
    const data = await RestQuery.executeQueryJSON(this.wmbQueryUrl, query);
    let menuItem;
    let totalResults = data.features.length;

    switch(option) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 8: {
        let adminData = this.serviceTable.setAdminResults(data, totalResults);
        this.dataService.addAdminPost(adminData);
        menuItem = 4;
        break;
      }
      case 6:
      case 7: {
        let parcelData = this.serviceTable.setParcelResults(data, totalResults);
        this.dataService.addParcelPost(parcelData);
        menuItem = 0;
        break;
      }
      case 9: {
        let planData = this.serviceTable.setPlanResults(data, totalResults);
        this.dataService.addPlanPost(planData);
        menuItem = 2;
        break;
      }
      case 10: {
        let projectData = this.serviceTable.setProjectResults(data, totalResults);
        this.dataService.addProjectPost(projectData);
        menuItem = 1;
        break;
      }
      case 11: {
        let townshipData = this.serviceTable.setTownshipResults(data, totalResults);
        this.dataService.addTownPost(townshipData);
        menuItem = 3;
        break;
      }
      default:
        break
    }
    return Promise.resolve({
      menu: menuItem,
    });
  }

  deleteFeatures() {
    this.adminFeatures = [];
    this.projectFeatures = [];
    this.townFeatures = [];
    this.parcelFeatures = [];
    this.planFeatures = [];
  }

  setTableResults(tableId: number) {
    switch (tableId) {
      case 4:
        this.adminFeatures = this.dataService.getAllAdminData();
        break;
      case 1:
        this.projectFeatures = this.dataService.getAllProjectData();
        break;
      case 2:
        this.planFeatures = this.dataService.getAllPlanData();
        break;
      case 3:
        this.townFeatures = this.dataService.getAllTownData();
        break;
      case 0:
        this.parcelFeatures = this.dataService.getAllParcelData();
        break;
      default:
        break;
    }
  }

  executeQuery(whereQuery: string, wmbQueryUrl: string, option: number, geometry?: any) {
    let query = new Query({
      returnGeometry: false,
      outFields: this.outFields,
      where: whereQuery,
      orderByFields: [this.where],
      returnDistinctValues: true,
    });

    if (geometry) {
      query.geometry = geometry;
    }

    if (this.searchType === "box") {
      let tableResults = this.executeSearchQuery(query, option, this.wmbQueryUrl);

      tableResults.then((promise) => {
        this.setTableResults(promise.menu);
        this.dataService.setTotalData();

        this.tableComponent.setMenuTitle(promise.menu);
        this.tableComponent.hideResultLoading();
        this.tableComponent.hideResultMessage();
        this.tableComponent.openDivTable(this.opt[this.searchOption].tab);
      })
    }
    else if (this.searchType === "sketch") {
      let tableResults = this.executeSearchQuery(query, option, wmbQueryUrl);

      tableResults.then((promise) => {
        this.dataService.setTotalData();
        this.tableComponent.setMenuTitle(promise.menu);
      })
    }
  }
}