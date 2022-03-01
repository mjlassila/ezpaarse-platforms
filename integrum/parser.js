#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Integrum Profi
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
  if ((/^\/artefact3\/ia\/ia\d*.aspx/i.exec(path)) !== null && param.si) {
    // http://aafnet.integrum.ru:80/artefact3/ia/ia5.aspx?lv=9&si=pWOAtpvb2E&qu=221&bi=46909&nd=1&srt=0&tnd=0&f=0&st=0
    // http://aafnet.integrum.ru.libproxy.tuni.fi/Artefact3/ia/ia5.aspx/mTRbOtfn2R/5308/s1_D20210623_N25_L2021062220565869_A008.htm
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid = param.si;



  } else if ((/^\/QueryStat\/QueryEdit.aspx/i.exec(path)) !== null) {
    // http://asvc.integrum.ru:80/QueryStat/QueryEdit.aspx?type=Comparative&si=OnZmXYbJ2R&qu=0&query=Navalny&nomenu=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.search_term   = param.query;
    result.unitid = param.si;
  } else if ((match = /^\/artefact3\/ia\/ia\d*.aspx\/.*\/([A-Za-z0-9_]+.htm)$/i.exec(path)) !== null) {
    // http://aafnet.integrum.ru.libproxy.tuni.fi/Artefact3/ia/ia5.aspx/mTRbOtfn2R/5308/s1_D20210623_N25_L2021062220565869_A008.htm
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = match[1];
  }


  return result;
});
