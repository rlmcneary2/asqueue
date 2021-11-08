import { QueueTask, State } from "./types";

export async function process(queue: Set<QueueTask>, state: State) {
  if (state.active || state.pause) {
    // console.log("process: inactive. ", state);
    return;
  }

  if (!queue.size) {
    // console.log("process: queue empty. ", state);
    state.active = false;
    return;
  }

  state.active = true;
  // console.log("process: begin. ", state);

  const item: QueueTask = queue.values().next().value;
  queue.delete(item);

  // console.log("process: processing task. ", item);

  await item.task();

  state.active = false;

  setTimeout(() => process(queue, state), 0);
}
