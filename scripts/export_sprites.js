const { packAsync } = require('free-tex-packer-core');
const fs = require('fs');
const cmd = require('node-cmd');

const asepriteFilesPath = './assets/sprites/aseprite/';
const buildedAssetsFolder = './assets/build_files/';
const outputFolder = './build/assets/';

const packerOptions = {
	textureName: "main-spritesheet",
	width: 1024,
	height: 1024,
	fixedSize: false,
	padding: 2,
	allowRotation: false,
	detectIdentical: true,
	allowTrim: true,
	exporter: "Phaser3",
	removeFileExtension: true,
	prependFolderName: true
};

let getAsepriteFiles = () =>
{
	return new Promise((resolve, reject) =>
	{
		fs.readdir(asepriteFilesPath, (err, files) =>
		{
			if (err) {
				reject(err);
			}
			else {
				resolve(files);
			}
		});
	});
}

let saveAsepriteFile = (file) =>
{
	return new Promise((resolve, reject) =>
	{
		let name = file.split('.aseprite')[0];
		let command = 'aseprite -b ' + asepriteFilesPath + file + ' --save-as ' + buildedAssetsFolder + name + '.png';

		// console.log('\x1b[33m%s\x1b[0m', command);

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

let getImagesForTextureSheet = async() =>
{
	let images = [];

	await new Promise((resolve, reject) =>
	{
		fs.readdir(buildedAssetsFolder, (err, files) =>
		{
			if (err) {
				reject(err);
			}
			else {
				files.forEach(file =>
				{
					images.push({
						path: buildedAssetsFolder + file,
						contents: fs.readFileSync(buildedAssetsFolder + file)
					});
				});
				resolve();
			}
		});
	});

	return images;
};

let buildAsepriteFiles = async() =>
{
	let files = await getAsepriteFiles();
	files = files.filter(file => { return file.includes('.aseprite') });

	for (let i = 0; i < files.length; i++)
	{
		try {
			await saveAsepriteFile(files[i]);

			console.log('\x1b[33m%s\x1b[0m', files[i]);
		}
		catch (reason) {
			console.error(files[i] + " FAILED: ", reason);
		}
	}

	let images = await getImagesForTextureSheet();
	let resultFiles = await packAsync(images, packerOptions);

	// JSON
	const jsonOutput = resultFiles[0];
	let jsonString = jsonOutput.buffer.toString();
	jsonString = jsonString.replaceAll('./assets/build_files/', '');

	let err = await new Promise(resolve => fs.writeFile(outputFolder + jsonOutput.name, jsonString, resolve));

	if (err) {
		console.error(err);
	}
	else {
		console.log('output: ' + jsonOutput.name);
	}

	// IMAGE
	const imageOutput = resultFiles[1];

	err = await new Promise(resolve => fs.writeFile(outputFolder + imageOutput.name, imageOutput.buffer, resolve));

	if (err) {
		console.error(err);
	}
	else {
		console.log('output: ' + imageOutput.name);
	}
}

console.log('\x1b[35m%s\x1b[0m', 'Start exporting aseprite files... ^o^');

buildAsepriteFiles().then(() =>
{
	console.error('\x1b[33m%s\x1b[0m', 'Exporting aseprite files done! :D');
}).catch(reason =>
{
	console.error(reason);
});