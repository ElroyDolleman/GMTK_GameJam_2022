const fs = require('fs');
const cmd = require('node-cmd');

const tilesetDataPath = './ogmo/tilesetdata/';
const outputPath = './build/assets/';

let getFilesOfType = (extension) =>
{
	return new Promise((resolve, reject) =>
	{
		fs.readdir(tilesetDataPath, (err, files) =>
		{
			if (err) {
				reject(err);
			}
			else {
				resolve(files.filter(file => { return file.includes(extension); }));
			}
		});
	});
}

let runCommand = command =>
{
	return new Promise((resolve, reject) =>
	{
		cmd.run(command, err =>
		{
			if (err) {
				reject(err);
			}
			else {
				resolve();
			}
		});
	});
}

let readFile = filepath =>
{
	return new Promise((resolve, reject) =>
	{
		fs.readFile(filepath, 'utf8', (err, data) =>
		{
			if (err) {
				reject(err);
			}
			else {
				resolve(data);
			}
		});
	});
}

let writeFile = (filepath, data) =>
{
	return new Promise(resolve =>
	{
		fs.writeFile(filepath, data, resolve);
	});
}

let exportTilesets = async() =>
{
	let files = await getFilesOfType('.tsx');

	for (let i = 0; i < files.length; i++)
	{
		let outputFile = outputPath + files[i].replace('.tsx', '.json');
		await runCommand('Tiled --export-tileset ' + tilesetDataPath + files[i] + ' ' + outputFile);

		let fileData = await readFile(outputFile);
		let json = JSON.parse(fileData);

		json['version'] = undefined;
		json['tiledversion'] = undefined;
		json['image'] = json['image'].replace('../../ogmo/assets/sprites/tilesets/', '');

		await writeFile(outputFile, JSON.stringify(json));
	}

	console.log('\x1b[33m%s\x1b[0m', 'Exporting tilesets done :3');
}

console.log('\x1b[35m%s\x1b[0m', 'Start exporting tilesets... =]');
exportTilesets();