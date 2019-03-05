
export class Utils {

    static getUTCTimeStamp() {
        const date = new Date(new Date().toUTCString());
        const millis = date.getTime();
        return millis;
    }

    static addMinutes(time, minutes) {
        return time + minutes;
    }
}
