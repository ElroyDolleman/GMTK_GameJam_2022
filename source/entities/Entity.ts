import { CollisionResult } from '../collision/CollisionManager';
import { ICollidable } from '../collision/ICollidable';
import { IRectangle } from '../collision/IRectangle';
import { IPoint } from '../utilities/IPoint';
import { TimeUtility } from '../utilities/TimeUtility';

export abstract class Entity implements ICollidable
{
	public speed: Phaser.Math.Vector2;

	private _hitbox: Phaser.Geom.Rectangle;

	public get hitbox(): Phaser.Geom.Rectangle
	{
		return this._hitbox;
	}

	public get nextHitbox(): Phaser.Geom.Rectangle
	{
		return new Phaser.Geom.Rectangle(
			this.x + this.speed.x * TimeUtility.elapsedSeconds,
			this.y + this.speed.y * TimeUtility.elapsedSeconds,
			this.hitbox.width,
			this.hitbox.height
		);
	}

	public get x(): number { return this._hitbox.x; }
	public set x(x: number) { this._hitbox.x = x; }

	public get y(): number { return this._hitbox.y; }
	public set y(y: number) { this._hitbox.y = y; }

	protected _debugGraphics: Phaser.GameObjects.Graphics;

	public get position(): Phaser.Math.Vector2
	{
		return new Phaser.Math.Vector2(this.hitbox.x, this.hitbox.y);
	}

	public constructor(hitbox: IRectangle, position: IPoint)
	{
		this._hitbox = new Phaser.Geom.Rectangle(
			position.x + hitbox.left,
			position.y + hitbox.top,
			hitbox.right - hitbox.left,
			hitbox.bottom - hitbox.top
		);
		this.speed = new Phaser.Math.Vector2();
	}

	public abstract update(): void;
	public abstract lateUpdate(): void;

	public moveX(): void
	{
		this._hitbox.x += this.speed.x * TimeUtility.elapsedSeconds;
	}
	public moveY(): void
	{
		this._hitbox.y += this.speed.y * TimeUtility.elapsedSeconds;
	}

	public abstract destroy(): void;
	public abstract onCollisionSolved(result: CollisionResult): void
}