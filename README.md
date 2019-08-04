[![Build Status](https://travis-ci.com/osrs-tracker/osrs-tracker-api-next.svg?branch=master)](https://travis-ci.com/osrs-tracker/osrs-tracker-api-next)
[![GitHub issues](https://img.shields.io/github/issues/osrs-tracker/osrs-tracker-api-next.svg)](https://github.com/osrs-tracker/osrs-tracker-api-next/issues)
[![GitHub license](https://img.shields.io/github/license/osrs-tracker/osrs-tracker-api-next.svg)](https://github.com/osrs-tracker/osrs-tracker-api-next/blob/master/LICENSE)

# OSRS Tracker API Next

A new implementation for the OSRS Tracker API. Completely reworked from the ground up.

## Environment variables

**BACK_COMP_BASE_URL**: Base url of the old api for backcomp (default `'https://api.greendemon.io/osrs-tracker'`).

**MONGO_URL**: The url to the mongo database.  
**MONGO_DATABASE**: The name of the mongo database.  
**MONGO_USER**: The user of the mongo database.  
**MONGO_PASSWORD**: The password for the mongo database user.  
**MONGO_AUTH_SOURCE**: The auth source for the mongo database user.

**PORT**: Port that exposes the api (default `8080`).  
**PORT_METRICS**: Port that exposes the metrics (default `8088`).  
**WORKER_COUNT**: Number of workers to be used (default `number of cpus`).
