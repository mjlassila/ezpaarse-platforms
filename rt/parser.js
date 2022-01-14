#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Rakennustieto
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let hostname = parsedUrl.hostname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/report\/pdf$/i.exec(path)) !== null && hostname === 'kustannuslaskenta.rakennustieto.fi') {
    // // https://kustannuslaskenta.rakennustieto.fi:443/report/pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.publication_title = 'RT-kustannuslaskenta';

  } else if ((match = /^\/content\/([A-Z0-9]+)$/i.exec(path)) !== null && hostname === 'ratupakki.rakennustieto.fi') {
    // https://ratupakki.rakennustieto.fi:443/content/74AH
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.publication_title = 'RatuPakki';
    result.unitid   = match[1];
  } else if ((match = /^\/card-body\/ryl\/([a-zA-Z0-9]+)\/([0-9_]+)\/([0-9]+\.html)$/i.exec(path)) !== null && hostname === 'ryl.rakennustieto.fi') {
    // https://ryl.rakennustieto.fi:443/card-body/ryl/InfraRYL/2020_2/45311.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.publication_title = match[1];
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];
  } else if ((match = /^\/html\/liitteet\/([a-zA-Z0-9_]+)\/([A-Za-z0-9_]+\.pdf)$/i.exec(path)) !== null) {
    // https://www.rakennustieto.fi:443/html/liitteet/infraryl/Infra_2015_Maaramittausohje.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.publication_title = match[1];
    result.unitid   = match[1] + '/' + match[2];
  }

  return result;
});

// https://ryl.rakennustieto.fi:443/ryl/infraryl/2020_2/
// h
// https://kortistot.rakennustieto.fi:443/api/search/docs?k=RT%2010-11223
// https://kortistot.rakennustieto.fi:443/api/search/docs?k=RT%2010-11284
// https://kortistot.rakennustieto.fi:443/kortit/RT%2010-11223
// https://raku.rakennustieto.fi:443/favicon.ico (raku is an external service, so we can only track loading of the frontpage)
// https://www.rakennustieto.fi:443/html/liitteet/infraryl/Infra_2015_Maaramittausohje.pdf
// https://rt.rakennustieto.fi:443/api/search/search?q=rakennuttaminen