import {
  AddToQueueOptions,
  TaskCompleteResult,
  CreateOptions,
  Queue,
  QueueTask,
  AddToQueueResult,
  TaskCancel,
  State,
  Task,
  TaskErrorResult,
  TaskCancelResult
} from "./types";
import { process } from "./process";

export function create(options?: CreateOptions): Readonly<Queue> {
  const queue = new Set<QueueTask>();
  const state: State = { active: false, pause: options?.pause === true };

  return Object.freeze({
    add: <R>(task: Task<R>, options?: AddToQueueOptions) =>
      add(queue, state, task, options),

    pause: pause => {
      if (pause) {
        state.pause = true;
        return;
      }

      state.pause = false;
      process(queue, state);
    },

    queue
  });
}

function add<R>(
  queue: Set<QueueTask>,
  state: State,
  task: Task<R>,
  options?: AddToQueueOptions
): AddToQueueResult<R> {
  // This is the initial `cancel` instance. This function instance might be
  // called in the small amount of time between when `add` returns and before
  // the cancel promise runs to set its own instance on `cancel`.
  let canceled = false;
  let cancelData: any;
  let cancel: TaskCancel = data => {
    canceled = true;
    cancelData = data;
  };

  // Create a cancel promise. If the task is canceled this promise will resolve.
  const cancelPromise = new Promise<TaskCancelResult>(resolve => {
    // If the initial `cancel` instance was invoked before this code runs then
    // just resolve the promise now.
    if (canceled) {
      resolve({
        status: "cancel",
        data: cancelData
      });

      return;
    }

    // The initial `cancel` instance was not invoked set the promise's version
    // of `cancel`.
    cancel = data => {
      canceled = true;

      resolve({
        status: "cancel",
        data
      });
    };
  });

  // The taskPromise will resolve when the task is completed, the task throws an
  // error, or the task has been canceled.
  const taskPromise = new Promise<
    TaskCancelResult | TaskCompleteResult<R> | TaskErrorResult
  >(resolve => {
    // This is the actual function that the queue will invoke. This wrapper
    // allows the queue to check to see if the task was canceled before and
    // after executing the task. It also allows the queue to catch any errors
    // that might happen in the provided task and continue with processing.
    const taskWrapper = async () => {
      if (canceled) {
        resolve({ status: "cancel", data: cancelData });
        return;
      }

      try {
        console.log(`taskWrapper[${options?.id}]: before task.`);
        const result = await task();
        console.log(`taskWrapper[${options?.id}]: task result=`, result);

        if (canceled) {
          resolve({ status: "cancel", data: cancelData });
          return;
        }

        resolve({ status: "complete", result });
      } catch (error) {
        resolve({ status: "error", error });
      }
    };

    queue.add({
      id: options?.id,
      task: taskWrapper
    });

    process(queue, state);
  });

  const taskCompletion = Promise.race([cancelPromise, taskPromise]);

  return {
    cancel,
    taskCompletion
  };
}
