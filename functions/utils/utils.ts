
export class Utils {

    public getUTCTimeStamp() {
        const date = new Date(new Date().toUTCString());
        const millis = date.getTime() ;
        return millis;
    }
}
