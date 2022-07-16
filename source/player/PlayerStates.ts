export enum PlayerStates {
	Idle,
	Walk,
	Jump,
	Fall,
}

export const PlayerAnimationsInfo: { [key in PlayerStates]: { name: string, isSingleFrame: boolean } } =
{
	[PlayerStates.Idle]: { name: 'character_walk1', isSingleFrame: true },
	[PlayerStates.Walk]: { name: 'character_walk', isSingleFrame: false },
	[PlayerStates.Jump]: { name: 'character_jump', isSingleFrame: true },
	[PlayerStates.Fall]: { name: 'character_fall', isSingleFrame: true },
}