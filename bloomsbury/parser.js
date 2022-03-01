#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bloomsbury Collections
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

  if ((match = /^\/book\/([a-z0-9\-]*)\/([a-z0-9\-]+)$/i.exec(path)) !== null) {
    // https://www.bloomsburycollections.com/book/debating-new-approaches-to-history/ch1-global-history
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid = match[2];

  } else if ((match = /^\/book\/([a-z0-9\-]+)\/$/i.exec(path)) !== null) {
    // https://www.bloomsburycollections.com/book/debating-new-approaches-to-history/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
  }

  return result;
});
