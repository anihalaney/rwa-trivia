
export class Utils {

    public getUTCTimeStamp() {
        const date = new Date(new Date().toUTCString());
        const millis = date.getTime();
        return millis;
    }

    public addMinutes(time, minutes) {
        return time + minutes;
    }
}
