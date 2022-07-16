
import { LevelLoader } from '../levels/LevelLoader';
import { Level } from '../levels/Level';

export let gameScene: GameScene;

export class GameScene extends Phaser.Scene
{
	private readonly _levelLoader: LevelLoader;

	private currentLevel: Level;

	private camKeyLeft: Phaser.Input.Keyboard.Key;
	private camKeyRight: Phaser.Input.Keyboard.Key;
	private camKeyUp: Phaser.Input.Keyboard.Key;
	private camKeyDown: Phaser.Input.Keyboard.Key;

	public constructor()
	{
		super({ key: 'GameScene', active: true});

		this._levelLoader = new LevelLoader(this);

		// TODO: Fix later
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		gameScene = this;
	}

	public preload(): void
	{
		this._levelLoader.preload();

		this.load.atlas('main-spritesheet', 'assets/main-spritesheet.png', 'assets/main-spritesheet.json');
	}

	public create(): void
	{
		this.camKeyLeft = this.input.keyboard.addKey('left');
		this.camKeyRight = this.input.keyboard.addKey('right');
		this.camKeyUp = this.input.keyboard.addKey('up');
		this.camKeyDown = this.input.keyboard.addKey('down');

		this.currentLevel = this._levelLoader.generateLevel(3, 3);

		// const atlasTexture = this.textures.get('test');
		// const frames = atlasTexture.getFrameNames();

		// for (let i = 0; i < frames.length; i++)
		// {
		// 	const x = Phaser.Math.Between(0, 320);
		// 	const y = Phaser.Math.Between(0, 200);

		// 	this.add.image(x, y, 'test', frames[i]);
		// }
	}

	public update(): void
	{
		if (this.camKeyLeft.isDown)
		{
			this.cameras.main.setScroll(this.cameras.main.scrollX - 4, this.cameras.main.scrollY);
		}
		else if (this.camKeyRight.isDown)
		{
			this.cameras.main.setScroll(this.cameras.main.scrollX + 4, this.cameras.main.scrollY);
		}
		if (this.camKeyUp.isDown)
		{
			this.cameras.main.setScroll(this.cameras.main.scrollX, this.cameras.main.scrollY - 4);
		}
		else if (this.camKeyDown.isDown)
		{
			this.cameras.main.setScroll(this.cameras.main.scrollX, this.cameras.main.scrollY + 4);
		}

		this.currentLevel.update();
	}
}