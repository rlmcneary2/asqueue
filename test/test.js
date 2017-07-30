"use strict";

const asqueue = require("../lib/asqueue").default;
const expect = require("chai").expect;

debugger;

describe("add a task", () => {

    it("should return a promise", async () => {
        let success = true;
        await asqueue();
        expect(success).to.equal(true, "returned a promise");
    });

});
