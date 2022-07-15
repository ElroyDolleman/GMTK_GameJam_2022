const fs = require('fs');

const levelsPath = './ogmo/';

let addChunk = file =>
{
	return new Promise((resolve, reject) =>
	{
		fs.readFile(levelsPath + file, 'utf8', (err, data) =>
		{
			if (err) {
				reject(err);
			}
			else {
				resolve(JSON.parse(data));
			}
		});
	});
}

let getLevelsJson = async() =>
{
	return new Promise(async(resolve, reject) =>
	{
		fs.readdir(levelsPath, async(err, files) =>
		{
			if (err) {
				console.error(err);
				process.exit(1);
			}

			let outputJson = {};
			files = files.filter(file => { return file.includes(".json") });
		
			for (let i = 0; i < files.length; i++)
			{
				let chunkJson = await addChunk(files[i]);
				outputJson[files[i].split('.json')[0]] = chunkJson;

				console.log('\x1b[33m%s\x1b[0m', files[i]);
			}
	
			resolve(outputJson);
		});
	});
}

console.log('\x1b[35m%s\x1b[0m', 'Start exporting levels :3');

getLevelsJson().then(outputJson =>
{
	fs.writeFile('./build/assets/levels.json', JSON.stringify(outputJson), () =>
	{
		console.log('\x1b[32m%s\x1b[0m', 'Levels exporting is complete! :D');
	});
});

