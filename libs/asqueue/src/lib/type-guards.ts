import {
  AddToQueueOptions,
  AddToQueueOptionsPriorityItem,
  AddToQueueOptionsUniqueItem,
  AddToQueueResult,
  AddToQueueResultNotAdded
} from "./types";

export function isAddToQueueOptionsPriorityItem(
  addToQueueOptions?: AddToQueueOptions
): addToQueueOptions is AddToQueueOptionsPriorityItem {
  return (
    typeof (addToQueueOptions as Record<string, unknown>)?.priority === "number"
  );
}

export function isAddToQueueOptionsUniqueItem(
  addToQueueOptions?: AddToQueueOptions
): addToQueueOptions is AddToQueueOptionsUniqueItem {
  return !!(addToQueueOptions as Record<string, unknown>)?.uniqueTaskType;
}

export function isAddToQueueResult(
  result: AddToQueueResult<unknown> | AddToQueueResultNotAdded
): result is AddToQueueResult<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(result as any)?.taskCompletion;
}
