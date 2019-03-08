import { interceptorConstants, ResponseMessagesConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';

export class Utils {

    static getUTCTimeStamp() {
        const date = new Date(new Date().toUTCString());
        const millis = date.getTime();
        return millis;
    }

    static addMinutes(time, minutes) {
        return time + minutes;
    }

    static getValesFromFirebaseSnapshot(snapshots: any): any[] {

        const values: any[] = [];

        for (const snapshot of snapshots.docs) {
            values.push(snapshot.data());
        }

        return values;
    }

    static throwError(error): Promise<any> {
        console.error(GeneralConstants.Error_Message, error);
        throw error;
    }

    static sendResponse(res: any, status: number, responseObj: any): void {
        return res.status(status).send(responseObj);
    }

    static sendError(res: any, error: any): void {
        console.error(GeneralConstants.Error_Message, error);
        this.sendResponse(res, interceptorConstants.INTERNAL_ERROR, ResponseMessagesConstants.INTERNAL_SERVER_ERROR);
    }

}
