import { inputsElem } from "./input-list";
import { optionsElem, menuListItems, adminListItems } from "./select-list";
import { provincesElem } from "./provinces-list";
//import { firstNationElem } from "./firstNation-list";
//import { canadaLandsEng, canadaLandsFra } from "./canadaLand-list";

interface Translations {
  [lang: string]: {
    'queryFields': {
      nameField: string,
      parcelFcField: string,
      remainderField: string,
    },
    'list': {
      inputList: any,
      optionsList: any,
      provincesList: any,
      //firstNatList: any,
      //candLandsList: any,
    },
    'link': {
      planLink: string,
      projectLink: string,
    },
    'widget': {
      scale: string,
      printExpand: string,
      printCollapse: string,
      pointExpand: string,
      pointCollapse: string,
      toolbarExpand: string,
      toolbarCollapse: string,
      spatialExpand: string,
      spatialCollapse: string,
    }
  }
}

function getTranslation(lang: string, elem: any) {
  let keys = Object.keys(elem);
  for (let key of keys) {
    if (key != lang) {
      delete elem[key];
    }
  }
  return elem[lang]
}

let textElement: Translations = {
  'en-CA': {
    'queryFields': {
      nameField: "ENGLISHNAME",
      parcelFcField: "PARCELFC_ENG",
      remainderField: "REMAINDERIND_ENG",
    },
    'list': {
      inputList: inputsElem,
      optionsList: optionsElem,
      provincesList: provincesElem,
      //firstNatList: firstNationElem,
      //candLandsList: canadaLandsEng,
    },
    'link': {
      planLink: "eng",
      projectLink: "clss",
    },
    'widget': {
      scale: "Scale",
      printExpand: "Expand print tool",
      printCollapse: "Collapse print tool",
      pointExpand: "Expand coordinate conversion tools",
      pointCollapse: "Collapse coordinate conversion tools",
      toolbarExpand: "Expand measurement tools",
      toolbarCollapse: "Collapse measurement tools",
      spatialExpand: "Expand spatial select",
      spatialCollapse: "Collapse spatial select",
    }
  },
  'fr-CA': {
    'queryFields': {
      nameField: "FRENCHNAME",
      parcelFcField: "PARCELFC_FRA",
      remainderField: "REMAINDERIND_FRA",
    },
    'list':{
      inputList: inputsElem,
      optionsList: optionsElem,
      provincesList: provincesElem,
      //firstNatList: firstNationElem,
      //candLandsList: canadaLandsFra,
    },
    'link': {
      planLink: "fra",
      projectLink: "satc",
    },
    'widget': {
      scale: "??chelle",
      printExpand: "D??velopper les outils d???impression",
      printCollapse: "R??duire les outils d???impression",
      pointExpand: "D??velopper les outils de conversion de coordonn??es",
      pointCollapse: "R??duire les outils de conversion de coordonn??es",
      toolbarExpand: "D??velopper les outils de mesure",
      toolbarCollapse: "R??duire les outils de mesure",
      spatialExpand: "S??lection par rectangle - D??velopper",
      spatialCollapse: "S??lection par rectangle - R??duire",
    }
  }
}

let HEADER_EN_FR = {
  'en-CA': {
    name: 'Name',
    province: 'Province/Territory',
    planNum: 'Plan Number',
    desc: 'Description',
    survDate: 'Date of Survey',
    detail: 'Detail',
    lto: 'LTO',
    designator: 'Parcel Designator',
    remainder: 'Remainder',
    type: 'Parcel Type',
    section: 'Section',
    town: 'Township',
    range: 'Range',
    meridian: 'Meridian',
    direction: 'Direction',
    project: 'Project Number'
  },
  'fr-CA': {
    name: 'Nom',
    province: 'Province/Territoire',
    planNum: 'Num??ro de plan',
    desc: 'Description',
    survDate: "Date de l'arpentage",
    detail: 'D??tail',
    lto: 'BEDF',
    designator: 'D??signation de parcelle',
    remainder: 'R??siduelle',
    type: 'Type de parcelle',
    section: 'Section',
    town: 'Canton',
    range: 'Rang',
    meridian: 'M??ridien',
    direction: 'Direction',
    project: 'Num??ro de projet'
  }
}

let currentLang:string = document.documentElement.lang;

/* Header elements */
let headers = getTranslation(currentLang, HEADER_EN_FR);
export const csvHeaders = {
  'divAdmin': [headers.name, headers.province],
  'divPlan': [headers.planNum, headers.desc, headers.survDate, headers.detail, headers.lto, headers.province],
  'divParcel': [headers.designator, headers.remainder, headers.planNum, headers.detail, headers.type, headers.province],
  'divTownship': [headers.section, headers.town, headers.range, headers.meridian, headers.province, headers.direction],
  'divProject': [headers.project, headers.desc, headers.detail, headers.province]
}

/* searchBoxElem  */
const searchBoxElem = getTranslation(currentLang, textElement);
export const canLandList = searchBoxElem.list.candLandsList;
export const firstNationList = searchBoxElem.list.firstNatList;
export const optionList = searchBoxElem.list.optionsList;
export const inputList = searchBoxElem.list.inputList;
export const provinceList = searchBoxElem.list.provincesList;
export const queryFields = searchBoxElem.queryFields;
export const widgetText = searchBoxElem.widget;
export const link = searchBoxElem.link;

export const menuElem: any = menuListItems;
export const adminElem: any = adminListItems;
