# asqueue

A queue that processes tasks.

```ts
import { create } from "asqueue";

const queue = create();

const taskActions = queue.add(() => console.log("task 1"));
```
