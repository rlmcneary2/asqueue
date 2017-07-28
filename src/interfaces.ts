

interface QueueTask {
    callback: QueueTaskCallback;
    id: number;
    task: Task;
}

interface QueueTaskCallback {
    (): void;
}

interface TaskCallback {
    <T>(task: Task): Promise<T>;
}

interface Task {
    callback: TaskCallback;
}

export { Task, TaskCallback, QueueTask };
