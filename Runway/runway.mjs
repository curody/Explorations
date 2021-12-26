import { Time } from './time.mjs'
import { Validation } from './validation.mjs';

export class Runway {
  /**
   * Calculate number of time steps to take until final principal is reached.
   * 
   * @param {Number} principal  Initial principal. 
   * @param {Number} change     Change in principal per step.
   * @param {Number} rate       Inflation/deflation rate.
   * @param {Number} stop       Estimated final principal.
   * @returns Time steps elapsed before reaching final principal.
   */
  static calcRunwaySteps = (prnc, change, rate, stop = 0) => {
    let t = 0;
    while (prnc >= change + stop) {
      prnc = (prnc - change) * (1 + rate);
      t++;
    }
    return t;
  }

  /** Calculate effective inflation given APY and n years. */
  static cNf = apy => n => Math.pow(apy + 1, 1/(n*n))*n - n;

  /**
   * Convert from yearly expenses and inflation to other time scales.
   * 
   * @param {Number} epy  Yearly expenses.
   * @param {Number} ipy  Yearly inflation.
   * @returns Dictionary of conversions from years to other time scales.
   */
  static timeCalcs = {
    sc: () => ({ ex: epy => epy/Time.yrToSc,
                  nf: ipy => this.cNf(ipy)(Time.yrToSc) }),
    mn: () => ({ ex: epy => epy/Time.yrToMn,
                  nf: ipy => this.cNf(ipy)(Time.yrToMn) }),
    hr: () => ({ ex: epy => epy/Time.yrToHr,
                  nf: ipy => this.cNf(ipy)(Time.yrToHr) }),
    dy: () => ({ ex: epy => epy/Time.yrToDy,
                  nf: ipy => this.cNf(ipy)(Time.yrToDy) }),
    wk: () => ({ ex: epy => epy/Time.yrToWk,
                  nf: ipy => this.cNf(ipy)(Time.yrToWk) }),
    mo: () => ({ ex: epy => epy/Time.yrToMo,
                  nf: ipy => this.cNf(ipy)(Time.yrToMo) }),
    qr: () => ({ ex: epy => epy/Time.yrToQr,
                  nf: ipy => this.cNf(ipy)(Time.yrToQr) }),
    yr: () => ({ ex: epy => epy,
                  nf: ipy => ipy }),
  };

  static getProperty = object => key => object[key];

  static getRunway = (yrlyInf, yrlyExp, prncpl, stop = 0) => timeUnit => {
    const parseNum = Validation.RunIfValid(parseFloat)(Validation.IsNumber);
    let ipy = parseNum(yrlyInf);
    let epy = parseNum(yrlyExp);

    const parseNonNegativeNum = Validation.RunIfValid(parseFloat)(Validation.And(Validation.IsNumber)(Validation.IsNotNegative));
    let p = parseNonNegativeNum(prncpl);
    let s = parseNonNegativeNum(stop);

    const parseCalcByTime = Validation.RunIfValid(this.getProperty(this.timeCalcs))(Validation.HasKey(this.timeCalcs));
    let c = parseCalcByTime(timeUnit)();

    return this.calcRunwaySteps(p, c.ex(epy), c.nf(ipy), s);
  }

  static printCalcs = (yrlyInfl, yrlyExpns, principal, stop = 0) => {
    const runway = this.getRunway(yrlyInfl, yrlyExpns, principal, stop);
    for (let timeScale in this.timeCalcs) {
      console.log(`${timeScale}: ${runway(timeScale)}`);
    }
  }
}
