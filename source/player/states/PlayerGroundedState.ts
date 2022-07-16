import { CollisionResult } from '../../collision/CollisionManager';
import { IBaseState } from '../../state_machine/IBaseState';
import { StateMachine } from '../../state_machine/StateMachine';
import { Player } from '../Player';

export class PlayerGroundedState implements IBaseState<Player>
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

	}
}