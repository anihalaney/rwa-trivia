export class QueryParams {
    condition: Array<QueryParam>;
}

export class QueryParam {
    name: string;
    comparator: string;
    value: any;

    constructor(name: string, comparator: string, value: any) {
        this.name = name;
        this.comparator = comparator;
        this.value = value;
    }
}
