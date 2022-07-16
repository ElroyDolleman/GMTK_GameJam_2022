export class TimeDelay
{
	private constructor() {}

	public static after(milliseconds: number): Promise<void>
	{
		return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
	}
}