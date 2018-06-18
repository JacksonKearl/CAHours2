"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hours_1 = require("./hours");
const $ = (id) => document.getElementById(id);
window.onload = () => {
    doSubmit();
    for (let day = 1; day <= 7; day++) {
        let input = $('day' + day);
        input.onchange = doSubmit;
    }
};
let payBlocksToString = (blocks) => blocks.map(block => `${block.hours} hours @ ${block.rate}x: ${block.reason}`).join(' | ');
function readInputs() {
    let hours = [0, 0, 0, 0, 0, 0, 0];
    for (let day = 1; day <= 7; day++) {
        let input = $('day' + day);
        if (input.value)
            hours[day - 1] = parseFloat(input.value);
    }
    return hours;
}
function doSubmit() {
    let hours = readInputs();
    let rate = parseFloat($('rate').value) || 0;
    $('response').style.display = "block";
    let allHours = hours_1.TotalEffectiveHours(hours);
    $('hoursspan1').textContent = `${allHours[1]} ($${allHours[1] * 1 * rate})`;
    $('hoursspan1.5').textContent = `${allHours[1.5]} ($${allHours[1.5] * 1.5 * rate})`;
    $('hoursspan2').textContent = `${allHours[2]} ($${allHours[2] * 2 * rate})`;
    const effectiveHours = allHours[1] * 1 + allHours[1.5] * 1.5 + allHours[2] * 2;
    $('hoursspaneff').textContent = `${effectiveHours} ($${effectiveHours * rate})`;
    renderTable(hours_1.PayWithReason(hours));
}
function renderTable(data) {
    const labels = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
    const renderHeader = (table) => {
        let header = document.createElement('tr');
        let day = document.createElement('th');
        day.innerText = 'Day';
        header.appendChild(day);
        let hours = document.createElement('th');
        hours.innerText = 'Hours';
        header.appendChild(hours);
        let rate = document.createElement('th');
        rate.innerText = 'Rate';
        header.appendChild(rate);
        let reason = document.createElement('th');
        reason.innerText = 'Reason';
        header.appendChild(reason);
        table.appendChild(header);
    };
    const renderLine = (table, label, data) => {
        for (let i = data.length - 1; i >= 0; i--) {
            let row = document.createElement('tr');
            let day = document.createElement('td');
            day.innerText = i === data.length - 1 ? label : '';
            row.appendChild(day);
            let hours = document.createElement('td');
            hours.innerText = '' + data[i].hours;
            row.appendChild(hours);
            let rate = document.createElement('td');
            rate.innerText = '' + data[i].rate;
            row.appendChild(rate);
            let reason = document.createElement('td');
            reason.innerText = '' + data[i].reason;
            row.appendChild(reason);
            table.appendChild(row);
        }
    };
    $('description-table').innerHTML = '';
    let table = $('description-table').appendChild(document.createElement('table'));
    renderHeader(table);
    for (let i = 0; i < 7; i++) {
        renderLine(table, labels[i], data[i]);
        let sep = document.createElement('tr');
        sep.id = 'sep';
        table.appendChild(sep);
    }
    table.innerHTML += '</table>';
}
//# sourceMappingURL=main.js.map