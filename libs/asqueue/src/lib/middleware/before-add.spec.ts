import {
  AddToQueueOptionsUniqueItem,
  AddToQueueResult,
  AddToQueueResultNotAdded
} from "../types";
import { create } from "../queue";
import { uniqueTask } from "./before-add";

describe("uniqueTask", () => {
  it("prevents duplicate items", () => {
    const q = create({ pause: true }).set("before-add", uniqueTask);

    const addOptions: AddToQueueOptionsUniqueItem = {
      uniqueTaskType: "UNIQUE"
    };
    const addResult1 = q.add(() => 1, addOptions) as AddToQueueResult<number>;

    expect(addResult1).toEqual({
      cancel: expect.any(Function),
      taskCompletion: expect.any(Promise)
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((q as any).queue.size).toBe(1);

    const addResult2 = q.add(() => 2, addOptions) as AddToQueueResultNotAdded;
    expect(addResult2).toEqual({ reason: "duplicate unique item" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((q as any).queue.size).toBe(1);
  });
});
