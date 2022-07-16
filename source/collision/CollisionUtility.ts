export class CollisionUtility
{
	private constructor() {}

	public static hitboxVerticallyAligned(topHitbox: Phaser.Geom.Rectangle, bottomHitbox: Phaser.Geom.Rectangle, margin: number = 0): boolean
	{
		if (bottomHitbox.top === topHitbox.bottom)
		{
			return topHitbox.right > bottomHitbox.left && topHitbox.left < bottomHitbox.right;
		}
		return false;
	}

	public static hitboxHorizontallyAligned(leftHitbox: Phaser.Geom.Rectangle, rightHitbox: Phaser.Geom.Rectangle, margin: number = 0): boolean
	{
		if (leftHitbox.right === rightHitbox.left)
		{
			return leftHitbox.bottom > rightHitbox.top && leftHitbox.top < rightHitbox.bottom;
		}
		return false;
	}

	public static hitboxesAligned(hitbox1: Phaser.Geom.Rectangle, hitbox2: Phaser.Geom.Rectangle): boolean
	{
		return this.hitboxVerticallyAligned(hitbox1, hitbox2) ||
				this.hitboxVerticallyAligned(hitbox2, hitbox1) ||
				this.hitboxHorizontallyAligned(hitbox1, hitbox2) ||
				this.hitboxHorizontallyAligned(hitbox2, hitbox1);
	}
}