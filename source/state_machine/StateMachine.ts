import { IBaseState } from './IBaseState';

export class StateMachine<T>
{
	public get currentState(): IBaseState<T> { return this.states.get(this.currentStateKey) as IBaseState<T>; }

	private states: Map<number, IBaseState<T>>;
	public currentStateKey: number = -1;

	public owner: T;

	protected onStateChanged: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();

	public constructor(owner: T)
	{
		this.owner = owner;
		this.states = new Map();
	}

	public start(firstState: number): void
	{
		this.currentStateKey = firstState;
	}

	public update(): void
	{
		this.currentState.update();
	}

	public addState(key: number, state: IBaseState<T>): void
	{
		state.machine = this;
		this.states.set(key, state);
	}

	public changeState(key: number): void
	{
		this.currentState.leave();
		this.currentStateKey = key;
		this.currentState.enter();

		this.onStateChanged.emit('state-changed', key);
	}

	public addStateChangedListener(event: (state: number) => void, scope?: any): void
	{
		this.onStateChanged.addListener('state-changed', event, scope);
	}

	public destroy(): void
	{
		this.onStateChanged.destroy();
		this.states.clear();
	}
}