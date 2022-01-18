#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Duodecim Oppiportti
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
    // https://www.oppiportti.fi/op/kbk00170/do (oppikirjan sisältö, do-lopussa)
    // https://www.oppiportti.fi/op/opk04637 (oppikirjat esittelysivu)
    // https://www.oppiportti.fi/op/lko00015 (laitekoulutukset)
    // https://www.oppiportti.fi/op/owb00016 (webinaarit)
    // https://www.oppiportti.fi/op/olk00012 (luennot)
    // https://www.oppiportti.fi/op/vdu00019 (videot)
    // https://www.oppiportti.fi/op/ott00013 (testit)
    // https://www.oppiportti.fi/op/dvk00191 (verkkokurssit) https://www.oppiportti.fi/op/dvk00191/avaa
    // https://www.oppiportti.fi/op/ovr00003 (virtuaaliharjoitukset)
    // muissa paitsi kirjoissa lopussa avaa tarkoittaa sisällön avaamista
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[2];

  } else if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.html)$/i.exec(path)) !== null) {
    // https://www.oppiportti.fi/op/xhakutulos?p_haku=farmakologia
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
