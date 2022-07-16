import { Entity } from '../entities/Entity';
import { IPoint } from '../utilities/IPoint';
import { CollisionResult } from '../collision/CollisionManager';
import { StateMachine } from '../state_machine/StateMachine';
import { PlayerGroundedState } from './states/PlayerGroundedState';
import { PlayerInputManager } from '../input/PlayerInputManager';

export class Player extends Entity
{
	protected _stateMachine: StateMachine<Player>;
	protected _inputManager: PlayerInputManager;

	public sprite: Phaser.GameObjects.Sprite;

	public constructor(scene: Phaser.Scene, spawnPosition: IPoint)
	{
		super({ left: 2, top: 4, right: 14, bottom: 16 }, spawnPosition);

		this._stateMachine = new StateMachine(this);
		this._stateMachine.addState(0, new PlayerGroundedState());

		this.sprite = scene.add.sprite(spawnPosition.x, spawnPosition.y, 'main-spritesheet', 'character1');
		this.sprite.setOrigin(0.5, 1);

		this._inputManager = new PlayerInputManager(scene);

		this._debugGraphics = scene.add.graphics({ fillStyle: { color: 0xFF, alpha: 0.7 } });
		this._debugGraphics.fillRectShape(this.hitbox);
	}

	public update(): void
	{
		this._inputManager.update();

		if (this._inputManager.right.heldDownFrames > 0)
		{
			this.speed.x = 4;
		}
		else if (this._inputManager.left.heldDownFrames > 0)
		{
			this.speed.x = -4;
		}
	}

	public lateUpdate(): void
	{
		this.sprite.setPosition(this.hitbox.centerX, this.hitbox.bottom);

		this._debugGraphics.clear();
		this._debugGraphics.fillRectShape(this.hitbox);
	}

	public destroy(): void
	{
		this._stateMachine.destroy();
	}

	public onCollisionSolved(result: CollisionResult): void
	{

	}
}