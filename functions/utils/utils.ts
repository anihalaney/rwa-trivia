import { interceptorConstants, ResponseMessagesConstants } from "shared-library/shared/model";

export class Utils {

    static getUTCTimeStamp() {
        const date = new Date(new Date().toUTCString());
        const millis = date.getTime();
        return millis;
    }

    static addMinutes(time, minutes) {
        return time + minutes;
    }


    static getObjectValues(snapshots: any): any[] {
        const values: any[] = [];
        if (snapshots.exists) {
            for (const snapshot of snapshots.docs) {
                values.push(snapshot.data());
            }
        }
        return values;
    }

    static throwError(error): Promise<any> {
        console.error('Error : ', error);
        throw error;
    }

    static sendResponse(res: any, status: number, responseObj: any): void {
        return res.status(status).send(responseObj);
    }

    static sendErr(res: any, error: any): void {
        console.error('Error : ', error);
        this.sendResponse(res, interceptorConstants.INTERNAL_ERROR, ResponseMessagesConstants.INTERNAL_SERVER_ERROR);
    }

}
