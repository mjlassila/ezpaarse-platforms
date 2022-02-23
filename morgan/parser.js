#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Morgan & Claypool Publishers
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

  if ((match = /^\/doi\/(?:pdf|pdfplus)\/(10.4199.*|10.2200.*)$/i.exec(path)) !== null) {
    // https://www-morganclaypool-com.libproxy.tuni.fi/doi/pdf/10.2200/S0113ED1V01Y202109ICR076
    // https://www-morganclaypool-com.libproxy.tuni.fi/doi/pdfplus/10.2200/S0113ED1V01Y202109ICR076
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */

  } else if ((match = /^\/doi\/(?:abs\/)?(10.4199.*|10.2200.*)$/i.exec(path)) !== null) {
    // https://www.morganclaypool.com/doi/10.2200/S00723ED1V01Y201607ICR050
    // https://www.morganclaypool.com/doi/abs/10.2200/S00723ED1V01Y201607ICR050
    result.rtype    = 'ABSTRACT';
    result.mime     = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/toc\/([a-z]+)\/1\/1$/i.exec(path)) !== null) {
    // https://www.morganclaypool.com//toc/can/1/1
    result.rtype    = 'TOC';
    result.mime = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/author\/(.*)$/i.exec(path)) !== null) {
    // https://www.morganclaypool.com/author/Weiner%2C+Joyce
    result.rtype    = 'SEARCH';
    result.mime = 'HTML';
    result.search_term   = match[1];
  } else if ((match = /^\/action\/doSearch/i.exec(path)) !== null) {
    // https://www.morganclaypool.com/action/doSearch?AllField=information+retrieval&x=12&y=14&SeriesKey=
    result.rtype    = 'SEARCH';
    result.mime = 'HTML';
    // Capture search term only for simple search
    result.search_term   = param.AllField;
  } else if ((match = /^\/doi\/suppl\/(10.4199.*|10.2200.*)\/suppl_file\/(.*)/i.exec(path)) !== null) {
    // https://www.morganclaypool.com/doi/suppl/10.2200/S00484ED1V01Y201303PRO001/suppl_file/Winner_Ch1.pdf
    result.rtype    = 'SUPPL';
    result.mime = 'PDF';
    result.unitid   = match[2];
  }

  return result;
});
