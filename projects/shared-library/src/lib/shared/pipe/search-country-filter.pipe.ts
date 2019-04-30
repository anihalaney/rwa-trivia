import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "searchCountry" })
export class SearchCountryFilterPipe implements PipeTransform {

    filterValue: any;
    newValue: any;
    name = "harsh";
    transform(value: string, args: string): any {

        if (!value) { return value; }
        if (args == null || args === "all" || args === "") {
            return value;
        }
        value = JSON.stringify(value);
        this.filterValue = JSON.parse(value);
        this.filterValue = this.filterValue.filter(function (val: any) {
            if (val.name.toUpperCase().match(args.toUpperCase())) {
                return val.name;
            } if (val.dialCode.toUpperCase().match(args.toUpperCase())) {
                return val.dialCode;
            } else {
                return;
            }
        });
        return this.filterValue;
    }
}
