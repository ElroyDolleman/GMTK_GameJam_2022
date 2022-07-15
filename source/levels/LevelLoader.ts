import { CHUNKS_COLUMNS, CHUNK_ROWS, TILE_HEIGHT, TILE_WIDTH } from '../utilities/GameConfig';
import { IPoint } from '../utilities/IPoint';
import { EntityLayerData, ChunkData, TileLayerData } from './LevelData';
import { Tile } from './tile';

type LevelsJson = { [key: string]: ChunkData; };
type ChunkType = 'deadend' | 'corridor' | 'up_corner' | 'down_corner';
type ChunkNames = { [key in ChunkType]: string[]; };

export class LevelLoader
{
	public readonly scene: Phaser.Scene;

	private _jsonData: LevelsJson;

	private _chunkNames: ChunkNames = {} as ChunkNames;

	public constructor(scene: Phaser.Scene)
	{
		this.scene = scene;
	}

	public preload(): void
	{
		this.scene.load.json('levels', 'assets/levels.json');
		this.scene.load.spritesheet('main_tileset', 'assets/default_tileset.png', { frameWidth: TILE_WIDTH, frameHeight: TILE_HEIGHT });
	}

	public initJson(): void
	{
		if (this.scene.cache.json.has('levels'))
		{
			this._jsonData = this.scene.cache.json.get('levels');

			let allChunks: string[] = [];
			Object.keys(this._jsonData).forEach(chunkName => allChunks.push(chunkName));

			this._chunkNames['deadend'] = allChunks.filter(name => name.includes('chunk_deadend'));
			this._chunkNames['corridor'] = allChunks.filter(name => name.includes('chunk_corridor'));
			this._chunkNames['up_corner'] = allChunks.filter(name => name.includes('chunk_upcorner'));
			this._chunkNames['down_corner'] = allChunks.filter(name => name.includes('chunk_downcorner'));
		}
		else
		{
			console.log(this.scene.cache.json.entries);
			throw new Error('Failed to get levels json from cache');
		}
	}

	public generateLevel(chunksX: number, chunksY: number): void
	{
		if (this._jsonData === undefined)
		{
			this.initJson();
		}

		this.scene.cameras.main.setBounds(
			0, 0,
			CHUNK_ROWS * TILE_WIDTH * chunksX,
			CHUNKS_COLUMNS * TILE_HEIGHT * chunksY
		);

		for (let x = 0; x < chunksX; x++)
		{
			for (let y = 0; y < chunksY; y++)
			{
				let type = this._getChunkTypeByPosition(x, y, chunksX - 1, chunksY - 1);
				this.loadChunk(this._pickChunk(type), { x, y });
			}
		}
	}

	private _getChunkTypeByPosition(x: number, y: number, lastX: number, lastY: number): ChunkType
	{
		if (x === 0)
		{
			if (y === 0) { return 'deadend'; }
			if (y % 2 === 0) { return 'up_corner'; }
			if (y === lastY) { return 'deadend'; }
			return 'down_corner';
		}
		if (x === lastX)
		{
			if (y === 0) { return 'down_corner'; }
			if (y % 2 !== 0) { return 'up_corner'; }
			if (y === lastY) { return 'deadend'; }
			return 'up_corner';
		}
		return 'corridor';
	}

	private _pickChunk(type: ChunkType): ChunkData
	{
		let index = Phaser.Math.Between(0, this._chunkNames[type].length - 1);

		return this._getChunkData(this._chunkNames[type][index]);
	}

	public loadChunk(chunkData: ChunkData, chunkPos: IPoint): void
	{
		chunkData.layers.forEach(layer =>
		{
			switch(layer.name)
			{
			case 'tile_layer':
				this._setupTileLayer(
					layer as TileLayerData,
					{
						x: chunkPos.x * CHUNK_ROWS,
						y: chunkPos.y * CHUNKS_COLUMNS
					}
				);
				break;
			case 'entity_layer':
				this._setupEntityLayer(layer as EntityLayerData);
				break;
			}
		});
	}

	private _setupTileLayer(layerData: TileLayerData, offset: IPoint): void
	{
		const tiles: Tile[] = [];

		for (let y = 0; y < layerData.data2D.length; y++)
		{
			for (let x = 0; x < layerData.data2D[y].length; x++)
			{
				const tileNum = layerData.data2D[y][x];
				let sprite: Phaser.GameObjects.Sprite | undefined;

				const cellX = offset.x + x;
				const cellY = offset.y + y;

				if (tileNum >= 0)
				{
					sprite = this._makeSprite(
						tileNum,
						cellX * TILE_WIDTH,
						cellY * TILE_HEIGHT,
						'main_tileset'
					);
				}

				tiles.push(new Tile(sprite, cellX, cellY, cellX * TILE_WIDTH, cellY * TILE_HEIGHT));
			}
		}
	}

	private _setupEntityLayer(layerData: EntityLayerData): void
	{
		layerData.entities.forEach(entityData =>
		{
			console.log(entityData);
		});
	}

	private _makeSprite(tileId: number, posX: number, posY: number, tilesetName: string): Phaser.GameObjects.Sprite
	{
		const sprite = this.scene.add.sprite(posX + TILE_WIDTH / 2, posY + TILE_WIDTH / 2, tilesetName, tileId);
		sprite.setOrigin(0.5, 0.5);
		return sprite;
	}

	private _getChunkData(name: string): ChunkData
	{
		return this._jsonData[name];
	}
}