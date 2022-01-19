#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the access to the Finnish medical bibliographic database Medic
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);


  if ((/^\/medic\/$/i.exec(path) && param.hakusanat) !== null) {
    // http://www.terkko.helsinki.fi:80/medic/?hakusanat=epilep&sivu=haku&mista=&alkaen=0&ratio=AND&hakusanat2=epilepsia+epileps*&mista2=&ratio2=AND&hakusanat3=&mista3=&vuosi1=&vuosi2=&synonyymit=true&kieli%5B%5D=kaikki&tyyppi%5B%5D=kaikki
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.platform_name = 'Medic';

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */

    let keywords = [param.hakusanat, param.hakusanat2, param.hakusanat3];
    result.unitid = keywords.filter(x => typeof x === 'string' && x.length > 0).join('+');
  }
  // Do not output result if search keyword is missing.
  if (!result.unitid) {
    result = {};
  }

  return result;

});
