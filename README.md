ezpaarse-platforms
==================

Additional ezPAARSE log parsers for services commonly used in Finnish University Libraries.


Services including:

* Sanakirja.fi
* MOT Kielipalvelu
* Alma Talent
* Duodecim Terveysportti
* Duodecim Oppiportti
* Medic
* Rakennustieto
* SFS Online
* Edilex
* Kauppalehti Online
* Elektra
* Duodecim
* Fulcrum
* Sähköinfo Severi
* ST-Akatemia
* Lääkärilehti
* TAPPI Journal

Check branches of this repository for each individual parser.



## Running tests
```bash
  # Install dependencies
  make install
  
  # Test all platforms
  make test
  
  # Test only Elektra and Duodecim
  make test elektra duodecim
  
  # Initialize a new parser
  make init
```

## Documentation
You'll find all information about ezPAARSE's platforms and parsers in the [online documentation](https://ezpaarse.readthedocs.io/en/master/development/platforms.html)
