import { Component, OnInit, Input, SimpleChanges, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ServiceTable, ZoomToElement} from "@ressources/index";
import { Column, RowSelection } from './column';

@Component({
  selector: 'app-table-master',
  templateUrl: './table-master.component.html',
  styleUrls: ['./table-master.component.css']
})

export class TableMasterComponent implements OnInit {

  constructor(private serviceTable: ServiceTable) { }

  @Input() tableColumns: Array<Column> = [];
  @Input() tableData: Array<any> = [];

  @ViewChild('adminPaginator') adminPaginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  //@ViewChild('table') table: MatTable<any>;

  displayedColumns: Array<string> = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selection = new SelectionModel<RowSelection>(true, []);
  private zoom: any;

  ngOnInit(): void {
    this.zoom = new ZoomToElement(this.serviceTable);
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof(changes['tableData'].currentValue) != 'undefined') {
      this.dataSource  = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.adminPaginator;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator.pageIndex = 0;
    }
  }
  
  openLink(url: string) {
    window.open(url, "_blank");
  }

  zoomToElement(id: string, province: string) {
    this.zoom.getResult(province, id, 'click');
  }

  changeRowSelection(row: RowSelection) {

    if (typeof(row.parcelType) != 'undefined') {
      this.zoom.setColor([13, 13, 12, 0.35], [252, 186, 3, 0.35]);
    }
    else {
      this.zoom.setColor([51, 255, 255], [125, 125, 125, 0.35]);
    }

    let isRowSelected = this.selection.isSelected(row);
    if (isRowSelected) {
      this.zoom.getResult(row.province, row.globalId, 'mouseover');
    }
    else {
      this.zoom.removeFeature(row.globalId);
    }
  }

}