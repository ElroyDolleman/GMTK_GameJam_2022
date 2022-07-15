type DefaultLayerData = {
	name: string;
}

export type EntityData = {
	name: string;
	x: number;
	y: number;
	values: any;
}

export interface TileLayerData extends DefaultLayerData {
	tileset: string;
	data2D: number[][];
}

export interface EntityLayerData extends DefaultLayerData {
	entities: EntityData[];
}

export type ChunkData = {
	layers: (TileLayerData | EntityLayerData)[];
}