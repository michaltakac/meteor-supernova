.PHONY: met test

make install:
	npm install

mongo:
	cd meteor_core && meteor mongo

run-dev:
	node ./bin/development.js

run-debug:
	node ./bin/debug.js

run-prod:
	node ./bin/production.js

deploy-staging:
	NODE_ENV=staging node ./bin/deploy.js mup

deploy-prod:
	NODE_ENV=production node ./bin/deploy.js mup

restart-staging:
	cd ./settings/staging && mup restart

restart-prod:
	cd ./settings/production && mup restart

test:
	NODE_ENV=test ./node_modules/karma/bin/karma start
