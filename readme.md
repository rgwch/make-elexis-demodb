# Create Demo-Database

This is a tool for [Elexis](http://www.github.com/elexis)-Development. It creates a demo-database from a working elexis system.
Such a thing is useful for testing and demonstration purposes.

## Preparation

* Create an empty demo database e.g. `CREATE DATABASE demodb;`
* create a user with full access to that database (or use an existing user for that), e.g `GRANT ALL ON demodb.* to elexisuser@'%' identified by 'topsecret';`
* prepare the configuration for access to source and dest-Databas ein config/default.json
* run the script with `node index.js`

You can also create several configurations in config, e.g 'praxis2.json' and then run with: `NODE_ENV=praxis2 node index.js`

## Result

* The script will process as many patients as the value 'process.number' in the configuration indicates.
* If 'process.random' is true, it will select the patients randomly. Else the first n patients ar processed.
* If 'process.anonymize' is true, patient names and contact informations are replaced with fake values while processing- This is highly recommended.

## Postprocess

The destination database is just a valid elexis database. You can use it directly, or create a dump from it to transefr on another machine.

