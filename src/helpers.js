import {DATA_TYPES, INVALID_PARAMETERS_ERROR, UNKNOWN_ERROR, KEY_NOT_FOUND_ERROR} from './constants';

export const getStatusForErrorMessage = (errorMessage) => {
    switch (errorMessage) {
        case UNKNOWN_ERROR:
            return 500;
        case INVALID_PARAMETERS_ERROR:
            return 400;
        case KEY_NOT_FOUND_ERROR:
            return 400;
        default:
            return 500;
    }
};

export const mockNotificationEmailOpened = (emailObject) => {
    const ipArrayLength = emailObject.ipOfOpened.length;
    if (ipArrayLength === 0){
        throw UNKNOWN_ERROR;
    }

    const ip = emailObject.ipOfOpened.slice(-1)[0];
    
    const logObject = {
        recipient: emailObject.email,
        openedAt: new Date(emailObject.lastOpened).toString(),
        ip
    };
    
    if (ipArrayLength > 1){
        const sameAsFirstDevice = ip == emailObject.ipOfOpened[ipArrayLength - 1];
        logObject.sameAsFirstDevice = sameAsFirstDevice;
    }

    console.log(logObject);
}