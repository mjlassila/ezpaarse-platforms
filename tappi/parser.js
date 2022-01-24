#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the access to the TAPPI Journal
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

  let match;

  if ((match = /^\/JOURNALS\/PDF\/([a-zA-Z0-9.]+)\.pdf$/i.exec(path)) !== null) {
    // http://tappi.micronexx.com/JOURNALS/PDF/95FEB154.7528.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/JOURNALS\/(journal|search)\.html$/i.exec(path)) !== null) {
    // http://tappi.micronexx.com/JOURNALS/journal.html
    // http://tappi.micronexx.com/JOURNALS/search.html?query=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.search_term = param.query;
  }

  return result;
});
