const fs = require('fs');

const levelsPath = './ogmo/';

function getLevelsJson()
{
	let outputJson = {};

	return new Promise((resolve, reject) =>
	{
		fs.readdir(levelsPath, (err, files) =>
		{
			if (err) {
				console.error(err);
				process.exit(1);
			}

			files = files.filter(file => { return file.includes(".json") });
		
			files.forEach((file, index) =>
			{
				fs.readFile(levelsPath + file, 'utf8', (err, data) =>
				{
					if (err) {
						console.error(err);
						return;
					}

					let levelJson = JSON.parse(data);
					outputJson[file.split('.json')[0]] = levelJson;
					resolve(outputJson);

					console.log('\x1b[33m%s\x1b[0m', file);
				});
			});
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

