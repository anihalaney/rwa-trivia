import {Injectable} from '@angular/core';
import * as phonenumbers from 'google-libphonenumber';

@Injectable()
export class PhoneNumberValidationProvider {

  constructor() {
  }


  /*
     checks whether phones number is a valid mobile phone number (used in sign up phone checkbox)
     returns false if it is not or the number in E164 format if it is
  */
  public isValidMobile(_phonenumber, country): any {
    try {
      const phoneUtil = phonenumbers.PhoneNumberUtil.getInstance();
      const phoneNumber = phoneUtil.parse(_phonenumber, country);
      const isValid = phoneUtil.isValidNumber(phoneNumber);
      // In some regions (e.g. the USA), it is impossible to distinguish between
      // fixed-line and mobile numbers by looking at the phone number itself
      const numberType = phoneUtil.getNumberType(phoneNumber);
      const isMobile = numberType === phonenumbers.PhoneNumberType.MOBILE ||
      numberType === phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE;

      if (isValid && isMobile) { return true; }
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}
