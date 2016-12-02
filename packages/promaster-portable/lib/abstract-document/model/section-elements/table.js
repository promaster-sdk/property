"use strict";
function createTable(styleName, tableProperties, tableCellProperties, columnWidths, rows) {
    return {
        styleName: styleName,
        tableProperties: tableProperties,
        tableCellProperties: tableCellProperties,
        columnWidths: columnWidths,
        rows: rows,
    };
}
exports.createTable = createTable;
function nrOfRows(table) {
    return table.rows.length;
}
exports.nrOfRows = nrOfRows;
function nrOfColumns(table) {
    throw new Error("TODO: " + table);
}
exports.nrOfColumns = nrOfColumns;
//# sourceMappingURL=table.js.map