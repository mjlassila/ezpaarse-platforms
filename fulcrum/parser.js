#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Fulcrum
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

  if ((match = /^\/epubs\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://www.fulcrum.org/epubs/h989r533k?locale=en (read online)

    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/(epubs_download_interval|epubs_download_chapter)\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://www.fulcrum.org/epubs_download_interval/h989r533k?chapter_index=0&locale=en&title=Title+Page
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'EPUB';
    result.title_id = match[2];
    result.unitid   = match[2] + '/' + param.chapter_index;
  } else if ((match = /^\/ebooks\/([a-z0-9]+)\/download$/i.exec(path)) !== null) {
    // https://www.fulcrum.org/ebooks/h989r533k/download
    result.rtype    = 'BOOK';
    // Mime could be also PDF or MOBI but for simplicity, let's use EPUB
    result.mime     = 'EPUB';
    result.unitid   = match[1];
  } else if ((match = /^\/(heb|barpublishing|amherst|minnesota|leverpress|michigan|northwestern|sussex)/i.exec(path)) !== null) {
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.search_term   = param.q;
  }


  return result;
});
