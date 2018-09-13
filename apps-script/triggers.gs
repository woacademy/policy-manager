/**
 * Simple trigger that runs automatically whenever a user changes the value of any cell in a spreadsheet.
 * @param  {Event} e GAS event object.
 */
function onEdit(e) {
  // Track changes to the F:F range.
  var notation = e.range.getA1Notation();
  if (new RegExp("^" + settings["columns"]["compliant"] + "[0-9]+$").test(notation) == false) {
    return;
  }

  // Set the background colour of the cell based on the tickbox state.
  if (e.value === "TRUE") {
    e.range.setBackground(hsvToHex(
      settings["colours"]["hues"]["high"],
      settings["colours"]["saturation"],
      settings["colours"]["value"]
    ));
  } else if (e.value === "FALSE") {
    e.range.setBackground(hsvToHex(
      settings["colours"]["hues"]["low"],
      settings["colours"]["saturation"],
      settings["colours"]["value"]
    ));
  } else {
    e.range.setBackground(hsvToHex(
      settings["colours"]["hues"]["other"],
      settings["colours"]["saturation"],
      settings["colours"]["value"]
    ));
  }
}

/**
 * Update the "Next (OAT) Review" column on all sheets within the active spreadsheet.
 */
function updateNextReviewColumn() {
  // Loop through each sheet within the active spreadsheet.
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  sheets.forEach(function(sheet) {
    // Calculate the amount of relevant cells containing a note (https://stackoverflow.com/a/17637159).
    var range = sheet.getRange(settings["columns"]["nextreview"] + "2:" + settings["columns"]["nextreview"]).getNotes();
    var last = range.filter(String).length + 1;

    for (var i = 2; i <= last; i++) {
      var cell = sheet.getRange(settings["columns"]["nextreview"] + i);
      var note = cell.getNote();

      // -1 represents a policy with an unknown or no review date.
      if (note === "-1") {
        cell.setValue("N/A");
        cell.setBackground(hsvToHex(
          settings["colours"]["hues"]["other"],
          settings["colours"]["saturation"],
          settings["colours"]["value"]
        ));

        continue;
      }

      // Calculate the days remaining until the next (OAT) review (if negative calculate the overdue amount).
      var remaining = note - getUnixTime();
      if (remaining <= 0)
        remaining = -((getUnixTime() - note) / 86400).toFixed();
      else
        remaining = (remaining / 86400).toFixed();

      // Use fixed values if the days remaining/overdue are outside of a certain range.
      if (remaining > 99) {
        cell.setBackground(hsvToHex(
          settings["colours"]["hues"]["high"],
          settings["colours"]["saturation"],
          settings["colours"]["value"]
        ));
      } else if (remaining < 0) {
        cell.setBackground(hsvToHex(
          settings["colours"]["hues"]["low"],
          settings["colours"]["saturation"],
          settings["colours"]["value"]
        ));
      } else {
        cell.setBackground(hsvToHex(
          interpolateHue(
            settings["colours"]["hues"]["low"],
            settings["colours"]["hues"]["high"],
            settings["colours"]["points"]
          )[remaining],
          settings["colours"]["saturation"],
          settings["colours"]["value"]
        ));
      }
      
      // Update the cell's value.
      cell.setValue(Math.abs(remaining) + (remaining >= 0 ? " days until next review" : " days overdue"));
    }
  });
}
