const min: <T>(a: T, b: T) => T = (a, b) => a < b ? a : b;
const sum = (a: number, b: number) => a + b;

type HourEntry = number;
type PaymentContext = {
    weeksNonOvertimeHours: number;
    consecutiveDays: number;

};

export type PayBlock = {
    hours: number;
    reason: string;
    rate: number;
}
type PayAmountBreakdown = PayBlock[]

function payBlocksForDay(daysHours: HourEntry, context: PaymentContext): { breakdown: PayAmountBreakdown, newContext: PaymentContext } {
    let consecutiveDays = daysHours === 0 ? 0 : context.consecutiveDays + 1
    let weeksNonOvertimeHours = context.weeksNonOvertimeHours;

    let breakdown: PayAmountBreakdown = [];
    if (consecutiveDays === 7) {
        if (daysHours > 8)
            breakdown.push({ hours: daysHours - 8, reason: 'More than 8 hours on the 7th consecutive day in a workweek', rate: 2 })

        breakdown.push({ hours: min(daysHours, 8), reason: '7th consecutive day in a workweek', rate: 1.5 })

    } else {
        let allocatedHours = 0;
        if (daysHours > 12) {
            breakdown.push({ hours: daysHours - 12, reason: 'More than 12 hours in a workday', rate: 2 })
            allocatedHours += daysHours - 12;
        }

        if (daysHours > 8) {
            breakdown.push({ hours: min(daysHours - 8, 4), reason: 'More than 8 hours in a day', rate: 1.5 })
            allocatedHours += min(daysHours - 8, 4);
        }

        if ((context.weeksNonOvertimeHours + daysHours - allocatedHours) > 40) {
            breakdown.push({ hours: min(context.weeksNonOvertimeHours + daysHours - allocatedHours - 40, daysHours), reason: 'More then 40 non-overtime hours in a workweek', rate: 1.5 })
            allocatedHours += min(context.weeksNonOvertimeHours + daysHours - allocatedHours - 40, daysHours);
        }

        if (daysHours - allocatedHours > 0) {
            breakdown.push({ hours: daysHours - allocatedHours, reason: 'Normal', rate: 1 })
            weeksNonOvertimeHours += daysHours - allocatedHours;
        } else if (breakdown.length === 0) {
            breakdown.push({ hours: 0, reason: 'Normal', rate: 1 })
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

export function PayWithReason(hours: HourEntry[]): PayAmountBreakdown[] {
    let weeksNonOvertimeHours: PaymentContext = { weeksNonOvertimeHours: 0, consecutiveDays: 0 };
    let breakdown: PayAmountBreakdown[] = [];
    hours.forEach(entry => {
        let day = payBlocksForDay(entry, weeksNonOvertimeHours);
        weeksNonOvertimeHours = day.newContext;
        breakdown.push(day.breakdown);
    });
    return breakdown;
}

let payBlocksToString = (blocks: PayBlock[]): string =>
    blocks.map(block => `${block.hours} hours @ ${block.rate}x because ${block.reason}`).join(' | ');

export function TotalEffectiveHours(hours: HourEntry[], verbose: boolean = false): number {
    if (verbose) console.table(PayWithReason(hours).map(payBlocksToString));

    return PayWithReason(hours)
        .map(dayBlocks =>
            dayBlocks
                .map(block => block.hours * block.rate)
                .reduce(sum, 0))
        .reduce(sum, 0);
}
