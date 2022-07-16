import { gameScene } from '../scenes/GameScene';
import { TILE_HEIGHT, TILE_WIDTH } from '../utilities/GameConfig';

export enum TileType {
	Empty,
	Solid
}

export class Tile
{
	public readonly cellX: number;
	public readonly cellY: number;

	public sprite: Phaser.GameObjects.Sprite | undefined;
	public position: Phaser.Geom.Point;

	public hitbox: Phaser.Geom.Rectangle;
	private _debugGraphics: any;

	public tileType: TileType = TileType.Empty;

	public constructor(sprite: Phaser.GameObjects.Sprite | undefined, cellX: number, cellY: number, posX: number, posY: number, tileType?: TileType)
	{
		this.position = new Phaser.Geom.Point(posX, posY);
		this.sprite = sprite;

		this.cellX = cellX;
		this.cellY = cellY;

		this.hitbox = new Phaser.Geom.Rectangle(posX, posY, TILE_WIDTH, TILE_HEIGHT);

		if (this.sprite)
		{
			this._debugGraphics = gameScene.add.graphics({ fillStyle: { color: 0xFF0000, alpha: 0.4 } });
			this._debugGraphics.fillRectShape(this.hitbox);

			if (!tileType)
			{
				this.tileType = TileType.Solid;
			}
		}
	}

	public destroy(): void
	{
		this.sprite?.destroy();
	}
}