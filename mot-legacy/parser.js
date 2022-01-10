#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MOT Kielipalvelu
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

  if (((/^\/mot\/\w*\/netmot\.exe/i.exec(path)) !== null) && param.SearchWord) {
    // https://mot.kielikone.fi:443/mot/uta/netmot.exe?SearchWord=userinput
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.platform_name = 'MOT Online (legacy)';
    result.search_term = param.SearchWord;

    /**
     * unitid is a crucial information needed to filter double-clicks phenomenon, like described by COUNTER
     * it described the most fine-grained of what's being accessed by the user
     * it can be a DOI, an internal identifier or a part of the accessed URL
     * more at http://ezpaarse.readthedocs.io/en/master/essential/ec-attributes.html#unitid
     */
    result.unitid = param.SearchWord;

  } else if (((/^\/mot\/\w*\/netmotext\.exe/i.exec(path) !== null) && param.rid)) {
    // https://mot.kielikone.fi:443/mot/uta/netmotext.exe?portal/fi/translation-main.htm&rid=BEF63ED8B55B
    result.rtype    = 'OTHER';
    result.mime     = 'HTML';
    result.title = 'Utilized machine translation tool';
    result.platform_name = 'MOT Online (legacy)';
    result.unitid = param.rid;
  }

  return result;
});
