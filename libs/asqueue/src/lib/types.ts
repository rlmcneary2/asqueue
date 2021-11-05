export interface AddOptions {
  id?: string;
}

export interface CreateOptions {
  before?: () => void;
  pause?: boolean;
}

export interface Queue {
  add: <T, C = unknown>(task: Task, options?: AddOptions) => Result<T, C>;
  pause: (pause: boolean) => void;
}

export interface QueueTask {
  id?: string;
  task: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Result<T, C = undefined> {
  cancel: ResultCancel;
  wait: Promise<T | WaitCancel<C> | void>;
}

export interface ResultCancel {
  (): void;
  <C>(data: C): void;
}

export interface State {
  active: boolean;
  pause: boolean;
}

// export type Task = () => Promise<void>;
// export type Task<T> = Task & (() => Promise<T>);

// export interface Task<T> extends Task {
//   (): Promise<T>;
// }
export interface Task {
  // <T>(): Promise<T>;
  <T>(): Promise<T>;
  // (): Promise<void>;
}

export type Task2 = <T>() => Promise<T>;

export interface WaitCancel<C = undefined> {
  cancelled: boolean;
  data: C;
}
