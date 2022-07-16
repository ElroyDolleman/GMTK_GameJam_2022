import { IPoint } from '../utilities/IPoint';

export type DiceValues = 1 | 2 | 3 | 4 | 5 | 6;

export class Dice
{
	public readonly sprite: Phaser.GameObjects.Sprite;
	public readonly key: string;

	private _currentValue: DiceValues = 1;

	public constructor(scene: Phaser.Scene, position: IPoint, key: string = 'basic_dice')
	{
		this.key = key;
		this.sprite = scene.add.sprite(position.x, position.y, 'main-spritesheet', key + '1');
	}

	public setValue(value: DiceValues): void
	{
		this._currentValue = value;
		this._updateSprite();
	}

	public next(): void
	{
		this._currentValue++;
		if (this._currentValue > 6)
		{
			this._currentValue = 1;
		}

		this._updateSprite();
	}

	public previous(): void
	{
		this._currentValue--;
		if (this._currentValue < 0)
		{
			this._currentValue = 6;
		}

		this._updateSprite();
	}

	public pickRandom(canBecomeSameValue: boolean = true, rerollValues: DiceValues[] = [], rerollAmount: number = 1, rerollChance: number = 100): void
	{
		let newValue: DiceValues;
		let reroll: boolean = false;
		do
		{
			newValue = Phaser.Math.Between(1, 6) as DiceValues;

			reroll = !canBecomeSameValue && this._currentValue === newValue;
			if (!reroll)
			{
				if (rerollAmount > 0 && rerollValues.includes(newValue))
				{
					if (Phaser.Math.Between(1, 100) < rerollChance)
					{
						rerollAmount--;
						reroll = true;
						console.log('reroll', newValue);
					}
					else
					{
						console.log('missed reroll', newValue);
					}
				}
			}
		}
		while (reroll)

		this._currentValue = newValue;
		this._updateSprite();
	}

	public animateRandomPick(shuffleSpeedMS: number, rolls: number, rerollValues: DiceValues[] = [], rerollAmount: number = 1, rerollChance: number = 100): Promise<void>
	{
		return new Promise<void>(resolve =>
		{
			let id = setInterval(() =>
			{
				if (rolls-- === 0)
				{
					this.pickRandom(false, rerollValues, rerollAmount, rerollChance);

					clearInterval(id);
					resolve();
				}
				else
				{
					this.pickRandom(false);
				}
			}, shuffleSpeedMS);
		});
	}

	private _updateSprite(): void
	{
		this.sprite.setFrame(this.key + this._currentValue);
	}

	public destroy(): void
	{
		this.sprite.destroy();
	}
}