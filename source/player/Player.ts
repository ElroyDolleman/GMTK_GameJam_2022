import { Entity } from '../entities/Entity';
import { IPoint } from '../utilities/IPoint';
import { CollisionResult } from '../collision/CollisionManager';
import { StateMachine } from '../state_machine/StateMachine';
import { PlayerGroundedState } from './states/PlayerGroundedState';

export class Player extends Entity
{
	protected _stateMachine: StateMachine<Player>;

	public sprite: Phaser.GameObjects.Sprite;

	public constructor(scene: Phaser.Scene, spawnPosition: IPoint)
	{
		super({ left: 2, top: 4, right: 14, bottom: 16 }, spawnPosition);

		this._stateMachine = new StateMachine(this);
		this._stateMachine.addState(0, new PlayerGroundedState());

		this.sprite = scene.add.sprite(spawnPosition.x, spawnPosition.y, 'main-spritesheet', 'character1');
		this.sprite.setOrigin(0.5, 1);
	}

	public update(): void
	{

	}

	public lateUpdate(): void
	{

	}

	public destroy(): void
	{
		this._stateMachine.destroy();
	}

	public onCollisionSolved(result: CollisionResult): void
	{

	}
}