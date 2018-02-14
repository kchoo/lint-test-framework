const {watch} = require('chokidar');
const {execSync} = require('child_process');
const minimatch = require('minimatch');
const path = require('path');

/**
 * Kicks off the chokidar watcher, which will lint all .js files, and if the linting doesn't throw any errors,
 * it will run nodeunit on all .test.js files
 */
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
}

main();

/**
 * chokidar's watcher's getWatched() will give us an object, where each key is a directory, and each value for that key
 * is an array of files in that directory. This will flatten that structure into a nice array of full file paths
 *
 * @param  {object} watcher - chokidar watcher, passed into this just in case we want multiple watchers running
 * @return {string[]}
 */
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

/**
 * Run this command and return the output of it, synchronously
 *
 * @param  {string} command - command to run
 * @return {string} stdout and/or stderr for executing this command
 */
function sh(command) {
	return execSync(
		command,
		{stdio: 'inherit'}
	);
}

/**
 * Create a .test.js file
 *
 * @param  {string} filePath - .js file that we should base the .test.js file off of
 */
function createNewTestFile(filePath) {
	const filename = path.basename(filePath, '.js');
	sh(`cat template.test.js.example | sed s/{{FILENAME}}/${filename}/g > ${filePath.replace('.js', '.test.js')}`);
}
