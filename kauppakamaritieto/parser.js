#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform KauppakamariTieto
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

  if ((match = /^\/(ammattikirjasto|tietopalvelut)\/teos\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://kauppakamaritieto.fi/ammattikirjasto/teos/radikaali-uudistuminen-2021
    // https://kauppakamaritieto.fi/tietopalvelut/teos/alv
    // https://kauppakamaritieto.fi:443/fi/s/ak/kirjat/henkiloyhtion-oikeusasema-tuloverotuksessa-2013/
    // https://kauppakamaritieto.fi/tietopalvelut/tietopalvelu-ulkomaankauppa
    // https://kauppakamaritieto.fi/artikkelit/arvoseteleiden-arvonlisaverotus-muuttuu
    // https://kauppakamaritieto.fi:443/haku/ulkomaankaupan+asiakirjat/tietopalvelu
    // https://kauppakamaritieto.fi:443/TimePub/Reader.svc/SearchMulti (search keyword available in referer, this is POST)
    // https://kauppakamaritieto.fi:443/TimePub/Reader.svc/SearchMany (search keyword available in referer, this is POST)

    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid = match[2];

  } else if ((match = /^\/fi\/s\/ak\/kirjat\/([a-z0-9-]+)\/*$/i.exec(path)) !== null) {
    // https://kauppakamaritieto.fi:443/fi/s/ak/kirjat/henkiloyhtion-oikeusasema-tuloverotuksessa-2013/
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/(artikkelit|tietopalvelut)\/([a-z0-9-/]+)$/i.exec(path)) !== null) {
    // https://kauppakamaritieto.fi/artikkelit/arvoseteleiden-arvonlisaverotus-muuttuu
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  } else if ((match = /^\/haku\/([a-z0-9-/+]+)\/[a-z0-9-]+$/i.exec(path)) !== null) {
    // https://kauppakamaritieto.fi/haku/ulkomaankaupan+asiakirjat/tietopalvelu
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/TimePub\/Reader.svc\/(SearchMulti|SearchMany)$/i.exec(path)) !== null) {
    // https://kauppakamaritieto.fi/haku/ulkomaankaupan+asiakirjat/tietopalvelu
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
