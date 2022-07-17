export type TilesetData = {
	tileCount: number;
	spacing: number;
	margin: number;
	image: string;
	name: string;
	tiles: TilesetTileData[];
}

type TilesetTileData = {
	id: number;
	properties: TileProperties[];
}

type TileProperties = {
	name: string;
	type: string;
	value: string | number | boolean;
}