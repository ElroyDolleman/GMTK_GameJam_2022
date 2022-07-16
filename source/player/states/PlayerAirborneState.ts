import { CollisionResult } from '../../collision/CollisionManager';
import { IBaseState } from '../../state_machine/IBaseState';
import { StateMachine } from '../../state_machine/StateMachine';
import { Player } from '../Player';
import { PlayerConfig } from '../PlayerConfig';
import { PlayerStates } from '../PlayerStates';

export class PlayerAirborneState implements IBaseState<Player>
{
	public machine: StateMachine<Player>;

	public constructor() {}

	public enter(): void
	{

	}

	public update(): void
	{

	}

	public leave(): void
	{

	}

	public onCollisionSolved(result: CollisionResult): void
	{
		if (result.collided.onBottom)
		{
			this._onLand();
		}
		else if (result.collided.onTop)
		{
			this._headbonk();
		}
	}

	protected _updateGravity(): void
	{
		if (this.machine.owner.speed.y < PlayerConfig.MAX_FALLSPEED)
		{
			this.machine.owner.speed.y = Math.min(this.machine.owner.speed.y + PlayerConfig.GRAVITY, PlayerConfig.MAX_FALLSPEED);
		}
	}

	protected _onLand(): void
	{
		this.machine.owner.speed.y = 0;

		let state: PlayerStates = this.machine.owner.speed.x === 0 ? PlayerStates.Idle : PlayerStates.Walk;
		this.machine.changeState(state);
	}

	protected _headbonk(): void
	{
		this.machine.owner.speed.y = 0;
	}
}