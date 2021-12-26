export class Time {
  static yrToYr = 1;
  static yrToQr = 4;
  static yrToMo = 12;
  static yrToDy = 365.2425;
  static yrToWk = this.yrToDy/7;
  static yrToHr = this.yrToDy*24;
  static yrToMn = this.yrToHr*60;
  static yrToSc = this.yrToMn*60;
}
