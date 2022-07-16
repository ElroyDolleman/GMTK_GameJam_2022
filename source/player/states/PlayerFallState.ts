import { CollisionResult } from '../../collision/CollisionManager';
import { PlayerAirborneState } from './PlayerAirborneState';

export class PlayerFallState extends PlayerAirborneState
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
		this._updateGravity();
	}

	public leave(): void
	{

	}
}