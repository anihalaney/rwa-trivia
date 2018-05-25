
export class Utils {

    public getUTCTimeStamp() {
        const date = new Date(new Date().toUTCString());
        const millis = date.getTime() + (date.getTimezoneOffset() * 60000);
        return millis;
    }
}