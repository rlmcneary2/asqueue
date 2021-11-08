import { AddToQueueOptions, QueueTask } from "../types";
import { isAddToQueueOptionsPriorityItem } from "../type-guards";

export function insertPriorityTask(
  queue: Set<QueueTask>,
  taskWrapper: () => Promise<void>,
  options?: AddToQueueOptions
) {
  if (!isAddToQueueOptionsPriorityItem(options)) {
    queue.add({ ...options, task: taskWrapper });
    return queue;
  }

  const arrQueue = [...queue];

  const index = arrQueue.findIndex(item => {
    if (!isAddToQueueOptionsPriorityItem(item)) {
      return true;
    }

    return options.priority < item.priority;
  });

  let nextQueue: Set<QueueTask>;
  if (index < 0) {
    queue.add({ ...options, task: taskWrapper });
    nextQueue = queue;
  } else {
    arrQueue.splice(index, 0, { ...options, task: taskWrapper });
    nextQueue = new Set(arrQueue);
  }

  return nextQueue;
}
