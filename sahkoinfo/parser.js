#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Sähköinfo Severi
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

  if ((match = /^\/item\/([0-9]+)$/i.exec(path)) !== null) {
    // https://severi.sahkoinfo.fi:443/pdfget/5456 (tällä latautuu kaikki PDF-tyyppiset tiedostot)
    // https://severi.sahkoinfo.fi:443/Search/PerformSearch
    // https://severi-sahkoinfo-fi.libproxy.tuni.fi/Magazine/Open/2773 (lehti tai lehden artikkeli)
    // https://severi.sahkoinfo.fi/item/2159?search=pistorasiat
    // https://severi.sahkoinfo.fi:443/Browse/JsonProductList?id=6
    // https://severi.sahkoinfo.fi:443/Content/Index/0?newsid=498
    // https://severi.sahkoinfo.fi:443/Browse/MetaItems_Read/905

    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = 'item/' +  match[1];
    result.search_term = param.search;

  } else if ((match = /^\/Search\/PerformSearch$/i.exec(path)) !== null) {
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/Magazine\/Open\/([0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/Content\/Index\/([0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = 'news/' + param.newsid;
  } else if ((match = /^\/Browse\/JsonProductList$/i.exec(path)) !== null) {
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  } else if ((match = /^\/Browse\/MetaItems_Read\/([0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
