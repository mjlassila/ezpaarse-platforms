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

  if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.pdf)$/i.exec(path)) !== null) {
    // https://www.fulcrum.org/epubs/h989r533k?locale=en (read online)
    // https://www.fulcrum.org/heb?f[creator_sim][]=Abbate%2C+Carolyn&locale=en
    // https://www.fulcrum.org/heb?f[subject_sim][]=African&locale=en
    // https://www.fulcrum.org/heb?f%5Bpublisher_sim%5D%5B%5D=ABC+International+Group&locale=en
    // https://www.fulcrum.org/heb?f%5Bseries_sim%5D%5B%5D=%28Fordham+Series+in+Medieval+Studies%29&locale=en
    // https://www.fulcrum.org/heb?locale=en&page=2
    // https://www.fulcrum.org/heb?utf8=%E2%9C%93&locale=en&press=heb&q=struggle

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
    // https://www.fulcrum.org/epubs_download_interval/h989r533k?chapter_index=0&locale=en&title=Title+Page (download)
    result.rtype    = 'BOOK_CHAPTER';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1] + '/' + param.chapter_index;
  }

  return result;
});

// Some of current Fulcrum users

// https://www.fulcrum.org/heb (ACLS Humanities Ebook)
// https://www.fulcrum.org/barpublishing (Bar Publishing)
// https://www.fulcrum.org/amherst (Amherst College Press)
// https://www.fulcrum.org/minnesota (University of Minnesota Press)
// https://www.fulcrum.org/leverpress (Lever Press)
// https://www.fulcrum.org/michigan (University of Michigan Press)
// https://www.fulcrum.org/northwestern (Northwester University Press)
// https://www.fulcrum.org/sussex (University of Sussex Press)



