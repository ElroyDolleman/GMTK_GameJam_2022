import { CollisionResult } from '../collision/CollisionManager';
import { Entity } from '../entities/Entity';
import { gameScene } from '../scenes/GameScene';
import { IPoint } from '../utilities/IPoint';

export class CollectableDice extends Entity
{
	public readonly sprite: Phaser.GameObjects.Sprite;

	public constructor(scene: Phaser.Scene, position: IPoint)
	{
		super({ left: 1, top: 1, right: 15, bottom: 15 }, position);

		this.sprite = scene.add.sprite(position.x, position.y, 'main-spritesheet', 'dice_collectable1');
	}

	public update(): void
	{

	}

	public lateUpdate(): void
	{

	}

	public destroy(): void
	{
		this.sprite.destroy();
	}

	public onCollisionSolved(result: CollisionResult): void
	{

	}
}