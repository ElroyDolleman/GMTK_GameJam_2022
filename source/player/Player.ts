import { Entity } from '../entities/Entity';
import { IPoint } from '../utilities/IPoint';
import { CollisionResult } from '../collision/CollisionManager';
import { StateMachine } from '../state_machine/StateMachine';
import { PlayerGroundedState } from './states/PlayerGroundedState';
import { PlayerInputManager } from '../input/PlayerInputManager';
import { NumberUtility } from '../utilities/NumberUtility';
import { PlayerStates } from './PlayerStates';
import { PlayerIdleState } from './states/PlayerIdleState';
import { PlayerWalkState } from './states/PlayerWalkState';
import { PlayerJumpState } from './states/PlayerJumpState';
import { PlayerFallState } from './states/PlayerFallState';
import { PlayerConfig } from './PlayerConfig';

export class Player extends Entity
{
	protected _stateMachine: StateMachine<Player>;

	public inputManager: PlayerInputManager;
	public sprite: Phaser.GameObjects.Sprite;

	public constructor(scene: Phaser.Scene, spawnPosition: IPoint)
	{
		super({ left: 2, top: 4, right: 14, bottom: 16 }, spawnPosition);

		this._stateMachine = new StateMachine(this);
		this._stateMachine.addState(PlayerStates.Idle, new PlayerIdleState());
		this._stateMachine.addState(PlayerStates.Walk, new PlayerWalkState());
		this._stateMachine.addState(PlayerStates.Jump, new PlayerJumpState());
		this._stateMachine.addState(PlayerStates.Fall, new PlayerFallState());
		this._stateMachine.start(0);

		this.sprite = scene.add.sprite(spawnPosition.x, spawnPosition.y, 'main-spritesheet', 'character1');
		this.sprite.setOrigin(0.5, 1);

		this.inputManager = new PlayerInputManager(scene);

		this._debugGraphics = scene.add.graphics({ fillStyle: { color: 0xFF, alpha: 0.7 } });
		this._debugGraphics.fillRectShape(this.hitbox);
	}

	public update(): void
	{
		this.inputManager.update();
		this._stateMachine.currentState.update();
	}

	public lateUpdate(): void
	{
		this.sprite.setPosition(this.hitbox.centerX, this.hitbox.bottom);

		this._debugGraphics.clear();
		this._debugGraphics.fillRectShape(this.hitbox);
	}

	public updateMovementControls(): void
	{
		if (this.inputManager.left.heldDownFrames > 0)
		{
			if (this.speed.x > -PlayerConfig.RUN_SPEED)
			{
				this.speed.x = Math.max(this.speed.x - PlayerConfig.RUN_ACCEL, -PlayerConfig.RUN_SPEED);
			}
			else if (this.speed.x < -PlayerConfig.RUN_SPEED)
			{
				this.speed.x = Math.min(this.speed.x + PlayerConfig.RUN_ACCEL, -PlayerConfig.RUN_SPEED);
			}
		}
		else if (this.inputManager.right.heldDownFrames > 0)
		{
			if (this.speed.x < PlayerConfig.RUN_SPEED)
			{
				this.speed.x = Math.min(this.speed.x + PlayerConfig.RUN_ACCEL, PlayerConfig.RUN_SPEED);
			}
			else if (this.speed.x > PlayerConfig.RUN_SPEED)
			{
				this.speed.x = Math.max(this.speed.x - PlayerConfig.RUN_ACCEL, PlayerConfig.RUN_SPEED);
			}
		}
		else
		{
			this.decelerate(PlayerConfig.RUN_ACCEL);
		}
	}

	public decelerate(deceleration: number): void
	{
		if (Math.abs(this.speed.x) < deceleration)
		{
			this.speed.x = 0;
		}
		else
		{
			this.speed.x -= deceleration * NumberUtility.sign(this.speed.x);
		}
	}

	public destroy(): void
	{
		this._stateMachine.destroy();
	}

	public onCollisionSolved(result: CollisionResult): void
	{
		this._stateMachine.currentState.onCollisionSolved(result);
	}
}