/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AddToQueueOptions {
  /** An ID to identify a task. */
  id?: string;
}

export interface AddToQueueOptionsUniqueItem extends AddToQueueOptions {
  uniqueTaskType: string;
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

export interface AddToQueueResultNotAdded {
  reason: string;
}

/**
 * These function will be invoked before a task is added to the queue.
 * @returns Undefined if the task should be added, otherwise a string reason
 * code if the task should NOT be added.
 */
export interface BeforeAddMiddleware extends Middleware {
  (queue: Set<QueueTask>, task: Task, options?: AddToQueueOptions):
    | string
    | undefined;
}

export interface CreateOptions {
  /** If set to true the queue will not begin processing tasks until the queue's
   * `pause` method is invoked with `true`. */
  pause?: boolean;
}

/**
 * These function will be invoked before a task is added to the queue.
 * @param queue The queue of tasks waiting to be processed.
 * @param task The task to add.
 * @param options Information about the task and its processing.
 */
export interface Middleware {
  (queue: Set<QueueTask>, task: Task, options?: AddToQueueOptions): void;
}

/**
 * A Queue accepts tasks and by default processes them sequentially in FIFO
 * order.
 *
 * Various middleware can be set on the queue that can affect the tasks that are
 * accepted for processing and the order in which the tasks are processed.
 */
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
  ) => AddToQueueResult<R> | AddToQueueResultNotAdded;

  /**
   * Toggles the state that prevents tasks from being processed.
   * @param pause When set to true tasks will NOT be processed (the queue is
   * paused). When false the processing of tasks will resume (the queue is NOT
   * paused).
   */
  pause: (pause: boolean) => void;

  /**
   * Set one or more middleware on the queue.
   */
  set: (name: keyof State["middleware"], ...middleware: Middleware[]) => Queue;
}

export interface QueueTask extends AddToQueueOptions {
  task: () => Promise<void>;
}

export interface State extends CreateOptions {
  active: boolean;
  middleware: {
    /**
     * This middleware will be invoked before a task is added to the queue and
     * can be used to control which tasks are added and which are not.
     * @see BeforeAddMiddleware
     */
    "before-add": BeforeAddMiddleware[];
  };
  pause: boolean;
  queue: Set<QueueTask>;
}

/** A synchronous function that executes the task. Note that a task can start an
 * asynchronous action, but it can not wai for that action to complete. */
export interface Task<R = unknown> {
  (): R;
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
