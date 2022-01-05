#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MOT Kielipalvelu
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

  if (((/^\/api\/search\/v\d\/search\/dictionary$/i.exec(path)) !== null) && param.keyword) {
    // https://www.sanakirja.fi:443/api/search/v1/search/dictionary?keyword=demonstrates
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.platform_name = 'MOT Kielipalvelu';

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = param.keyword;

  } else if ((/^\/api\/search\/v\d\/machinetranslate$/i.exec(path)) !== null) {
    // https://www.sanakirja.fi:443/api/search/v1/machinetranslate
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.title = 'Utilized machine translation tool';
    result.platform_name = 'MOT Kielipalvelu';
  }

  return result;
});
