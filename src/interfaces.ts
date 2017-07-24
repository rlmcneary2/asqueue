

interface QueueTask<T> {
    callback: QueueTaskCallback;
    id: number;
    task: Task<T>;
}

interface QueueTaskCallback {
    (): void;
}

interface TaskCallback {
    <T>(task: Task<T>): Promise<T>;
}

interface Task<T> {
    callback: TaskCallback;
}

export { Task, TaskCallback, QueueTask };
