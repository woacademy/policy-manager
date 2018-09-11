/**
 * Simple trigger that runs automatically whenever a user changes the value of any cell in a spreadsheet.
 * @param  {Event} e GAS event object.
 */
function onEdit(e) {
  // Track changes to the F:F range.
  var notation = e.range.getA1Notation();
  if (/^F[0-9]+$/.test(notation) == false)
    return;

  // Set the background colour of the cell based on the tickbox state.
  if (e.value === "TRUE")
    e.range.setBackground("#74BB3A");
  else if (e.value === "FALSE")
    e.range.setBackground("#BB3A3A");
  else
    e.range.setBackground("#277E7E");
}

/**
 * Update the "Next (OAT) Review" column on all sheets within the active spreadsheet.
 */
function updateNextReviewColumn() {
  // Loop through each sheet within the active spreadsheet.
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  sheets.forEach(function(sheet) {
    // Calculate the amount of relevant cells containing a note (https://stackoverflow.com/a/17637159).
    var range = sheet.getRange("E2:E").getNotes();
    var last = range.filter(String).length + 1;

    for (var i = 2; i <= last; i++) {
      var cell = sheet.getRange("E" + i);
      var note = cell.getNote();

      // -1 represents a policy with an unknown or no review date.
      if (note === "-1") {
        cell.setValue("N/A");
        cell.setBackground("#277E7E");
        continue;
      }

      // Calculate the days remaining until the next (OAT) review (if negative calculate the overdue amount).
      var remaining = note - getUnixTime();
      if (remaining <= 0)
        remaining = -((getUnixTime() - note) / 86400).toFixed();
      else
        remaining = (remaining / 86400).toFixed();

      cell.setValue(Math.abs(remaining) + (remaining >= 0 ? " days until next review" : " days overdue"));

      // Use fixed values if the days remaining/overdue are outside of a certain range.
      if (remaining > 99)
        cell.setBackground("#74BB3A");
      else if (remaining < 0)
        cell.setBackground("#BB3A3A");
      else
        cell.setBackground(hsvToHex(interpolateHue(0.0, 93.0, 100)[remaining], 69.0, 73.3));
    }
  });
}
