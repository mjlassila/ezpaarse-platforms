#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform eMagz
 * Currently used only for Tutkiva Hoitotyö, for which proxy usage is allowed.
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


  if ((/^\/read_issue$/i.exec(path)) !== null) {
    // https://tuhto.emagz.fi/read_issue?issue_id=272699&title_id=10228
    // http://tuhto.emagz.fi:80/search?phrase=hoitotiede%2
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.title_id;
    result.unitid = param.issue_id;

  } else if ((/^\/archive$/i.exec(path)) !== null) {
    // https://tuhto.emagz.fi/archive?title_id=10228
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid = param.title_id;
  }

  return result;
});
