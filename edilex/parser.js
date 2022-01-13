#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Edilex
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

  if ((match = /^\/([a-z0-9_]+)\/([a-z0-9_]+\.pdf)$/i.exec(path)) !== null) {
    // http://www.edilex.fi:80/lakikirjasto/18990.pdf
    // https://www.edilex.fi:443/artikkelit/18990.pdf
    // https://www.edilex.fi:443/opinnaytetyot/20552.pdf
    // https://www.edilex.fi:443/oikeus/5134.pdf
    // https://www.edilex.fi/he/fi20200059.pdf
    // https://www.edilex.fi/lakimies/1000400001.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/([a-z0-9_]+)\/([a-z0-9_]+)$/i.exec(path)) !== null && match[1] !== 'tarkennettu_haku') {
    // https://www-edilex-fi.libproxy.tuni.fi/smur/20140527
    // https://www.edilex.fi/hao/turun_hao20211525
    // https://www-edilex.fi/mt/stvm20210037
    // https://www.edilex.fi/lainsaadanto/19980001 (HTML)
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];
  } else if ((match = /^\/tarkennettu_haku\//i.exec(path)) !== null) {
    // https://www.edilex.fi/tarkennettu_haku/saadokset?sort=relevance&offset=1&perpage=20&allWords=testihaku&submit=Hae&typeIds%5B%5D=1%3Afi%2C23%3Afi%2C24%3Afi%2C25%3Afi%2C35%3Afi%2C141%3Afi%2C104%3Afi%2C104%3Aen%2C116%3Afi%2C1%3Asv%2C24%3Asv%2C25%3Asv%2C35%3Asv%2C141%3Asv%2C104%3Asv%2C104%3Aen%2C116%3Asv

    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.search_term   = param.allWords;
  }

  return result;
});
