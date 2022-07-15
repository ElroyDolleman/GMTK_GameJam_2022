import 'phaser';
import { GameScene } from './scenes/GameScene';

export const game = new Phaser.Game({
	type: Phaser.AUTO,
	width: 320,
	height: 240,
	zoom: 3,
	pixelArt: true,
	backgroundColor: '#333333',
	parent: 'GMTK Game Jam 2022',
	title: 'GMTK Game Jam 2022',
	version: '0.0.1',
	disableContextMenu: true,
	scene: [ GameScene ],
	// physics: {
	// 	default: 'arcade',
	// },
});