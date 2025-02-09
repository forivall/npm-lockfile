'use strict';

const { execSync } = require('child_process');
const path = require('path');
const { readFileSync, unlinkSync } = require('fs');

const test = require('tape');

const lockPath = path.join(__dirname, '../package-lock.json');

const normalizeLockJson = (json) => json.replace(/,\s*"requires": \{}/g, '');

test('simple test', (t) => {
	execSync(`"${path.join(__dirname, '../bin.js')}" -o package-lock.json --date=now`);
	const lockPackage = readFileSync(lockPath, { encoding: 'utf-8' });
	t.ok(lockPackage, 'lockfile produced by package');
	execSync('npm install --package-lock --package-lock-only', { encoding: 'utf-8' });
	const lockActual = readFileSync(lockPath, { encoding: 'utf-8' });
	t.ok(lockActual, 'lockfile produced by npm');
	unlinkSync(lockPath);
	t.deepEqual(
		JSON.parse(normalizeLockJson(lockActual)),
		JSON.parse(normalizeLockJson(lockPackage)),
		'actual =~= package',
	);
	t.end();
});
