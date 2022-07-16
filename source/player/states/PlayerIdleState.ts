import { PlayerStates } from '../PlayerStates';
import { PlayerGroundedState } from './PlayerGroundedState';

export class PlayerIdleState extends PlayerGroundedState
{
	public constructor()
	{
		super();
	}

	public enter(): void
	{

	}
	public update(): void
	{
		this.machine.owner.updateMovementControls();

		if (this.machine.owner.speed.x !== 0)
		{
			this.machine.changeState(PlayerStates.Walk);
		}

		super.update();
	}

	public leave(): void
	{

	}
}