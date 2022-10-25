import { Injectable } from '@angular/core';

 interface ResultTable {
  name: string;
  province: string;
}

@Injectable({
  providedIn: 'root'
})

export class ServiceData {
  private ADMIN_DATA: ResultTable[] = [];
  private PROJECT_DATA: ResultTable[] = [];
  private PLAN_DATA: ResultTable[] = [];
  private TOWN_DATA: ResultTable[] = [];
  private PARCEL_DATA: ResultTable[] = [];
  private totalData = {
    admin: 0,
    project: 0,
    plan: 0,
    town: 0,
    parcel: 0,
  };

  constructor() {}

  getData(id: string): any {
    if (id === "divAdmin") {
      return this.getAdminData();
    }
    else if (id === "divProject") {
      return this.getProjectData();
    }
    else if (id === "divTownship") {
      return this.getTownData();
    }
    else if (id === "divParcel") {
      return this.getParcelData();
    }
    else if (id === "divPlan") {
      return this.getPlanData();
    }
  }

  setTotalData() {
    this.totalData.admin = this.getAllAdminData().length;
    this.totalData.project = this.getAllProjectData().length;
    this.totalData.plan = this.getAllPlanData().length;
    this.totalData.town = this.getAllTownData().length;
    this.totalData.parcel = this.getAllParcelData().length;
  }

  getTotalData(): any {
    return {
      0: this.totalData.parcel,
      1: this.totalData.project,
      2: this.totalData.plan,
      3: this.totalData.town,
      4: this.totalData.admin,
    };
  }

  getAllAdminData() {
    return [].concat.apply([], this.getAdminData());
  }
  getAllParcelData() {
    return [].concat.apply([], this.getParcelData());
  }
  getAllPlanData() {
    return [].concat.apply([], this.getPlanData());
  }
  getAllTownData() {
    return [].concat.apply([], this.getTownData());
  }
  getAllProjectData() {
    return [].concat.apply([], this.getProjectData());
  }

  getAdminData(): any {
    return this.ADMIN_DATA;
  }
  getProjectData(): any {
    return this.PROJECT_DATA;
  }
  getPlanData(): any {
    return this.PLAN_DATA;
  }
  getTownData(): any {
    return this.TOWN_DATA;
  }
  getParcelData(): any {
    return this.PARCEL_DATA;
  }

  addAdminPost(data: any) {
    this.ADMIN_DATA.push(data);
  }
  addProjectPost(data: any) {
    this.PROJECT_DATA.push(data);
  }
  addPlanPost(data: any) {
    this.PLAN_DATA.push(data);
  }
  addTownPost(data: any) {
    this.TOWN_DATA.push(data);
  }
  addParcelPost(data: any) {
    this.PARCEL_DATA.push(data);
  }

  countAdminFeatures(): number {
    return this.ADMIN_DATA.length;
  }

  removeData() {
    this.ADMIN_DATA = [];
    this.PROJECT_DATA = [];
    this.PLAN_DATA = [];
    this.TOWN_DATA = [];
    this.PARCEL_DATA = [];
  }
}