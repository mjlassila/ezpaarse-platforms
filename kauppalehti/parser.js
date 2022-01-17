#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Kauppalehti
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

  if ((match = /^\/uutiset\/([a-z-]+)\/[a-z0-9-]+$/i.exec(path)) !== null) {
    // https://www.kauppalehti.fi:443/uutiset/raisio-niputtaa-tuotteet-muutaman-paamerkin-alle/449b1101-4957-3290-8752-0ef33ca24225
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = 'uutiset/' + match[1];

  } else if ((match = /^\/(porssi\/[a-z-/]+)$/i.exec(path)) !== null) {
    // https://www.kauppalehti.fi:443/porssi/porssikurssit/osake/SAMPO
    // https://www.kauppalehti.fi:443/porssi/vaihdetuimmat
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/haku\/([a-z_0-9/-]+)$/i.exec(path)) !== null) {
    // https://www.kauppalehti.fi:443/haku/uutiset/valmet
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/api\/search\/v\d\/(.*)\/\d+\/\d+$/i.exec(path)) !== null) {
    // https://www.kauppalehti.fi:443/api/search/v2/articles/kl/Lohkoketju/0/20
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
