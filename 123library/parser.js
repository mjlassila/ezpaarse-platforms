#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform 123Library
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

  if ((match = /^\/ebook\/id\/([0-9]+)\/$/i.exec(path)) !== null) {
    // https://www.123library.org:443/ebook/id/112748/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/read/i.exec(path)) !== null) {
    // https://www.123library.org/read/?id=112748
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = param.preview;
    result.unitid   = param.id;
  }

  return result;
});
