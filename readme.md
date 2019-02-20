# make-demodb

This is a tool for [Elexis](http://www.github.com/elexis)-Development. It creates a demo-database from a working elexis system.
Such a thing is useful for testing and demonstration purposes.
At this time, only mysql systems are supported. But it should not be too difficult to add more database types, or even different types for source and destination. 

## Prerequisites

* A working elexis database
* The mysqldump utility must be installed and available
* NodeJS 11 or higher
* The utility works only on normalized (i.e. all lowercase) Elexis-Databases. To normalize an elexis database you might use a tool like [normalize_mysqldb](https://www.npmjs.com/package/@rgwch/normalize_mysqldb). Normalizing might impact normal Elexis operation, so I'd recommend to test on a database copy first.

## Preparation and run

* create a user with full access to both, the source and the destination database (or use an existing user for that), e.g `GRANT ALL ON demodb.* to elexisuser@'%' identified by 'topsecret';`
* prepare the configuration for access to source and dest- databases in config/default.json
* run the script with `node index.js`

You can also create several configurations in config, e.g 'praxis2.json' and then run with: `NODE_ENV=praxis2 node index.js`

The script will run `./copy_structure` at the beginning to create an empty demo-database. So if you wish any special processing or different databases, you can modify ./copy_structure accordingly.

### Result

* The script will process as many patients as the value 'process.number' in the configuration indicates.
* If 'process.random' is true, it will select the patients randomly. Else the first n patients are processed.
* If 'process.anonymize' is true, patient names and contact informations are replaced with fake values while processing- This is highly recommended.
* When processing a patient entry, all data referenced by this patient will be copied as well (medications, prescriptions, certificates, billings and so on).

### Postprocess

The last step of the extraction process is creation of some VIEWS (rights_per_role and rights_per_user) (which can't be copied).

The destination database is just a valid elexis database. You can use it directly, or create a dump from it to transfer on another machine.

## Configuration

All Configuration happens in config/*.json

```js
{
    "source":{  // The original database, must be normalized
      "client": "mysql2",   // All databases supported by knexjs are possible
      "connection":{
        "host": "localhost",
        "database": "elexis",
        "user": "elexisuser",
        "password": "topsecret"
      }
    },
    "dest":{    // The target database
      "client": "mysql2",   // All databases supported by knexjs are possible
      "connection":{
        "host": "localhost",
        "database": "demodb",
        "user": "elexisuser",   // should be the same as in source (or modify copy_structure)
        "password": "topsecret" // should be the same as in source
      }
    },
    "process":{
      "number": 50,         // Number of Patient datasets to transmit
      "random": true,       // Select randomly (or use the first "number" entried)
      "anonymize": true,    // replace all names with fake names
      "loglevel": "info"    // One of debug, info, warn, error
    }
}
```

## Limitations

### Anonymization

Only the names and cases are anonymized. Encounter entries and documents stay unmodified. If you want more
anonymizing, the following procedure is recommended

* create a full copy of your database (e.g. with mysqldump and reload)
* connect Elexis with that database 
* load the plugin [dbshaker](https://wiki.elexis.info/Ch.elexis.support.dbshaker.feature.feature.group) from the elexis-3-base repository
* anonymize the database using that plugin 
* run make-demodb on that database (in that case, anonymizing is not needed, of course)

### Completeness

Make-demodb does copy the following data:

* The full contents of followjng tables: 'config', 'userconfig', 'vk_preise', 'user_', 'role', 'user_role_joint','right_','role_right_joint','xid','etiketten', 'etiketten_object_link', 'etiketten_objclass_link','dbimage','reminders','reminders_responsible_link' 
* As many Patient data from 'kontakt' as indicated by the 'number' configuration.
* cases from 'faelle' belonging to selected patients.
* encounter data from 'behandlungen' matching to selected cases.
* Articles from 'artikel' belonging to selected patients.
* Articles from 'artikelstamm_ch' belonging to selected patients.
* bills from 'rechnungen' belonging to selected cases.
* payments from 'zahlungen' belonging to selected bills.
* certificates from 'auf' belonging to selected patients.
* lab values from 'laborwerte' belonging to selected patients.
* lab items from 'laboritems' belonging to selected lab values.
* prescriptions from 'rezepte' containing selected articles.

Make-demodb does not copy the following data:

* external documents from 'omnivore' (since anonymizing would not be possible)
* outgoing documents from 'briefe' (since anonymizing would be quite difficult)
* Blobs from 'Ĥeap' and 'heap2' (since anonymizing can't be guaranteed)

## Elexis-OOB/Webelexis

To create a demo/test-database ready for Elexis-Out Of The Box or Webelexis from a running system, the following steps are required:

* Copy the source database
* connect the Elexis client with that copy and run the "dbshaker" plugin to anonymize all and remove deleted entries.
* run [normalize-mysqldb](https://www.npmjs.com/package/@rgwch/normalize_mysqldb) over the database.
* run [modify_elexis](https://raw.githubusercontent.com/rgwch/webelexis/master/server/modify_elexis.sql) over the database.
* make sure, "*config/yoursettings.json*" in make-demodb are set correctly for your needs
* run `NODE_ENV=yoursettings node .`
* remove all unneccessary users from the table `user_` and rename the needed user.
* Log in into the demo database from within elexis. Change the password of the logged-in user
* check carefully possible fields where personal data might be (e.g. Informations on mandators in tarmed-settings or the field 'bezeichnung3' in the table `kontakt`), ore some 'extinfo' fields.
* `mysqldump` the prepared demo database.
