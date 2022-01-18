#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform SFS Online
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

  if ((match = /^\/pubdl.html.stx/i.exec(path)) !== null) {
    // https://online.sfs.fi:443/pubdl.html.stx?p=434a149b356f67316fb22ea58f376134cd3d1178a08095a8a6719d4583dd0115
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = param.p;

  } else if ((match = /^\/[a-z]{2}\/index\/tuotteet\/([A-Z0-9/-]+).html.stx/i.exec(path)) !== null) {
    // https://online.sfs.fi/fi/index/tuotteet/IEC/IEC/ID9989/6/765035.html.stx
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  else if ((match = /^\/[a-z]{2}\/index\/hakutulos.html.stx$/i.exec(path)) !== null) {
    // https://online.sfs.fi/fi/index/hakutulos.html.stx
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
