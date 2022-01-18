#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Duodecim Terveysportti
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

  if ((match = /^\/apps\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.terveysportti.fi:443/apps/ltk/?search=Matkailijan%20kuume
    // https://www.terveysportti.fi:443/apps/icd
    // https://www.terveysportti.fi:443/terveysportti/diagnoosi.dg_diagnoosi.koti
    // https://www.terveysportti.fi:443/terveysportti/interaktio.inxbase.koti
    // https://www.terveysportti.fi:443/dtk/pit/avaa?p_artikkeli=alr00190
    // https://www.terveysportti.fi:443/dtk/vso/avaa?p_artikkeli=prv00038
    // https://www.terveysportti.fi:443/dtk/aho/haku?p_haku=verikaasu
    // https://www.terveysportti.fi:443/terveysportti/haku.koti?p_db=TP&p_haku=L%C3%A5%C3%A4keinterakti
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/dtk\/([a-z0-9]+)\/avaa$/i.exec(path)) !== null) {
    // https://www.terveysportti.fi:443/dtk/pit/avaa?p_artikkeli=alr00190
    // https://www.terveysportti.fi:443/dtk/vso/avaa?p_artikkeli=prv00038
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = 'dtk/' + match[1];
    result.unitid   = param.p_artikkeli;
  } else if ((match = /^\/dtk\/([a-z0-9]+)\/haku$/i.exec(path)) !== null) {
    // 
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.title_id = 'dtk/' + match[1];
    result.unitid   = param.p_haku;
  } else if ((match = /^\/terveysportti\/haku.koti$/i.exec(path)) !== null) {
    // https://www.terveysportti.fi:443/terveysportti/haku.koti?p_db=TP&p_haku=L%C3%A5%C3%A4keinterakti
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.title_id = param.p_db;
    result.unitid   = param.p_haku;
  } else if ((match = /^\/terveysportti\/([a-z0-9_./]+).koti$/i.exec(path)) !== null && !param.p_haku) {
    // https://www.terveysportti.fi:443/terveysportti/diagnoosi.dg_diagnoosi.koti
    // https://www.terveysportti.fi:443/terveysportti/interaktio.inxbase.koti
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
