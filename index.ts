import Queue from "./src/queue";
import { Task, TaskCallback } from "./src/interfaces";
require("expose-loader?asqueue!./src/queue"); // Makes the Queue available off the global object in the namespace asqueue.


export { Queue, Task, TaskCallback };
