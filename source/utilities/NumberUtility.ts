export class NumberUtility
{
	private constructor() {}

	/**
	 * Returns an integer that indicates the sign of a number.
	 */
	public static sign(value: number): number
	{
		return value === 0 ? 0 : value > 0 ? 1 : -1;
	}

	public static lerp(start: number, stop: number, amount: number): number
	{
		if (amount > 1) { amount = 1; }
		else if (amount < 0) { amount = 0; }
		return start + (stop - start) * amount;
	}
}