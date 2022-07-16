import { IRectangle } from '../collision/IRectangle';
import { IPoint } from '../utilities/IPoint';
import { Tile } from './tile';

export class TileMap
{
	private readonly _tiles: Tile[];

	public readonly gridCellsX: number;
	public readonly gridCellsY: number;
	public readonly tileWidth: number;
	public readonly tileHeight: number;

	public constructor(tiles: Tile[], gridCellsX: number, gridCellsY: number, tileWidth: number, tileHeight: number)
	{
		this._tiles = tiles;
		this.gridCellsX = gridCellsX;
		this.gridCellsY = gridCellsY;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
	}

	public getTile(cellX: number, cellY: number): Tile
	{
		return this._tiles[cellX + (cellY * this.gridCellsX)];
	}

	public getTilesFromRect(rect: IRectangle, margin: number = 0): Tile[]
	{
		return this.getTilesFromTo(
			this.toGridLocation(rect.left - margin, rect.top - margin),
			this.toGridLocation(rect.right + margin, rect.bottom + margin)
		);
	}

	public getTilesFromTo(from: IPoint, to: IPoint): Tile[]
	{
		const tiles = [];
		for (let x = from.x; x <= to.x; x++)
		{
			for (let y = from.y; y <= to.y; y++)
			{
				const tile = this.getTile(x, y);
				if (tile)
				{
					tiles.push(tile);
				}
			}
		}
		return tiles;
	}
	public getTileNextTo(tile: Tile, x: number, y: number): Tile
	{
		return this.getTile(tile.cellX + x, tile.cellY + y);
	}
	public worldToTile(x: number, y: number): Tile
	{
		return this.getTile(this.tocellXumn(x), this.tocellY(y));
	}

	public tocellXumn(xPos: number): number
	{
		return Math.floor(xPos / this.tileWidth);
	}
	public tocellY(yPos: number): number
	{
		return Math.floor(yPos / this.tileHeight);
	}
	public toGridLocation(x: number, y: number): Phaser.Geom.Point
	{
		return new Phaser.Geom.Point(
			this.tocellXumn(x),
			this.tocellY(y),
		);
	}
	public toWorldX(cellXumn: number): number
	{
		return cellXumn * this.tileWidth;
	}
	public toWorldY(cellY: number): number
	{
		return cellY * this.tileHeight;
	}
	public toWorldPosition(cellX: number, cellY: number): Phaser.Geom.Point
	{
		return new Phaser.Geom.Point(
			this.toWorldX(cellX),
			this.toWorldY(cellY)
		);
	}

	public destroy(): void
	{
		while (this._tiles.length > 0)
		{
			this._tiles[0].destroy();
			this._tiles.splice(0, 1);
		}
	}
}