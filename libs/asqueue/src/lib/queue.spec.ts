/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "./queue";

describe("asqueue", () => {
  it("creates a queue", () => {
    const q = create();
    expect(q).toEqual({
      add: expect.any(Function),
      pause: expect.any(Function),
      queue: new Set()
    });
  });

  it("queues a task", () => {
    const q = create({ pause: true });

    const value = 1;
    const addResult = q.add(() => Promise.resolve(value), {
      id: "queues a task"
    });

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
    const { cancel, taskCompletion } = q.add(() => Promise.resolve(value), {
      id: "cancels a task"
    });

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

    const mock1 = jest.fn(() => Promise.resolve(1));
    const mock2 = jest.fn(() => Promise.resolve("two"));

    const addResults = [
      q.add(mock1, { id: "queues multiple tasks 1" }),
      q.add(mock2, { id: "queues multiple tasks 2" })
    ];

    expect((q as any).queue.size).toBe(2);

    q.pause(false);

    const results = await Promise.all(
      addResults.map(x => x.taskCompletion as Promise<any>)
    );

    expect(results[0]).toEqual({ result: 1, status: "complete" });
    expect(results[1]).toEqual({ result: "two", status: "complete" });
  });
});
