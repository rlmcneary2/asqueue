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

  // console.log("process: before task. ", item);
  await item.task();
  // console.log("process: after task. ", item);

  queue.delete(item);

  state.active = false;

  setTimeout(() => process(queue, state), 0);
}
