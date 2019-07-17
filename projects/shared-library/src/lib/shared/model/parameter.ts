export class Parameter {
    key: string;
    value: string;

    constructor(data) {
        this.key = data.key || '';
        this.value = data.value || '';
    }

}
