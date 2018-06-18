"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hours_1 = require("../src/hours");
const chai_1 = require("chai");
require("mocha");
describe('TotalEffectiveHours', () => {
    it('should return 0 for 0 input', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([0, 0, 0, 0, 0, 0, 0])).to.equal(0);
    });
    it('should return sum of hours when no overtime', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([4, 4, 6, 8, .2, 0.89, 0])).to.equal(4 + 4 + 6 + 8 + .2 + 0.89 + 0);
    });
    it('should count hours past 8 as time half', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([10, 0, 10, 0, 10, 0, 10])).to.equal(44);
    });
    it('should count hours past 12 as double time', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([14, 0, 14, 0, 0, 0, 0])).to.equal(2 * (8 * 1 + 4 * 1.5 + 2 * 2));
    });
    it('should count hours past 40 in week as time half', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([8, 8, 8, 8, 8, 8, 0])).to.equal(5 * 8 + 1.5 * 8);
    });
    it('should count hours in 7th consecutive day as time half', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([1, 1, 1, 1, 1, 1, 2])).to.equal(6 + 1.5 * 2);
    });
    it('should count hours in 7th consecutive day past 8 as double', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([1, 1, 1, 1, 1, 1, 10])).to.equal(6 + 1.5 * 8 + 2 * 2);
    });
    it('should not special count 7th day hours when not 7th consecutive days', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([1, 1, 0, 1, 1, 1, 10])).to.equal(5 + 1 * 8 + 1.5 * 2);
    });
    it('should only count non overtime hours when accumulating for 40 hours', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([20, 20, 0, 0, 5, 0, 0])).to.equal(2 * (1 * 8 + 1.5 * 4 + 2 * 8) + 5);
    });
    it('should correctly identify passing 40 hours when fractional hours are used', () => {
        chai_1.expect(hours_1.TotalEffectiveHours([7.23, 7.23, 7.23, 7.23, 7.23, 8, 0])).to.equal(7.23 * 5 + 3.85 + 4.15 * 1.5);
    });
});
//# sourceMappingURL=test.js.map