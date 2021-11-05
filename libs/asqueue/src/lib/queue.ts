import {
  AddOptions,
  CreateOptions,
  Queue,
  QueueTask,
  Result,
  ResultCancel,
  State,
  Task,
  WaitCancel
} from "./types";
import { process } from "./process";

// export function create(options?: CreateOptions): Readonly<Queue> {
//   const queue = new Set<QueueTask>();
//   const state: State = { active: false, pause: options?.pause === true };

//   return Object.freeze({
//     add: <T>(task: Task<T>, options?: AddOptions) =>
//       add(queue, state, task, options),
//     pause: pause => {
//       if (pause) {
//         state.pause = true;
//         return;
//       }

//       state.pause = false;
//       process(queue, state);
//     },
//     queue
//   });
// }
export function create(options?: CreateOptions): Readonly<Queue> {
  const queue = new Set<QueueTask>();
  const state: State = { active: false, pause: options?.pause === true };

  const addFunc: Queue["add"] = (task: Task, options?: AddOptions) =>
    add(queue, state, task, options);

  return Object.freeze({
    add: addFunc,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function add<T, C = any>(
//   queue: Set<QueueTask>,
//   state: State,
//   task: Task,
//   options?: AddOptions
// ): Result<T, C> {
//   let resolveTask: (value?: T | WaitCancel<C>) => void;
//   const wait = new Promise<T | WaitCancel<C>>(resolve => {
//     resolveTask = resolve;
//   });

//   let cancelData: C | boolean;
//   let completed = false;
//   function cancel(data: C) {
//     console.log(`cancel: completed=${completed}`);
//     cancelData = data ?? true;
//     resolveTask({ cancelled: !completed, data });
//   }

//   const taskWrapper = async () => {
//     if (cancelData) {
//       return;
//     }

//     const result = await task();
//     completed = true;

//     if (cancelData) {
//       return;
//     }

//     console.log(`taskWrapper[${options?.id}]: result=`, result);
//     resolveTask(result);
//   };

//   const queueTask: QueueTask = {
//     id: options?.id,
//     task: taskWrapper
//   };

//   queue.add(queueTask);

//   process(queue, state);

//   return {
//     cancel,
//     wait
//   };
// }
function add<T, C>(
  queue: Set<QueueTask>,
  state: State,
  task: Task,
  options?: AddOptions
): Result<T, C> {
  let cancelData: C | boolean;
  let completed = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let cancel: ResultCancel = () => {};
  const cancelPromise = new Promise<WaitCancel<C>>(resolve => {
    cancel = (data?: C) => {
      console.log(`cancel: completed=${completed}`);
      cancelData = data ?? true;
      resolve({ cancelled: !completed, data: data as C });
    };
  });

  const taskPromise = new Promise<T | void>(resolve => {
    const taskWrapper = async () => {
      if (cancelData) {
        return;
      }

      const result = await task();
      completed = true;

      if (cancelData) {
        return;
      }

      console.log(`taskWrapper[${options?.id}]: result=`, result);
      resolve(result as T);
    };

    const queueTask: QueueTask = {
      id: options?.id,
      task: taskWrapper
    };

    queue.add(queueTask);

    process(queue, state);
  });

  return {
    cancel,
    wait: Promise.race([cancelPromise, taskPromise])
  };
}
