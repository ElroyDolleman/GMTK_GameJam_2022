import { Level } from '../levels/Level';
import { Tile, TileTypes } from '../levels/tile';
import { TileMap } from '../levels/TileMap';
import { gameScene } from '../scenes/GameScene';
import { ICollidable } from './ICollidable';
import { IRectangle } from './IRectangle';

export type CollisionResult = {
	previousHitbox: IRectangle;
	tiles: Tile[];
	collided: {
		onLeft: boolean;
		onRight: boolean;
		onTop: boolean;
		onBottom: boolean;
	}
}

export class CollisionManager
{
	private readonly _level: Level;
	private _debugGraphics: Phaser.GameObjects.Graphics;

	public constructor(level: Level)
	{
		this._level = level;
	}

	private _getDefualtResult(collidable: ICollidable): CollisionResult
	{
		return {
			tiles: [],
			previousHitbox: {
				left: collidable.hitbox.left,
				right: collidable.hitbox.right,
				top: collidable.hitbox.top,
				bottom: collidable.hitbox.bottom,
			},
			collided: {
				onLeft: false,
				onRight: false,
				onTop: false,
				onBottom: false,
			}
		}
	}

	public moveCollidable(collidable: ICollidable): CollisionResult
	{
		let result = this._getDefualtResult(collidable);
		result.tiles = this._level.map.getTilesFromRect(collidable.nextHitbox, 2);

		// if (!this._debugGraphics) { this._debugGraphics = gameScene.add.graphics({ fillStyle: { color: 0xFFFF00, alpha: 0.8 } }); }
		// this._debugGraphics.clear();

		collidable.moveX();
		for (let i = 0; i < result.tiles.length; i++)
		{
			// this._debugGraphics.fillRectShape(result.tiles[i].hitbox);

			if (!this._overlapsNonEmptyTile(result.tiles[i], collidable))
			{
				continue;
			}

			let collideResult = this._solveHorizontalCollision(result.tiles[i], collidable);

			switch(collideResult)
			{
			case 'onRight': result.collided.onRight = true; break;
			case 'onLeft': result.collided.onLeft = true; break;
			}
		}

		collidable.moveY();
		for (let i = 0; i < result.tiles.length; i++)
		{
			if (!this._overlapsNonEmptyTile(result.tiles[i], collidable))
			{
				continue;
			}

			let collideResult = this._solveVerticalCollision(result.tiles[i], collidable);

			switch(collideResult)
			{
			case 'onTop': result.collided.onTop = true; break;
			case 'onBottom': result.collided.onBottom = true; break;
			}
		}

		collidable.onCollisionSolved(result);
		return result;
	}

	private _solveHorizontalCollision(tile: Tile, collidable: ICollidable): null | 'onRight' | 'onLeft'
	{
		if (collidable.speed.x > 0)
		{
			collidable.hitbox.x = tile.hitbox.x - collidable.hitbox.width;
			return 'onRight';
		}
		else if (collidable.speed.x < 0)
		{
			collidable.hitbox.x = tile.hitbox.right;
			return 'onLeft';
		}
		return null;
	}

	private _solveVerticalCollision(tile: Tile, collidable: ICollidable): null | 'onBottom' | 'onTop'
	{
		if (collidable.speed.y > 0)
		{
			collidable.hitbox.y = tile.hitbox.y - collidable.hitbox.height;
			return 'onBottom';
		}
		else if (collidable.speed.y < 0)
		{
			collidable.hitbox.y = tile.hitbox.bottom;
			return 'onTop';
		}
		return null;
	}

	private _overlapsNonEmptyTile(tile: Tile, collidable: ICollidable): boolean
	{
		return tile.tileType !== TileTypes.Empty && Phaser.Geom.Rectangle.Overlaps(tile.hitbox, collidable.hitbox);
	}
}