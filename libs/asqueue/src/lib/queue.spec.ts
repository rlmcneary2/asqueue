/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AddMiddleware,
  AddToQueueOptionsPriorityItem,
  AddToQueueResult
} from "./types";
import { create } from "./queue";
import { insertPriorityTask } from "./middleware/add";

describe("asqueue", () => {
  it("creates a queue", () => {
    const q = create();
    expect(q).toEqual({
      add: expect.any(Function),
      pause: expect.any(Function),
      set: expect.any(Function)
    });
  });

  it("queues a task", () => {
    const q = create({ pause: true });

    const value = 1;
    const addResult = q.add(() => value, {
      id: "queues a task"
    }) as AddToQueueResult<typeof value>;

    expect(addResult).toEqual({
      cancel: expect.any(Function),
      taskCompletion: expect.any(Promise)
    });

    expect((q as any).queue.size).toBe(1);

    q.pause(false);

    const { taskCompletion } = addResult;
    return expect(taskCompletion).resolves.toEqual({
      result: value,
      status: "complete"
    });
  });

  it("cancels a task", () => {
    const q = create({ pause: true });

    const value = "foo";
    const { cancel, taskCompletion } = q.add(() => value, {
      id: "cancels a task"
    }) as AddToQueueResult<typeof value>;

    const data = Date.now();

    const promise = expect(taskCompletion).resolves.toEqual({
      data,
      status: "cancel"
    });

    cancel(data);

    return promise;
  });

  it("queues multiple tasks", async () => {
    const q = create({ pause: true });

    const mock1 = jest.fn(() => 1);
    const mock2 = jest.fn(() => "two");

    const addResults = [
      q.add(mock1, {
        id: "queues multiple tasks 1"
      }) as AddToQueueResult<number>,
      q.add(mock2, {
        id: "queues multiple tasks 2"
      }) as AddToQueueResult<string>
    ];

    expect((q as any).queue.size).toBe(2);

    q.pause(false);

    const results = await Promise.all(
      addResults.map(x => x.taskCompletion as Promise<any>)
    );

    expect(results[0]).toEqual({ result: 1, status: "complete" });
    expect(results[1]).toEqual({ result: "two", status: "complete" });
  });

  it("updates the queue with AddMiddleware", async () => {
    const middleware: AddMiddleware = insertPriorityTask;
    const q = create({ pause: true }).set("add", middleware);

    q.add(jest.fn(), { id: "1", priority: 1 } as AddToQueueOptionsPriorityItem);
    q.add(jest.fn(), { id: "3", priority: 3 } as AddToQueueOptionsPriorityItem);
    expect((q as any).queue.size).toBe(2);

    q.add(jest.fn(), { id: "2", priority: 2 } as AddToQueueOptionsPriorityItem);
    expect((q as any).queue.size).toBe(3);
    expect([...(q as any).queue]).toEqual([
      expect.objectContaining({ id: "1" }),
      expect.objectContaining({ id: "2" }),
      expect.objectContaining({ id: "3" })
    ]);
  });
});
