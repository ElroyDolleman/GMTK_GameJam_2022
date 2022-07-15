export class Tile
{
	public readonly cellX: number;
	public readonly cellY: number;

	public sprite: Phaser.GameObjects.Sprite | undefined;
	public position: Phaser.Geom.Point;

	public hitbox: Phaser.Geom.Rectangle;

	public constructor(sprite: Phaser.GameObjects.Sprite | undefined, cellX: number, cellY: number, posX: number, posY: number)
	{
		this.position = new Phaser.Geom.Point(posX, posY);
		this.sprite = sprite;

		this.cellX = cellX;
		this.cellY = cellY;
	}

	public destroy(): void
	{
		this.sprite?.destroy();
	}
}