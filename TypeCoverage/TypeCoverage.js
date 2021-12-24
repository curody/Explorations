/**
 * Class for storing combinations-related math functions.
 * 
 * @example <caption>Generate combinations for 7 choose 3.</caption>
 *  var combinations = CombinationMath.nCr(7 3);
 */
 class CombinationMath {
  /**
   * Build an array of possible combinations from 1 to r elements chosen from a 
   *  set of n total elements.
   * 
   * @param   {number}  n The size of the set of elements to select from.
   * @param   {number}  r The number of elements to choose from the set.
   * @returns {Array}     All combinations from "n choose 1...r".
   */
   static nCr(n, r) {
    /**
     * Recursively generate combinations for "n choose k".
     * 
     * Original C algorithm by Prof. Daniel Ángel Jiménex at UTSA:
     *  "Algorithms for Permutations and Combinations",
     *  (https://www.cs.utexas.edu/users/djimenez/utsa/cs3343/lecture25.html)
     */
    const combinations = (v, start = 1, n , k = 1, maxk) => {
      if (k > maxk) return [[ ...v]];
    
      let results = [];
      for (let i = start; i <= n; i++) {
        v[k-1] = i;
    
        let result = combinations(v, i+1, n, k+1, maxk);
        result.forEach(x => results.push(x));
      }
    
      return results;
    }

    return combinations([], 1, n, 1, r);
  }

  // Calculate factorial of number.
  static factorial(n) {
    if (n < 0) return 0;
    
    const fact = (acc, m) => {
<<<<<<< HEAD
      if (m < 2) return acc;
      return fact(acc * m, m-1);
    };

    return fact(1, n);
=======
      if (m < 2) return 1;
      return fact(acc * m, m-1);
    };

    return fact(0, n);
>>>>>>> origin/main
  }

  // Calculate number of combinations from nCr
  static nCrCount = (n, r) =>
    this.factorial(n) / (this.factorial(n-r) * this.factorial(r))
}

/**
 * Class for enumerating Pokémon attack type coverage data by interacting with 
 *  the Pokémon Database Type Coverage Calculator.
 * 
 * Instructions:
 *  1. Open a browser and navigate to the website's type coverage checker tool.
 *  2. Copy and paste this class into the browser's console via Developer Tools.
 * 
 * WARNING:
 *  Generating coverage data for more than 1 active type WILL take a
 *  rapidly-increasing amount of time to process (up to a matter of hours)!
 * 
 * @example <caption>Get coverage for every type with header row.</caption>
 *  var data = await TypeCoverage.getCoverageDataWithHeader(1);
 * @example <caption>Get coverage for every type pair without header.</caption>
 *  var data = await TypeCoverage.getCoverageData(2);
 */
class TypeCoverage extends CombinationMath {
  // Clear type selection. Used before making the next round of selections.
  static clearSelection = () => document
    .querySelectorAll(".selected")
    .forEach(x => x.click());

  // Select element by attribute and value (ex. [id='my-element'])
  static select = (identifier, value) => document
    .querySelector(`[${identifier}=\'${value}\']`);

  // Clicks the "Calculate!" button.
  static #calculate = () => this.select("id", "calc-coverage").click();

  // Create dictionary for type name lookup by index
  static typeNames = [
    "Normal",   "Fire",   "Water",  "Electric", "Grass",    "Ice", 
    "Fighting", "Poison", "Ground", "Flying",   "Psychic",  "Bug", 
    "Rock",     "Ghost",  "Dragon", "Dark",     "Steel",    "Fairy"
  ];
  static types = this.typeNames.map((c, i) => [i+1, c]);
  static typesDict = this.types.reduce((a,x) => ({...a, [x[0]]: x[1]}), {});

  // Create dictionary for effectiveness label by element id
  static #effectIds = [
    "total-noeffect",       "total-notveffective",
    "total-normeffective",  "total-supereffective" ];
  static effectNames = [
    "No Effect",            "Not Very Effective", 
    "Normal Effectiveness", "Super Effective"];
  static effects = this.#effectIds.map((c, i) => [c, this.effectNames[i]]);
  static effectsDict = this.effects.reduce((a,x) => ({...a, [x[0]]: x[1]}), {});

  /**
   * Force wait for specified time before running the next call.
   * 
   * @param {number}  delay Time in miliseconds (ms).
   */
  static sleepNow = (delay) => 
    new Promise((resolve) => setTimeout(resolve, delay));

  /**
   * Run through the array of type combinations to select and calculate on the
   *  webpage their resulting coverage in terms of each level of effectiveness,
   *  then push each sub-result to a new row in the final data to return
   * 
   * @param   {Array} arr Combinations of types to process.
   * @returns {Array}     Collection of each type combination's coverage.
   */
  static #process = async (arr) => {
    let tWait = 10;
    let maxk = Object.keys(this.effectsDict).length;
    
    let results = [];
    for (let item in arr) {
      let res = [ ...arr[item]].map(x => this.typesDict[x]);;

      this.clearSelection();
      await this.sleepNow(tWait);
      arr[item].forEach(x => 
        this.select('data-typeid', this.types[x-1][0]).click());
      await this.sleepNow(tWait);
      this.#calculate()
      await this.sleepNow(tWait);

      for (let i = 0; i < maxk; i++) {
        res[arr[item].length + i] = 
          this.select("id", this.#effectIds[i]).textContent;
      }

      results.push(res);
    }

    return results;
  };

  /**
   * Determine whether to skip Fairy type for coverage.
   * 
   * @returns {boolean} True if Fairy type is disabled, else false.
   */
  static #getIsUsingOldTypes = () =>
    this.select("data-typeid", "18").style?.display === "none" ?? true;

  /**
   * Gets number of types available for selection.
   * 
   * @returns {number}  Number of active types.
   */
  static getActiveTypes = () => 
    this.types.length - (this.#getIsUsingOldTypes() ? 1 : 0);

  /**
   * Generate type coverage data for the specified number of chosen types.
   * 
   * @param   {number}  rTypes  Number of chosen types.
   * @returns {Array}           Collection of type combination coverage.
   */
  static async getCoverageData(rTypes) {
    const result = super.nCr(this.getActiveTypes(), rTypes)
    return await this.#process(result);
  }

  /**
   * Generates header row for a combination of types and their coverage.
   * 
   * @param   {number}  types Number of columns to represent chosen types.
   * @returns {Array}         Header label row based on chosen number of types.
   */
  static dataHeader = (types) => [Array.from({length: types}, (_, i) => 
    `Type ${i+1}`).concat(this.effectNames)];

  /**
   * Creates header row of type coverage labels for existing 2d data array.
   * 
   * @param   {Array}   data  Type coverage data as 2d array.
   * @param   {number}  r     Number of chosen types.
   * @returns {Array}         Type coverage data prepended with header row.
   */
  static attachDataHeader = (data, r) => this.dataHeader(r).concat(data);

  /**
   * Generate type coverage data for the specified number of chosen types with 
   *  header row included.
   * 
   * @param   {number}  rTypes  Number of chosen types.
   * @returns {Array}           Collection of type coverages with header.
   */
  static async getCoverageDataWithHeader(rTypes) {
    let data = await this.getCoverageData(rTypes);
    return this.attachDataHeader(data, rTypes);
  }

  
}

/**
 * Class for storing data format and export utilities
 * 
 * @example <caption></caption>
 *  DataExport.exportAs(DataExport.formatCsv)(data, "new csv1");
 */
class DataExport {
  // Formatter for transforming 2d array to csv text for file export.
  static toCsv = (data) => data.map(e => e.join(",")).join("\r\n");
  static formatCsv = { transform:this.toCsv, type:'text/csv' };

  // Formatter for transforming 2d array to tsv text for file export.
  static toTsv = (data) => data.map(e => e.join("\t")).join("\r\n");
  static formatTsv = { transform:this.toTsv, type:"text/tsv" };

  /**
   * Create data Blob to export as file of specified type.
   * 
   * @param {*}       data      Blob/BufferSource/String data to store in file.
   * @param {string}  fileName  New file's name.
   * @param {string}  type      Type string, (usually MIME-type).
   */
  static export(data, fileName, type) {
    let file = new Blob([data], {type: type});
    let anchor = document.createElement("a")
    let url = URL.createObjectURL(file);
    anchor.download = fileName;
    anchor.href = url;

    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);  
    }, 0); 
  }

  /**
   * Create data Blob to download as file per specified format.
   * 
   * @param {object}  format    Format definition object. Expects:
   *  'transform' function that returns Blob/BufferSource/String and
   *  'type' string (MIME-type preferred).
   * @param {*}       data      Blob/BufferSource/String data to store in file.
   * @param {string}  fileName  New file name to create from blob and download.
   */
  static exportAs = (format) => (data, fileName) =>
    this.export(format.transform(data), fileName, format.type);
}
