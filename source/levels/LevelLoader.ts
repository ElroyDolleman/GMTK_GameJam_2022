import { CHUNKS_COLUMNS, CHUNK_ROWS, TILE_HEIGHT, TILE_WIDTH } from '../utilities/GameConfig';
import { EntityLayerData, ChunkJsonData, TileLayerData } from './LevelData';
import { ICollidable } from '../collision/ICollidable';
import { CollectableDice } from '../dices/ColletableDice';
import { Entity } from '../entities/Entity';
import { Player } from '../player/Player';
import { IPoint } from '../utilities/IPoint';
import { Level } from './Level';
import { Tile } from './tile';
import { TileMap } from './TileMap';
import { TilesetData } from './TilesetData';

type LevelsJson = { [key: string]: ChunkJsonData; };
type ChunkType = 'deadend' | 'corridor' | 'up_corner' | 'down_corner';
type ChunkNames = { [key in ChunkType]: string[]; };
type ChunkData = { tiles: Tile[], entities: Entity[], collidables: ICollidable[] };

export class LevelLoader
{
	public readonly scene: Phaser.Scene;

	private _jsonData: LevelsJson;
	private _tilesetsData: { [key: string]: TilesetData; } = {};

	private _chunkNames: ChunkNames = {} as ChunkNames;

	public constructor(scene: Phaser.Scene)
	{
		this.scene = scene;
	}

	public preload(): void
	{
		this.scene.load.json('levels', 'assets/levels.json');
		this.scene.load.json('main_tileset_data', 'assets/default_tileset.json');
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
			throw new Error('Failed to get levels json from cache');
		}

		// TODO: Support others
		if (this.scene.cache.json.has('main_tileset_data'))
		{
			this._tilesetsData['main_tileset_data'] = this.scene.cache.json.get('main_tileset_data');
		}
		else
		{
			throw new Error('Failed to get main_tileset_data json from cache');
		}
	}

	public getTilesetData(tilesetName: string): TilesetData
	{
		return this._tilesetsData[tilesetName + '_data'];
	}

	public generateLevel(chunksX: number, chunksY: number): Level
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

		let tiles: Tile[] = [];
		let entities: Entity[] = [];
		let collidables: ICollidable[] = [];

		for (let x = 0; x < chunksX; x++)
		{
			for (let y = 0; y < chunksY; y++)
			{
				let info = this._getChunkInfoByPosition(x, y, chunksX - 1, chunksY - 1);
				let chunkData = this.loadChunk(this._pickChunk(info.type), { x, y }, info.reverse);

				tiles = tiles.concat(chunkData.tiles);
				entities = entities.concat(chunkData.entities);
				collidables = collidables.concat(chunkData.collidables);
			}
		}

		// SORT
		tiles.sort((tile1, tile2) =>
		{
			if (tile1.cellY === tile2.cellY)
			{
				if (tile1.cellX > tile2.cellX) { return 1; }
				else { return -1; }
			}
			if (tile1.cellY > tile2.cellY)
			{
				return 1;
			}
			return -1;
		});

		let level = new Level(this.scene, new TileMap(tiles, CHUNK_ROWS * chunksX, CHUNKS_COLUMNS * chunksY, TILE_WIDTH, TILE_HEIGHT), entities, collidables);
		return level;
	}

	private _getChunkInfoByPosition(x: number, y: number, lastX: number, lastY: number): { type: ChunkType, reverse: boolean }
	{
		if (x === 0)
		{
			if (y === 0) { return { type: 'deadend', reverse: false } }
			if (y % 2 === 0) { return { type: 'up_corner', reverse: false } }
			if (y === lastY) { return { type: 'deadend', reverse: false } }
			return { type: 'down_corner', reverse: false }
		}
		if (x === lastX)
		{
			if (y === 0) { return { type: 'down_corner', reverse: true } }
			if (y % 2 !== 0) { return { type: 'up_corner', reverse: true } }
			if (y === lastY) { return { type: 'deadend', reverse: true } }
			return { type: 'up_corner', reverse: true }
		}
		return { type: 'corridor', reverse: false }
	}

	private _pickChunk(type: ChunkType): ChunkJsonData
	{
		let index = Phaser.Math.Between(0, this._chunkNames[type].length - 1);

		return this._getChunkData(this._chunkNames[type][index]);
	}

	public loadChunk(chunkData: ChunkJsonData, chunkPos: IPoint, reverse: boolean): ChunkData
	{
		let tiles: Tile[] = [];
		let entities: Entity[] = [];
		let collidables: ICollidable[] = [];

		chunkData.layers.forEach(layer =>
		{
			switch(layer.name)
			{
			case 'tile_layer':
				tiles = tiles.concat(this._setupTileLayer(
					layer as TileLayerData,
					{
						x: chunkPos.x * CHUNK_ROWS,
						y: chunkPos.y * CHUNKS_COLUMNS
					},
					reverse
				));
				break;
			case 'entity_layer':
				let entitiesData = this._setupEntityLayer(layer as EntityLayerData, chunkPos, reverse);
				entities = entitiesData.entities.concat();
				collidables = entitiesData.collidables.concat();
				break;
			}
		});

		return { tiles, entities, collidables };
	}

	private _setupTileLayer(layerData: TileLayerData, offset: IPoint, reverse: boolean): Tile[]
	{
		const tiles: Tile[] = [];
		const tilesetData = this.getTilesetData('main_tileset');

		for (let y = 0; y < layerData.data2D.length; y++)
		{
			let rows = layerData.data2D[y];
			if (reverse)
			{
				rows = layerData.data2D[y].concat().reverse();
			}

			// for (let x = startX; x != endX; x += increment)
			for (let x = 0; x < rows.length; x++)
			{
				const tileNum = rows[x];
				let sprite: Phaser.GameObjects.Sprite | undefined;

				const cellX = offset.x + x;
				const cellY = offset.y + y;

				const tileData = tilesetData.tiles.find(t => { return t.id === tileNum; });
				const prop = tileData?.properties?.find(prop => { return prop.name === 'type'; });

				if (tileNum >= 0)
				{
					sprite = this._makeSprite(
						tileNum,
						cellX * TILE_WIDTH,
						cellY * TILE_HEIGHT,
						'main_tileset',
						reverse
					);
				}

				tiles.push(new Tile(sprite, cellX, cellY, cellX * TILE_WIDTH, cellY * TILE_HEIGHT, prop?.value as string));
			}
		}

		return tiles;
	}

	// TODO: Remove later
	private playerSpawnOnce: boolean = false;
	private _setupEntityLayer(layerData: EntityLayerData, chunkPos: IPoint, reverse: boolean): { entities: Entity[], collidables: ICollidable[] }
	{
		let entities: Entity[] = [];
		let collidables: ICollidable[] = [];

		layerData.entities.forEach(entityData =>
		{
			let x = entityData.x + chunkPos.x * CHUNK_ROWS * TILE_WIDTH;
			let y = entityData.y + chunkPos.y * CHUNKS_COLUMNS * TILE_HEIGHT;

			if (reverse)
			{
				let tileX = Math.floor(entityData.x / TILE_WIDTH);
				let newTileX = CHUNK_ROWS - tileX;
				x = (newTileX * TILE_WIDTH) + chunkPos.x * CHUNK_ROWS * TILE_WIDTH;
			}

			switch (entityData.name)
			{
			case 'player_spawn':
				if (this.playerSpawnOnce) { return; }
				this.playerSpawnOnce = true;
				let player = new Player(this.scene, { x, y });
				entities.push(player);

				this.scene.cameras.main.startFollow(player.sprite, true, undefined, undefined, undefined, 64);
				break;
			case 'dice_collectable':
				let dice = new CollectableDice(this.scene, { x, y });
				console.log({ x, y }, entityData.x, entityData.y);
				entities.push(dice);
				break;
			}

			if (entityData.values?.collidable)
			{
				collidables.push(entities[entities.length - 1]);
			}
		});

		return { entities, collidables };
	}

	private _makeSprite(tileId: number, posX: number, posY: number, tilesetName: string, flipX: boolean): Phaser.GameObjects.Sprite
	{
		const sprite = this.scene.add.sprite(posX + TILE_WIDTH / 2, posY + TILE_WIDTH / 2, tilesetName, tileId);
		sprite.setOrigin(0.5, 0.5);
		sprite.flipX = flipX;
		return sprite;
	}

	private _getChunkData(name: string): ChunkJsonData
	{
		return this._jsonData[name];
	}
}