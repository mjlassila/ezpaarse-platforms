#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform KnowPap
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);



  if ((/^\/extranet\/([a-z]+)\/knowpap_system\/user_interfaces\/knowpap\.htm$/i.exec(path)) !== null) {
    // http://www.knowpap.com/extranet/suomi/knowpap_system/user_interfaces/knowpap.htm
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.unitid = 'knowpap';
  }
  return result;
});
