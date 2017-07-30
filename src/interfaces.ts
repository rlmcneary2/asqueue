

export interface QueueTask {
    callback: QueueTaskCallback;
    id: number;
    task: Task<any>;
}

export interface QueueTaskCallback {
    (): void;
}

export interface TaskCallback<T> {
    (task: Task<T>): Promise<T>;
}

export interface Task<T> {
    callback: TaskCallback<T>;
}
