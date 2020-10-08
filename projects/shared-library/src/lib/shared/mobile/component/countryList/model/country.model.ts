export class Country {
  name: string;
  isoCode: string;
  dialCode: string;
  priority: number;
  areaCode: number;
  flagClass: string;
  placeHolder?: string;
  constructor() {
      this.name = '';
      this.isoCode = '';
      this.dialCode = '';
      this.priority = 0;
      this.areaCode = null;
      this.flagClass = '';
      this.placeHolder = '';
  }
}
