#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the access to the Finnish Medical Journal (Lääkärilehti)
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/pdf\/([0-9]+)\/([A-Za-z0-9-]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.laakarilehti.fi/pdf/2021/SLL502021-3010.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1] + '/' + match[2];

  } else if ((match = /^\/erikoisalat\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.laakarilehti.fi/erikoisalat/807
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = 'erikoisalat/' + match[1] ;
  } else if ((match = /^\/sisallysluettelo/i.exec(path)) !== null) {
    // https://www.laakarilehti.fi/sisallysluettelo/?year=1992&magazine=15601
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.year + '/' + param.magazine;
  } else if ((match = /^\/haku/i.exec(path)) !== null) {
    // https://www.laakarilehti.fi/haku/?keywords=&author=&title=&year_min=1992&year_max=2022&magazine_issue=&page_number=&limit=10&advanced=1&q=alaraaja&sort=new_first
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.search_term   = [param.q, param.keywords].join(' ').trim();
  } else if ((match = /^\/([a-z0-9-]+)\/([a-z0-9-/.]*)/i.exec(path)) !== null & match[1]!=='erikoisalat' & match[1] !== 'sisallysluettelo' & match[1] !== 'haku' & match[1] !== 'pdf' & match[1] !== 'site') {
    // https://www.laakarilehti.fi/arkisto/paakirjoitukset/10.7.1992-kunnallinen-paasopimus-hylattiin/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];
  }

  return result;
});

// https://www.laakarilehti.fi/tyossa/kantapaan-kautta/painehaavoja-ei-pitaisi-syntya/
// https://www.laakarilehti.fi/tieteessa/katsausartikkeli/nayttoon-perustuva-hoito-isanta-vai-renki/
// https://www.laakarilehti.fi/kliininen-tyo/terveyskeskusten-laakarivaje-on-pysynyt-ennallaan/
// https://www.laakarilehti.fi/tieteessa/terveydenhuoltoartikkelit/aktiivisen-hoidon-tulee-jatkua-paivystysleikkauksen-jonotusaikanakin/
// https://www.laakarilehti.fi/terveydenhuolto/laakariliitto-terveydenhuollon-rahoitusta-nostettava/
// https://www.laakarilehti.fi/pdf/2021/SLL502021-3010.pdf
// https://www.laakarilehti.fi/sisallysluettelo/?year=1992&magazine=15601
// https://www.laakarilehti.fi/svenska/ledare/20.8.1992-hucs-delegationen/
// https://www.laakarilehti.fi/arkisto/muut-laakarilehdet/15669.1039.164_tuberkuloosi-pelottaa-jo-hoitohenkilokuntaakin/
// https://www.laakarilehti.fi/arkisto/octopus/minimaalinen-muistiaukko/
// https://www.laakarilehti.fi/arkisto/paakirjoitukset/10.7.1992-kunnallinen-paasopimus-hylattiin/
// https://www.laakarilehti.fi/haku/?keywords=&author=&title=&year_min=1992&year_max=2022&magazine_issue=&page_number=&limit=10&advanced=1&q=alaraaja&sort=new_first
// https://www.laakarilehti.fi/erikoisalat/807
// https://www.laakarilehti.fi/mielipide/tuliko-helpotusta-laakarivajeeseen/
