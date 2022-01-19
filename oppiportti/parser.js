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
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/op\/([a-z]{3})([0-9]+)\/?(do|avaa)?$/i.exec(path)) !== null) {
    // https://www.oppiportti.fi/op/kbk00170/ (oppikirjan sisältö)
    // https://www.oppiportti.fi/op/opk04637 (oppikirja)
    // https://www.oppiportti.fi/op/lko00015 (laitekoulutukset)
    // https://www.oppiportti.fi/op/owb00016 (webinaarit)
    // https://www.oppiportti.fi/op/olk00012 (luennot)
    // https://www.oppiportti.fi/op/vdu00019 (videot)
    // https://www.oppiportti.fi/op/ott00013 (testit)
    // https://www.oppiportti.fi/op/dvk00191 (verkkokurssit)
    // https://www.oppiportti.fi/op/ovr00003 (virtuaaliharjoitukset)
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1] + match[2];
    let section_id = match[1];

    if (section_id === 'opk') {
      result.title_id = 'oppikirja';
      result.rtype = 'BOOK';
    } else if (section_id === 'lko') {
      result.title_id = 'laitekoulutus';
      result.rtype = 'OTHER';
    } else if (section_id === 'owb') {
      result.title_id = 'webinaari';
      result.rtype = 'OTHER';
    } else if (section_id === 'olk') {
      result.title_id = 'luento';
      result.rtype = 'VIDEO';
    } else if (section_id === 'vdu') {
      result.title_id = 'video';
      result.rtype = 'VIDEO';
    } else if (section_id === 'ott') {
      result.title_id = 'testi';
      result.rtype = 'OTHER';
    } else if (section_id === 'dvk') {
      result.title_id = 'verkkokurssi';
      result.rtype = 'OTHER';
    } else if (section_id === 'ovr') {
      result.title_id = 'harjoitus';
      result.rtype = 'OTHER';
    } else if (match[3] == 'do' && !result.title_id) {
      result.title_id = 'oppikirja';
      result.rtype = 'BOOK';
    }

    if (!match[3]) {
      result.rtype = 'PREVIEW';
    }

  } else if ((match = /^\/op\/xhakutulos$/i.exec(path)) !== null) {
    // https://www.oppiportti.fi/op/xhakutulos?p_haku=farmakologia
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = param.p_haku;
  }

  return result;
});
