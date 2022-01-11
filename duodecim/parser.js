#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the Duodecim journal
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

  let match;

  result.publication_title = "Duodecim";

  if ((match = /^\/xmedia\/duo\/(duo[0-9]+.pdf)$/i.exec(path)) !== null) {
    // https://www.duodecimlehti.fi:443/xmedia/duo/duo16032.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[1];

  } else if ((match = /^\/lehti\/([0-9]+)\/([0-9]+)\/(duo[0-9]+)$/i.exec(path)) !== null) {
    // https://www.duodecimlehti.fi:443/lehti/2019/21/duo15224
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[3];
    result.publication_date = match[1];
  }

  return result;
});
