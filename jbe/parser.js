#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform John Benjamins Publishing
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/online\/([a-z]*)\/articles\/([a-z1-9]{4})$/i.exec(path)) !== null) {
    // https://benjamins.com/online/hts/articles/met2
    // https://www.benjamins.com/online/etsb/publications
    // https://www.benjamins.com:443/online/xql/xmldb-intranet/
    // https://www.benjamins.com/online/etsb/publications?f_TitleSubjects.subject_id=3092
    // https://benjamins-com.libproxy.tuni.fi/online/hts/articles/rel4/print
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */

  } else if ((match = /^\/online\/([a-z]*)\/articles\/([a-z1-9]*)\/print/i.exec(path)) !== null) {
    // https://benjamins-com.libproxy.tuni.fi/online/hts/articles/rel4/print
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if ((match = /^\/online\/([a-z]*)\/publications/i.exec(path)) !== null) {
    // https://www.benjamins.com/online/etsb/publications?f_TitleSubjects.subject_id=3092
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
