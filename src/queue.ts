

import { Task, QueueTask } from "./interfaces";

class Queue {

    constructor(
        private maxConcurrent = 1
    ) { }

    private activeTasks: QueueTask[] = [];
    private tasks: QueueTask[] = [];

    private async processTasks() {

        while (this.activeTasks.length < this.maxConcurrent && 0 < this.tasks.length) {
            const qt: QueueTask = this.tasks.splice(0, 1)[0];
            this.activeTasks.push(qt);

            await qt.callback();

            const index = this.activeTasks.findIndex(item => item.id === qt.id);
            this.activeTasks.splice(index, 1);
        }

    }

    /**
     * Add a task to the Queue.
     * @param {Task} task The task to be processed.
     * @returns {Promise<T>} A Promise that resolves to the result of the task.
     */
    public async add<T>(task: Task<T>): Promise<T> {
        return new Promise<any>((resolve, reject) => {
            const qt: QueueTask = {
                callback: async () => {
                    // Invoked when this task gets to the top of the queue.
                    try {
                        const result = await task.callback(task);
                        resolve(result);
                    } catch (err) {
                        reject(err);
                    }
                },
                id: performance.now(),
                task
            };

            this.tasks.push(qt);

            this.processTasks();
        });

    }

}

export default Queue;
