#!/usr/bin/env node

require('ts-node').register({
    transpileOnly: true
});
require('../cli/index.ts');