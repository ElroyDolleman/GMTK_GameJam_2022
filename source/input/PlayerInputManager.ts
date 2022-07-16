import { Input } from './Input';

export class PlayerInputManager
{
	public readonly left: Input;
	public readonly right: Input;
	public readonly jump: Input;
	public readonly down: Input;

	public constructor(scene: Phaser.Scene)
	{
		this.left = new Input(scene.input.keyboard.addKey('left'));
		this.right = new Input(scene.input.keyboard.addKey('right'));
		this.jump = new Input(scene.input.keyboard.addKey('up'));
		this.down = new Input(scene.input.keyboard.addKey('down'));
	}

	public update(): void
	{
		this.left.update();
		this.right.update();
		this.jump.update();
		this.down.update();
	}
}