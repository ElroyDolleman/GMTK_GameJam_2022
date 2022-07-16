import { Entity } from '../entities/Entity';
import { IPoint } from '../utilities/IPoint';
import { CollisionResult } from '../collision/CollisionManager';
import { StateMachine } from '../state_machine/StateMachine';
import { PlayerInputManager } from '../input/PlayerInputManager';
import { NumberUtility } from '../utilities/NumberUtility';
import { PlayerAnimationsInfo, PlayerStates } from './PlayerStates';
import { PlayerIdleState } from './states/PlayerIdleState';
import { PlayerWalkState } from './states/PlayerWalkState';
import { PlayerJumpState } from './states/PlayerJumpState';
import { PlayerFallState } from './states/PlayerFallState';
import { PlayerConfig } from './PlayerConfig';
import { SpriteAnimator } from '../entities/SpriteAnimator';

export class Player extends Entity
{
	protected _stateMachine: StateMachine<Player>;

	public inputManager: PlayerInputManager;
	public sprite: Phaser.GameObjects.Sprite;
	public animator: SpriteAnimator;

	public constructor(scene: Phaser.Scene, spawnPosition: IPoint)
	{
		super({ left: 4, top: 1, right: 12, bottom: 16 }, spawnPosition);

		this._stateMachine = new StateMachine(this);
		this._stateMachine.addState(PlayerStates.Idle, new PlayerIdleState());
		this._stateMachine.addState(PlayerStates.Walk, new PlayerWalkState());
		this._stateMachine.addState(PlayerStates.Jump, new PlayerJumpState());
		this._stateMachine.addState(PlayerStates.Fall, new PlayerFallState());
		this._stateMachine.start(0);

		this._stateMachine.addStateChangedListener(this._changeStateAnimation, this);

		this.sprite = scene.add.sprite(spawnPosition.x, spawnPosition.y, 'main-spritesheet', 'character_walk1');
		this.sprite.setOrigin(0.5, 1);

		this.animator = new SpriteAnimator(scene, this.sprite);
		this.animator.createAnimation('character_walk', 'main-spritesheet', 'character_walk', 2, PlayerConfig.FULL_SPEED_FRAMERATE);
		this.animator.changeAnimation('character_walk');

		this.inputManager = new PlayerInputManager(scene);

		// this._debugGraphics = scene.add.graphics({ fillStyle: { color: 0xFF, alpha: 0.5 } });
	}

	public update(): void
	{
		this.inputManager.update();
		this._stateMachine.currentState.update();
	}

	public lateUpdate(): void
	{
		this.sprite.setPosition(this.hitbox.centerX, this.hitbox.bottom);
		this.animator.update();

		if (this.speed.x > 0)
		{
			this.animator.facingDirection = 1;
		}
		else if (this.speed.x < 0)
		{
			this.animator.facingDirection = -1;
		}

		// this._debugGraphics.clear();
		// this._debugGraphics.fillRectShape(this.hitbox);
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

		this.sprite.anims.timeScale = Math.abs(this.speed.x) / PlayerConfig.RUN_SPEED;
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

	private _changeStateAnimation(state: PlayerStates): void
	{
		let animInfo = PlayerAnimationsInfo[state];
		this.animator.changeAnimation(animInfo.name, animInfo.isSingleFrame);
	}
}