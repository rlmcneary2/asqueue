/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AddMiddleware extends Omit<Middleware, "task"> {
  (
    queue: Set<QueueTask>,
    taskWrapper: () => Promise<void>,
    options?: AddToQueueOptions
  ): Set<QueueTask>;
}

export interface AddToQueueOptions {
  /** An ID to identify a task. */
  id?: string;
}

/** Assign a priority to a task that will affect its location in the queue. Only
 * taken into account if the AddMiddleware `insertPriorityTask` or similar has
 * been provided.  */
export interface AddToQueueOptionsPriorityItem extends AddToQueueOptions {
  /**
   * The priority of the task, lower values are higher priority. For example all
   * priority = 1 tasks will be processed before priority = 5 tasks.
   */
  priority: number;
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

/** An asynchronous function that executes the task. The queue will wait for
 * this task to resolve. */
export interface AsyncTask<R = unknown> {
  (): Promise<R>;
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
    task: AsyncTask<R> | Task<R>,
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
  set: QueueSet;
}

export interface QueueSet {
  (name: "add", middleware: AddMiddleware): Queue;
  (name: "before-add", ...middleware: Middleware[]): Queue;
}

export interface QueueTask extends AddToQueueOptions {
  task: () => Promise<void>;
}

export interface State extends CreateOptions {
  active: boolean;
  middleware: {
    add: AddMiddleware | null;
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
 * asynchronous action, but it can not wait for that action to complete. */
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
  result: R;
  status: "complete";
}

export interface TaskErrorResult extends TaskResult {
  error: any;
  status: "error";
}

export interface TaskResult {
  status: "cancel" | "complete" | "error";
}
