"use strict";


describe("add a task", () => {

    let queue;
    it("should create a Queue", async () => {
        let success = true;
        queue = new asqueue.Queue();
        chai.expect(success).to.equal(true, "created a queue");
    });

    it("should return a promise when a task is added", async () => {
        let success = true;
        let task = {
            callback: async (t) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(new Date());
                    }, 500);
                });
            }
        }

        const p = await queue.add(task);
        chai.expect(p).to.instanceof(Date, "returned a Promise that resolved to a Date");
    });

});
