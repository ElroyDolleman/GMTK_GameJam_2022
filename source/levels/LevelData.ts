type DefaultLayerData = {
	name: string;
}

export type EntityData = {
	name: string;
	x: number;
	y: number;
	values?: {
		collidable?: boolean;
	};
}

export interface TileLayerData extends DefaultLayerData {
	tileset: string;
	data2D: number[][];
}

export interface EntityLayerData extends DefaultLayerData {
	entities: EntityData[];
}

export type ChunkJsonData = {
	layers: (TileLayerData | EntityLayerData)[];
}