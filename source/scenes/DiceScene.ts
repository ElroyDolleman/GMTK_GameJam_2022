import { Dice, DiceValues } from '../dices/Dice';
import { TimeDelay } from '../utilities/TimeDelay';

export type DiceSceneInitData = {
	diceValue: DiceValues | 'random';
}

export class DiceScene extends Phaser.Scene
{
	private _background: Phaser.GameObjects.Image;
	private _playerDice: Dice;
	private _enemyDice: Dice;

	private _initData: DiceSceneInitData;

	public constructor()
	{
		super({ key: 'DiceScene', active: true});
	}

	public init(data: DiceSceneInitData): void
	{
		this._initData = data;
	}

	public preload(): void
	{
		this.load.image('dicescene_background', 'assets/dicescene_background.png');
		this.load.atlas('main-spritesheet', 'assets/main-spritesheet.png', 'assets/main-spritesheet.json');
	}

	public create(): void
	{
		this._background = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, 'dicescene_background');
		this.cameras.main.zoom = 2;

		let x = this._background.x - this._background.width / 2 + 40;
		let y = this._background.y - this._background.height / 2 + 88;

		this._playerDice = new Dice(this, { x, y });
		this._enemyDice = new Dice(this, { x: x + 80, y });

		if (this._initData.diceValue === undefined)
		{
			this._goToGame();
		}
		else
		{
			this._playDiceAnimations(this._initData.diceValue);
		}
	}

	private async _playDiceAnimations(playerDiceValue: DiceValues | 'random'): Promise<void>
	{
		let diceRollSpeed = 120;
		let totalRolls = 12;

		if (playerDiceValue === 'random')
		{
			await Promise.all([
				this._playerDice.animateRandomPick(diceRollSpeed, totalRolls, [1], 1, 75),
				this._enemyDice.animateRandomPick(diceRollSpeed, totalRolls, [6], 1, 50)
			]);
		}
		else
		{
			this._playerDice.setValue(playerDiceValue as DiceValues);

			await this._enemyDice.animateRandomPick(diceRollSpeed, totalRolls, [6], 1, 75);
		}

		this._goToGame();
	}

	private async _goToGame(): Promise<void>
	{
		await TimeDelay.after(2000);

		this.scene.start('GameScene', { hello: 'world!' });
	}

	public update(): void
	{

	}
}