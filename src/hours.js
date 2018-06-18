"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const min = (a, b) => a < b ? a : b;
const sum = (a, b) => a + b;
function payBlocksForDay(daysHours, context) {
    let consecutiveDays = daysHours === 0 ? 0 : context.consecutiveDays + 1;
    let weeksNonOvertimeHours = context.weeksNonOvertimeHours;
    let breakdown = [];
    if (consecutiveDays === 7) {
        if (daysHours > 8)
            breakdown.push({ hours: daysHours - 8, reason: 'More than 8 hours on the 7th consecutive day in a workweek', rate: 2 });
        breakdown.push({ hours: min(daysHours, 8), reason: '7th consecutive day in a workweek', rate: 1.5 });
    }
    else {
        let allocatedHours = 0;
        if (daysHours > 12) {
            breakdown.push({ hours: daysHours - 12, reason: 'More than 12 hours in a workday', rate: 2 });
            allocatedHours += daysHours - 12;
        }
        if (daysHours > 8) {
            breakdown.push({ hours: min(daysHours - 8, 4), reason: 'More than 8 hours in a day', rate: 1.5 });
            allocatedHours += min(daysHours - 8, 4);
        }
        if ((context.weeksNonOvertimeHours + daysHours - allocatedHours) > 40) {
            breakdown.push({ hours: min(context.weeksNonOvertimeHours + daysHours - allocatedHours - 40, daysHours), reason: 'More then 40 non-overtime hours in a workweek', rate: 1.5 });
            allocatedHours += min(context.weeksNonOvertimeHours + daysHours - allocatedHours - 40, daysHours);
        }
        if (daysHours - allocatedHours > 0) {
            breakdown.push({ hours: daysHours - allocatedHours, reason: 'Normal', rate: 1 });
            weeksNonOvertimeHours += daysHours - allocatedHours;
        }
        else if (breakdown.length === 0) {
            breakdown.push({ hours: 0, reason: 'Normal', rate: 1 });
        }
    }
    return {
        breakdown: breakdown,
        newContext: {
            consecutiveDays: consecutiveDays,
            weeksNonOvertimeHours: weeksNonOvertimeHours
        }
    };
}
function PayWithReason(hours) {
    let weeksNonOvertimeHours = { weeksNonOvertimeHours: 0, consecutiveDays: 0 };
    let breakdown = [];
    hours.forEach(entry => {
        let day = payBlocksForDay(entry, weeksNonOvertimeHours);
        weeksNonOvertimeHours = day.newContext;
        breakdown.push(day.breakdown);
    });
    return breakdown;
}
exports.PayWithReason = PayWithReason;
let payBlocksToString = (blocks) => blocks.map(block => `${block.hours} hours @ ${block.rate}x because ${block.reason}`).join(' | ');
const AllHoursInit = {
    1: 0,
    1.5: 0,
    2: 0
};
function TotalEffectiveHours(hours, verbose = false) {
    if (verbose)
        console.table(PayWithReason(hours).map(payBlocksToString));
    const reducer = (a, b) => {
        return {
            1: a[1] || 0 + b[1] || 0,
            1.5: a[1.5] || 0 + b[1.5] || 0,
            2: a[2] || 0 + b[2] || 0
        };
    };
    return PayWithReason(hours)
        .map(dayBlocks => dayBlocks
        .map(block => ({ [block.rate]: block.hours }))
        .reduce(reducer, AllHoursInit))
        .reduce(reducer, AllHoursInit);
}
exports.TotalEffectiveHours = TotalEffectiveHours;
//# sourceMappingURL=hours.js.map