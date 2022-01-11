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
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.pdf)$/i.exec(path)) !== null) {
    // http://www.edilex.fi:80/lakikirjasto/18990.pdf
    // https://www.edilex.fi:443/artikkelit/18990.pdf
    // https://www.edilex.fi:443/opinnaytetyot/20552.pdf
    // https://www.edilex.fi:443/oikeus/5134.pdf
    // https://www-edilex-fi.libproxy.tuni.fi/he/fi20200059.pdf
    // https://www-edilex-fi.libproxy.tuni.fi/lakimies/1000400001.pdf
    // https://www-edilex-fi.libproxy.tuni.fi/hao/turun_hao20211525
    // https://www-edilex-fi.libproxy.tuni.fi/mt/stvm20210037
    // https://www-edilex-fi.libproxy.tuni.fi/tarkennettu_haku/saadokset?sort=relevance&offset=1&perpage=20&allWords=testihaku&submit=Hae&typeIds%5B%5D=1%3Afi%2C23%3Afi%2C24%3Afi%2C25%3Afi%2C35%3Afi%2C141%3Afi%2C104%3Afi%2C104%3Aen%2C116%3Afi%2C1%3Asv%2C24%3Asv%2C25%3Asv%2C35%3Asv%2C141%3Asv%2C104%3Asv%2C104%3Aen%2C116%3Asv
    // https://www-edilex-fi.libproxy.tuni.fi/lainsaadanto/19980001 (HTML)
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[2];

  } else if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.html)$/i.exec(path)) !== null) {
    // https://www-edilex-fi.libproxy.tuni.fi/smur/20140527
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
