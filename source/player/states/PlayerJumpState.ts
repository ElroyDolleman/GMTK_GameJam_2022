import { CollisionResult } from '../../collision/CollisionManager';
import { PlayerConfig } from '../PlayerConfig';
import { PlayerStates } from '../PlayerStates';
import { PlayerAirborneState } from './PlayerAirborneState';

export class PlayerJumpState extends PlayerAirborneState
{
	private isHoldingJump: boolean;
	private get jumpHeldDownFrames(): number { return this.machine.owner.inputManager.jump.heldDownFrames; }

	public constructor()
	{
		super();
	}

	public enter(): void
	{
		this.isHoldingJump = true;
		this.machine.owner.speed.y -= PlayerConfig.INITIAL_JUMP_POWER;
	}
	public update(): void
	{
		this.machine.owner.updateMovementControls();

		if (this.isHoldingJump && this.jumpHeldDownFrames > 1 && this.jumpHeldDownFrames < 12)
		{
			this.machine.owner.speed.y -= PlayerConfig.JUMP_POWER;
		}
		else if (this.machine.owner.inputManager.jump.heldDownFrames === 0)
		{
			this.isHoldingJump = false;
		}

		this._updateGravity();

		if (this.machine.owner.speed.y >= 0)
		{
			this.machine.changeState(PlayerStates.Fall);
		}
	}

	public leave(): void
	{

	}

	public onCollisionSolved(result: CollisionResult): void
	{
		super.onCollisionSolved(result);
	}
}