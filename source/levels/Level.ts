import { CollisionManager } from '../collision/CollisionManager';
import { ICollidable } from '../collision/ICollidable';
import { Entity } from '../entities/Entity';
import { TileMap } from './TileMap';

export class Level
{
	public readonly scene: Phaser.Scene;
	public readonly map: TileMap;
	public readonly collisionManager: CollisionManager;

	public readonly entities: Entity[];
	public readonly collidables: ICollidable[];

	public constructor(scene: Phaser.Scene, map: TileMap, entities: Entity[] = [], collidables: ICollidable[] = [])
	{
		this.map = map;
		this.scene = scene;
		this.entities = entities;
		this.collidables = collidables;
		this.collisionManager = new CollisionManager(this);
	}

	public update(): void
	{
		for (let i = 0; i < this.entities.length; i++)
		{
			this.entities[i].update();
		}
		for (let i = 0; i < this.collidables.length; i++)
		{
			this.collisionManager.moveCollidable(this.collidables[i]);
		}
		for (let i = 0; i < this.entities.length; i++)
		{
			this.entities[i].lateUpdate();
		}
	}

	public addCollidable(collidable: ICollidable): void
	{
		this.collidables.push(collidable);
	}
	public addEntity(entity: Entity): void
	{
		this.entities.push(entity);
	}

	public destroy(): void
	{
		this.map.destroy();

		for (let i = 0; i < this.entities.length; i++)
		{
			this.entities[i].destroy();
		}
		this.entities.splice(0, this.entities.length);
		this.collidables.splice(0, this.collidables.length);
	}
}