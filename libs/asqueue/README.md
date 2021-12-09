# asqueue

A queue to process tasks serially and be notified when the task has completed.

## install

```sh
yarn add asqueue
```

```sh
npm i asqueue
```

## use

### create the queue

Import the create function and use it to create a queue.

```ts
import { create } from "asqueue";

const queue = create();
```

There are some options available that effect the state of the queue. You can
start the queue "paused" so that it won't process any tasks that are added. To
begin processing tasks "unpause" the queue using the `pause` function.

```ts
const queue = create({ pause: true });
queue.add(() => console.log("The queue is paused."));
queue.pause(false);
```

### add a task

Tasks can be added to the queue. Each task must complete before the next task
starts.

```ts
const { cancel, taskCompletion } = queue.add(() =>
  console.log("This is a simple synchronous task.")
);
```

The `add` function returns a property named `taskCompletion` that is a Promise.
This Promise will resolve after the task has completed. You can await this
Promise when your code needs the task result before continuing.

```ts
const { taskCompletion } = queue.add(() =>
  calculatePiForOneMinuteUsingSetTimeout()
);
const { result } = await taskCompletion;
console.log(`Lots of PI. ${result}`);
```

The queue will also accept an async function. The `taskCompletion` Promise won't
resolve until the task has resolved.

```ts
const { cancel, taskCompletion } = queue.add(async () =>
  fetch(url);
);
```
