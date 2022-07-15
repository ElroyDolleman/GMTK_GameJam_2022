import { LevelLoader } from '../levels/LevelLoader';

export class GameScene extends Phaser.Scene
{
	private readonly _levelLoader: LevelLoader;

	public constructor()
	{
		super({ key: 'GameScene', active: true});

		this._levelLoader = new LevelLoader(this);
	}

	public preload(): void
	{
		this._levelLoader.preload();

		this.load.atlas('test', 'assets/main-spritesheet.png', 'assets/main-spritesheet.json');
	}

	public create(): void
	{
		this.cameras.main.setBounds(0, 0, 3392, 1000);
		this.cameras.main.setScroll(34, 40);

		this._levelLoader.generateLevel(2, 2);

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

	}
}