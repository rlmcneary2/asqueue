

import { Task, QueueTask } from "./interfaces";

class Queue {

    constructor(
        private maxConcurrent: number = 1
    ) { }

    private activeTasks: QueueTask<any>[] = [];
    private tasks: QueueTask<any>[] = [];

    private async processTasks() {

        while (this.activeTasks.length < this.maxConcurrent && 0 < this.tasks.length) {
            const qt: QueueTask<any> = this.tasks.splice(0, 1)[0];
            this.activeTasks.push(qt);

            await qt.callback();

            const index = this.activeTasks.findIndex(item => item.id === qt.id);
            this.activeTasks.splice(index, 1);
        }

    }

    public async add<T>(task: Task<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const qt: QueueTask<T> = {
                callback: async () => {
                    // Invoked when this task gets to the top of the queue.
                    try {
                        const result = await task.callback(task);
                        resolve(result as T);
                    } catch (err) {
                        reject(err);
                    }
                },
                id: performance.now(),
                task
            }

            this.tasks.push(qt);

            this.processTasks();
        });

    }

}

export default Queue;
