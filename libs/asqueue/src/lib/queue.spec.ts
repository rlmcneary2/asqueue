/* eslint-disable @typescript-eslint/no-explicit-any */
import { Queue, Task, Task2 } from "./types";
import { create } from "./queue";

describe("asqueue", () => {
  it("should create", () => {
    const q = create();
    expect(q).toEqual({
      add: expect.any(Function),
      pause: expect.any(Function),
      queue: new Set()
    });
  });

  it("queues a task", async () => {
    const q = create({ pause: true });

    const result = q.add<number>(createTask("queues a task"), {
      id: "queues a task"
    });

    expect(result).toEqual({
      cancel: expect.any(Function),
      wait: expect.any(Promise)
    });

    expect((q as any).queue.size).toBe(1);

    q.pause(false);

    await result.wait;
  });

  it("cancels a task", () => {
    const q = create({ pause: true });

    const task: Task2 = () => Promise.resolve("foo");

    const { cancel, wait } = q.add<number, number>(
      createTask("cancels a task"),
      {
        id: "cancels a task"
      }
    );

    const data = Date.now();
    const promise = expect(wait).resolves.toEqual({
      cancelled: true,
      data
    });

    cancel(data);

    return promise;
  });

  it.only("queues multiple tasks", async () => {
    const q = create({ pause: true });

    // const mock1 = jest.fn(createTask("queues a task 1", 100));
    // const mock2 = jest.fn(createTask("queues a task 2", 100));

    const mock1: Task = () => Promise.resolve(1);
    const mock2 = jest.fn(createTask("queues a task 2", 100));

    const results = [
      q.add(mock1, { id: "queues a task 1" }),
      q.add(mock2, { id: "queues a task 2" })
    ];

    // expect(results).toEqual({
    //   cancel: expect.any(Function),
    //   wait: expect.any(Promise)
    // });

    // expect((q as any).queue.size).toBe(1);

    q.pause(false);

    await Promise.all(results.map(x => x.wait));

    expect(mock1).toHaveBeenCalledWith("foo");

    // await result.wait;
  });
});

function createTask(id: string | number, delay = 0): Task {
  return () =>
    new Promise(resolve => {
      console.log(`Task[${id}] start`);
      setTimeout(() => {
        console.log(`Task[${id}] end value=${delay}`);
        resolve(delay);
      }, delay);
    });
}
