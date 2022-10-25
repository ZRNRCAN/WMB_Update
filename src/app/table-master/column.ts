export interface Column {
    columnDef: string;
    header: string;
    cell: Function;
    isAdmin?: boolean;
    isSelection?: boolean;
    isDownload?: boolean;
    isZoom?: boolean;
    url?: string;
    title: string;
    fct?: string;
    fonct?: string;
    field: number;
    detail: Function;
  }

export interface RowSelection {
    name: string;
    province: string;
    globalId: string;
    parcelType: string;
 }

const columnsHeader: any = {
  "fr-CA": {
    select: 'Sélectionner',
    name: 'Nom',
    province: 'Province/Territoire',
    data: 'Données',
    project: 'Numéro du projet',
    plan: 'Numéro de plan',
    detail: 'Détails',
    date: "Date de l'arpentage",
    lto: 'BEDF',
    town: 'Canton',
    range: 'Rang',
    meridian: 'Méridien',
    parcelName: 'Désignation de parcelle',
    remainder: 'Résiduelle',
    parcelType: 'Type de parcelle',
    planDetail: 'Visualiser les détails du plan',
    projectDetail: 'Visualiser les détails du projet',
    view: 'Visualiser'
  },
  "en-CA": {
    select: 'Select', 
    name: 'Name',
    province: 'Province/Territory',
    data: 'Dataset', 
    project: 'Project Number',
    plan: 'Plan Number',
    detail: 'Detail',
    date: "Date of Survey",
    lto: 'LTO',
    town: 'Township',
    range: 'Range',
    meridian: 'Meridian',
    parcelName: 'Parcel Designator',
    remainder: 'Remainder',
    parcelType: 'Parcel Type',
    planDetail: 'View Plan Detail',
    projectDetail: 'View Project Detail',
    view: 'View'
  }
}

let currentLang: string = document.documentElement.lang;

export const columnsHeaderLang: any = columnsHeader[currentLang];