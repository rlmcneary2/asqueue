import { AddToQueueOptions, QueueTask, Task } from "../types";
import { isAddToQueueOptionsUniqueItem } from "../type-guards";

/**
 * Prevents more than one instance of a task with a specified unique type, from
 * being being in the queue at the same time. Implements the Middleware
 * interface.
 * @see Middleware
 * @param queue The current queue of tasks.
 * @param task The task that might be added to the queue.
 * @param options The options provided with the task.
 * @returns A string if the task is a duplicate.
 */
export function uniqueTask(
  queue: Set<QueueTask>,
  task: Task,
  options?: AddToQueueOptions
) {
  if (!isAddToQueueOptionsUniqueItem(options)) {
    return;
  }

  if (
    [...queue].some(item => {
      if (isAddToQueueOptionsUniqueItem(item)) {
        return item.uniqueTaskType === options.uniqueTaskType;
      }

      return false;
    })
  ) {
    return "duplicate unique item";
  }

  return;
}
