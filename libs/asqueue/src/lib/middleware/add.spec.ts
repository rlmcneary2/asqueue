import {
  AddToQueueOptions,
  AddToQueueOptionsPriorityItem,
  QueueTask
} from "../types";
import { insertPriorityTask } from "./add";

describe("insertPriorityTask", () => {
  it("inserts based on priority", () => {
    const options1: AddToQueueOptionsPriorityItem = { id: "1", priority: 1 };
    const options3: AddToQueueOptionsPriorityItem = { id: "3", priority: 3 };

    const queue = new Set<QueueTask>([
      { ...options1, task: jest.fn() },
      { ...options3, task: jest.fn() }
    ]);

    expect(queue.size).toBe(2);

    const options2: AddToQueueOptionsPriorityItem = { id: "2", priority: 2 };
    const nextQueue = insertPriorityTask(queue, jest.fn(), options2);

    expect(nextQueue.size).toBe(3);

    const arrNextQueue = [...nextQueue];
    expect(arrNextQueue[0].id).toBe("1");
    expect(arrNextQueue[1].id).toBe("2");
    expect(arrNextQueue[2].id).toBe("3");
  });

  it("inserts before no priority", () => {
    const options1: AddToQueueOptionsPriorityItem = { id: "1", priority: 1 };
    const options3: AddToQueueOptions = { id: "3" };

    const queue = new Set<QueueTask>([
      { ...options1, task: jest.fn() },
      { ...options3, task: jest.fn() }
    ]);

    expect(queue.size).toBe(2);

    const options2: AddToQueueOptionsPriorityItem = { id: "2", priority: 2 };
    const nextQueue = insertPriorityTask(queue, jest.fn(), options2);

    expect(nextQueue.size).toBe(3);

    const arrNextQueue = [...nextQueue];
    expect(arrNextQueue[0].id).toBe("1");
    expect(arrNextQueue[1].id).toBe("2");
    expect(arrNextQueue[2].id).toBe("3");
  });

  it("adds lowest priority to the end", () => {
    const options1: AddToQueueOptionsPriorityItem = { id: "1", priority: 1 };
    const options2: AddToQueueOptionsPriorityItem = { id: "2", priority: 2 };

    const queue = new Set<QueueTask>([
      { ...options1, task: jest.fn() },
      { ...options2, task: jest.fn() }
    ]);

    expect(queue.size).toBe(2);

    const options3: AddToQueueOptionsPriorityItem = { id: "3", priority: 3 };
    const nextQueue = insertPriorityTask(queue, jest.fn(), options3);

    expect(nextQueue.size).toBe(3);

    const arrNextQueue = [...nextQueue];
    expect(arrNextQueue[0].id).toBe("1");
    expect(arrNextQueue[1].id).toBe("2");
    expect(arrNextQueue[2].id).toBe("3");
  });

  it("adds highest priority to the beginning", () => {
    const options2: AddToQueueOptionsPriorityItem = { id: "2", priority: 2 };
    const options3: AddToQueueOptionsPriorityItem = { id: "3", priority: 3 };

    const queue = new Set<QueueTask>([
      { ...options2, task: jest.fn() },
      { ...options3, task: jest.fn() }
    ]);

    expect(queue.size).toBe(2);

    const options1: AddToQueueOptionsPriorityItem = { id: "1", priority: 1 };
    const nextQueue = insertPriorityTask(queue, jest.fn(), options1);

    expect(nextQueue.size).toBe(3);

    const arrNextQueue = [...nextQueue];
    expect(arrNextQueue[0].id).toBe("1");
    expect(arrNextQueue[1].id).toBe("2");
    expect(arrNextQueue[2].id).toBe("3");
  });

  it("adds no priority to the end", () => {
    const options1: AddToQueueOptionsPriorityItem = { id: "1", priority: 1 };
    const options2: AddToQueueOptions = { id: "2" };

    const queue = new Set<QueueTask>([
      { ...options1, task: jest.fn() },
      { ...options2, task: jest.fn() }
    ]);

    expect(queue.size).toBe(2);

    const options3: AddToQueueOptions = { id: "3" };
    const nextQueue = insertPriorityTask(queue, jest.fn(), options3);

    expect(nextQueue.size).toBe(3);

    const arrNextQueue = [...nextQueue];
    expect(arrNextQueue[0].id).toBe("1");
    expect(arrNextQueue[1].id).toBe("2");
    expect(arrNextQueue[2].id).toBe("3");
  });

  it("adds only priority to the beginning", () => {
    const options2: AddToQueueOptions = { id: "2" };
    const options3: AddToQueueOptions = { id: "3" };

    const queue = new Set<QueueTask>([
      { ...options2, task: jest.fn() },
      { ...options3, task: jest.fn() }
    ]);

    expect(queue.size).toBe(2);

    const options1: AddToQueueOptionsPriorityItem = { id: "1", priority: 0 };
    const nextQueue = insertPriorityTask(queue, jest.fn(), options1);

    expect(nextQueue.size).toBe(3);

    const arrNextQueue = [...nextQueue];
    expect(arrNextQueue[0].id).toBe("1");
    expect(arrNextQueue[1].id).toBe("2");
    expect(arrNextQueue[2].id).toBe("3");
  });
});
