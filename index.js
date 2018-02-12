const {watch} = require('chokidar');
const {execSync, spawn} = require('child_process');
const minimatch = require('minimatch');
const readline = require('readline');
const path = require('path');

function main() {
	const watcher = watch('**/*.js', {ignored: ['node_modules']});

	watcher.
		on('ready', function watcherOnReady() {
			// lint once we run this script, to avoid making a dummy change to start linting
			watcher.emit('change');

			watcher.
				on('add', function watcherOnAdd(filePath) {
					if (!/\.test\.js$/.test(filePath)) {
						createNewTestFile(filePath);
					}
				});
		}).
		on('change', function watcherOnChange() {
			// clear the console, so that the only thing that is
			// displayed is any errors from this round of linting (if any)
			process.stdout.write('\x1B[2J\x1B[0f');

			const allFilesWatched = getFilesWatched(watcher);

			const lintCommand = `./node_modules/eslint/bin/eslint.js ${allFilesWatched.join(' ')}`;

			// pass .test.js files to nodeunit
			const testFiles = allFilesWatched.
				filter(minimatch.filter('**/*.test.js'));

			const testCommand = `./node_modules/nodeunit/bin/nodeunit ${testFiles.join(' ')}`;

			try {
				sh(lintCommand);
				// run tests iff the linting throws no errors
				sh(testCommand);
			} catch (e) {
				// error is thrown when linting fails, we just want to continue
			}
		});

	readline.
		createInterface({
			input: process.stdin,
			terminal: false
		}).
		on('line', function restartScript(line) {
			if (line === '') {
				spawn(
					process.argv[0],
					process.argv.slice(1),
					{
						cwd: process.cwd(),
						detached: false,
						stdio: 'inherit'
					}
				);

				/* eslint-disable no-process-exit */
				process.exit();
				/* eslint-enable no-process-exit */
			}
		});
}

main();

function getFilesWatched(watcher) {
	const filesArray = [];

	const filesMap = watcher.getWatched();

	/* eslint-disable guard-for-in */
	for (const dir in filesMap) {
		for (const file of filesMap[dir]) {
			filesArray.push(`${dir}/${file}`);
		}
	}
	/* eslint-enable guard-for-in */

	return filesArray;
}

function sh(command) {
	return execSync(
		command,
		{stdio: 'inherit'}
	);
}

function createNewTestFile(filePath) {
	const filename = path.basename(filePath, '.js');
	sh(`cat template.test.js.example | sed s/{{FILENAME}}/${filename}/g > ${filePath.replace('.js', '.test.js')}`);
}
