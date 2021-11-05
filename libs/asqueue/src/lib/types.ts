/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AddToQueueOptions {
  id?: string;
}

/**
 * Returned when a task is added to the queue.
 * @template R The type of the queued task's result.
 */
export interface AddToQueueResult<R> {
  cancel: TaskCancel;

  /** A promise that resolves once the task has: been canceled, completed or
   * thrown an exception. */
  taskCompletion: Promise<
    TaskCancelResult | TaskCompleteResult<R> | TaskErrorResult
  >;
}

export interface CreateOptions {
  before?: () => void;
  pause?: boolean;
}

export interface Queue {
  /**
   * Add a task to the queue.
   * @param task The task to invoke.
   * @param options Information about the task and its processing.
   * @returns An AddToQueueResult instance with properties and functions to
   * alter the task and wait for completion.
   */
  add: <R = unknown>(
    task: Task<R>,
    options?: AddToQueueOptions
  ) => AddToQueueResult<R>;

  pause: (pause: boolean) => void;
}

export interface QueueTask {
  id?: string;
  task: () => Promise<void>;
}

export interface State {
  active: boolean;
  pause: boolean;
}

export interface Task<R = unknown> {
  (): Promise<R>;
}

export interface TaskCancel {
  (data?: any): void;
}

export interface TaskCancelResult extends TaskResult {
  data: any;
  status: "cancel";
}

export interface TaskCompleteResult<R> extends TaskResult {
  status: "complete";
  result: R;
}

export interface TaskErrorResult extends TaskResult {
  error: any;
  status: "error";
}

export interface TaskResult {
  status: "cancel" | "complete" | "error";
}
