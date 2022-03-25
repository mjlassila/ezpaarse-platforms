#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform CIOS ComAbstracts
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

  if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.pdf)$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.pdf?sequence=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[2];

  } else if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.html)$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.html?sequence=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});


// TOC
// https://www-cios-org.libproxy.tuni.fi/viewtocabsm!0151!ENV

// Abstract
// https://www-cios-org.libproxy.tuni.fi/getabsopn/IADAA33.ENV@1@temp55.748@www@206@COMP!!MORRIS

// COSMIC
// https://www-cios-org.libproxy.tuni.fi/www/cosmicabout.htm

// COSMIC search
// https://www-cios-org.libproxy.tuni.fi/cosearch?TARGET=morse&STYPE=COMP&SYNS=YES&METHODTERM=ALL&FOCUSTERM=ALL&STARTYEAR=1900&ENDYEAR=2022

// Browse by title
// https://www-cios-org.libproxy.tuni.fi/www/cosmicbrowsetitle.htm


// Individual record
// https://www-cios-org.libproxy.tuni.fi/getcosmicbbt/0033175.jmk

// Com Analytics
// https://www-cios-org.libproxy.tuni.fi/comanalytics
