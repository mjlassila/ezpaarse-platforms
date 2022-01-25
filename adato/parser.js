#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Sähköverkkoekstra
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

  if ((match = /^\/system\/files\/filedepot\/[0-9a-z]+\/([a-zA-Z0-9_-]+\.[a-z]+)$/i.exec(path)) !== null) {
    // https://sahkoverkkoekstra.fi/system/files/filedepot/7/rm_3-16_kaap-mmo.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/file\/([0-9]+)\/download$/i.exec(path)) !== null) {
    // https://sahkoverkkoekstra.fi/file/575/download?token=WGJBkPFo
    // http://sahkoverkkoekstra.fi/file/152/download?token=rhNOgnYr
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1] + '/' + param.token;
  } else if ((match = /^\/filedepot_download\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://sahkoverkkoekstra.fi/filedepot_download/2576/403
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1] + '/' + match[2];
  } else if ((match = /^\/([0-9a-z_-]+)\/([a-z0-9-A-Z-_/]*)$/i.exec(path)) !== null && match[1] !== 'file' && match[1] !== 'filedepot_download' && match[1] !== 'system' && match[1] !== 'search' && match[1] !== 'sites') {
    // https://sahkoverkkoekstra.fi/verkkotoiminnan-valvonta/valvontamenetelmien-suuntaviivat/suuntaviivojen-ensimmainen-versio
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];
  } else if ((match = /^\/search\/site\/(.*)$/i.exec(path))) {
    // https://sahkoverkkoekstra.fi:443/search/site/muuntamo suojaus
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.search_term   = match[1];
  }



  return result;
});
