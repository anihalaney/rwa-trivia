export class Country {
  name: string;
  iso2: string;
  dialCode: string;
  priority: number;
  areaCode: number;
  flagClass: string;
  placeHolder: string;
  constructor() {
      this.name = "";
      this.iso2 = "";
      this.dialCode = "";
      this.priority = 0;
      this.areaCode = null;
      this.flagClass = "";
      this.placeHolder = "";
  }
}
