#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes access to ST-Online and ST-Akatemia.
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



  if ((/^\/teos\/(.*)/i.exec(path)) !== null) {
    // https://www.stakatemiaonline.fi/teos/kvstand/ytcmd?ActionIdentity=liitetiedosto%2FttStandardit%2FKansainvaliset-tilintarkastusalan-standardit-2020-osa-2.pdf
    // https://www.stakatemiaonline.fi/teos/kvstand/ytcmd?ActionIdentity=liitetiedosto%2FKansainvaliset-tilintarkastusalan-standardit-2018-2.pdf
    // https://www.stakatemiaonline.fi/teos/kvstand/ytcmd?ActionIdentity=liitetiedosto%2FISA315_uudistettu_2019.pdf
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid = param.ActionIdentity;

  }

  return result;
});
