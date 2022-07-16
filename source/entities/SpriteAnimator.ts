import { TimeUtility } from '../utilities/TimeUtility';

export type SquishProps = {
	timer: number;
	startTime: number;
	reverseTime: number;
	scaleX: number;
	scaleY: number;
}

export class SpriteAnimator
{
	public get facingDirection(): number { return this.sprite.flipX ? -1 : 1; }
	public set facingDirection(dir: number) { this.sprite.flipX = dir < 0; }

	public get isSquishing(): boolean { return this._currentSquish.timer > 0; }
	public get currentAnimKey(): string { return this._currentAnimKey; }

	public readonly sprite: Phaser.GameObjects.Sprite;
	public readonly scene: Phaser.Scene;

	private _currentSquish: SquishProps = {
		timer: 0,
		reverseTime: 0,
		startTime: 0,
		scaleX: 1,
		scaleY: 1
	};
	private _currentAnimKey: string = '';

	public constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite)
	{
		this.scene = scene;
		this.sprite = sprite;
	}

	public update(): void
	{
		if (this.isSquishing)
		{
			this._updateSquish();
		}
	}

	public changeAnimation(key: string, isSingleFrame: boolean = false): void
	{
		this._currentAnimKey = key;
		if (isSingleFrame)
		{
			this.sprite.anims.stop();
			this.sprite.setFrame(key);
		}
		else
		{
			this.sprite.anims.play(key);
		}
	}

	public createAnimation(key: string, texture: string, prefix: string, end: number, frameRate: number = 16, repeat: number = -1): void
	{
		let frameNames = this.scene.anims.generateFrameNames(texture, {
			prefix,
			start: 1,
			end,
		});

		if (frameNames.length === 0)
		{
			console.log(key, texture, prefix, end);
			throw new Error('Failed to generate frame names for animation.');
		}

		this.scene.anims.create({
			key: key,
			frames: frameNames,
			frameRate: frameRate,
			repeat: repeat,
		});
	}

	public squish(scaleX: number, scaleY: number, duration: number, reverseTime?: number): void
	{
		this._currentSquish = {
			timer: duration,
			reverseTime: reverseTime === undefined ? duration / 2 : reverseTime,
			startTime: duration,
			scaleX: scaleX,
			scaleY: scaleY
		}
	}
	protected _updateSquish(): void
	{
		this._currentSquish.timer = Math.max(this._currentSquish.timer - TimeUtility.elapsedSeconds, 0);
		let timeToReverse = this._currentSquish.startTime - this._currentSquish.reverseTime;

		if (this._currentSquish.timer > timeToReverse)
		{
			let t = 1 - (this._currentSquish.timer - timeToReverse) / this._currentSquish.reverseTime;

			this.sprite.scaleX = Phaser.Math.Linear(1, this._currentSquish.scaleX, t);
			this.sprite.scaleY = Phaser.Math.Linear(1, this._currentSquish.scaleY, t);
		}
		else
		{
			let t = 1 - this._currentSquish.timer / timeToReverse;

			this.sprite.scaleX = Phaser.Math.Linear(this._currentSquish.scaleX, 1, t);
			this.sprite.scaleY = Phaser.Math.Linear(this._currentSquish.scaleY, 1, t);
		}
	}
}