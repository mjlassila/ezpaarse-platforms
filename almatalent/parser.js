#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Alma Talent
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let hostname = parsedUrl.hostname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;
  let category;

  if ((match = /^\/teos\/([A-Z0-9]*)$/i.exec(path)) !== null) {
    //  https://bisneskirjasto.almatalent.fi:443/teos/BAEBBXXTBBAEE
    //  https://verkkokirjahylly.almatalent.fi:443/teos/DAEBIXCTEB
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = match[1];

  } else if ((match = /^\/article\/(.*)\/(\d*)$/i.exec(path)) !== null) {
    // https://pro.almatalent.fi:443/article/terrorismirikoslainsaadantoon-muutoksia/19143
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/TimePub\/DatabaseCSS\.ashx$/i.exec(path)) !== null) {
    // https://suomenlaki.almatalent.fi:443/TimePub/DatabaseCSS.ashx?category=Book&docType=557231&documentId=18as419836&timeMachineDate=null&containerClass=article&blockClassPrefix=bsI&paragraphClassPrefix=bsP&MMName=TimePub.css
    // https://suomenlaki.almatalent.fi:443/TimePub/DatabaseCSS.ashx?category=Regulation&docType=Regulation&documentId=Ym401&timeMachineDate=2020-03-10&containerClass=article&blockClassPrefix=bsI&paragraphClassPrefix=bsP&MMName=TimePub.css
    result.mime     = 'HTML';
    result.unitid   = param.documentId;
    category = param.category;
    if (category === 'Book') {
      result.rtype = 'BOOK';
    }
    else if (category === 'Regulation') {
      result.rtype = 'ARTICLE';
    }
  }

  if (hostname === 'verkkokirjahylly.almatalent.fi') {
    result.publication_title = 'Alma Talent Verkkokirjahylly';
  } else if (hostname === 'bisneskirjasto.almatalent.fi') {
    result.publication_title = 'Alma Talent Bisneskirjasto';
  } else if (hostname === 'pro.almatalent.fi') {
    result.publication_title = 'Alma Talent Pro';
  } else if (hostname === 'suomenlaki.almatalent.fi') {
    result.publication_title = 'Suomen Laki';
  } else if (hostname === 'koulutus.almatalent.fi') {
    result.publication_title = 'Alma Talent Koulutus';
  }

  return result;
});
