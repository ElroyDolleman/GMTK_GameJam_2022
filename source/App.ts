import 'phaser';
import { GameScene } from './scenes/GameScene';

export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;
export const CHUNKS_X = 20;
export const CHUNKS_Y = 15;

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