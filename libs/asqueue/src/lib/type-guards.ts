import {
  AddToQueueOptions,
  AddToQueueOptionsUniqueItem,
  AddToQueueResult,
  AddToQueueResultNotAdded
} from "./types";

export function isAddToQueueOptionsUniqueItem(
  addToQueueOptions?: AddToQueueOptions
): addToQueueOptions is AddToQueueOptionsUniqueItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(addToQueueOptions as any)?.uniqueTaskType;
}

export function isAddToQueueResult(
  result: AddToQueueResult<unknown> | AddToQueueResultNotAdded
): result is AddToQueueResult<unknown> {
  // const record = result as unknown as Record<string, unknown>;
  // return !!record["taskCompletion"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(result as any)?.taskCompletion;
}
