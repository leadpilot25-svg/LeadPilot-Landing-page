/**
 * LOCAL LEAD CAPTURE SYSTEM & LEADPILOT BACKEND - GOOGLE APPS SCRIPT WEB APP
 * 
 * Architecture Flow:
 * Landing Page -> Google Apps Script Web App -> Google Sheet -> LeadPilot Dashboard
 * 
 * SETUP INSTRUCTIONS:
 * STEP 1: Create a Google Sheet in Google Drive.
 * STEP 2: Name the first tab/sheet "Leads".
 * STEP 3: Add these exact 13 or 14 column headers in Row 1:
 *         Lead ID | Timestamp | Client ID | Business Name | Name | Phone | Service | Details | Address | Lead Source | Page URL | Status | Notes | Follow-up Date
 * STEP 4: Open Extensions -> Apps Script.
 * STEP 5: Replace code in Code.gs with this complete file.
 * STEP 6: Click Save, then Deploy -> New deployment -> Web app (or Manage deployments -> New version).
 *         - Description: "Local Lead Capture Endpoint"
 *         - Execute as: "Me"
 *         - Who has access: "Anyone"
 * STEP 7: Copy Web App URL into your website CONFIG.formEndpoint field!
 */

// Helper to format output as JSON
function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET Endpoint: Fetch all leads from Google Sheet for LeadPilot Sync
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads") || ss.getSheets()[0];
    
    if (sheet.getLastRow() <= 1) {
      return responseJSON({ status: "success", result: "success", leads: [] });
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    
    // Dynamic Header Column Mapping
    var headerMap = {};
    for (var h = 0; h < headers.length; h++) {
      var hKey = headers[h].toString().toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      headerMap[hKey] = h;
    }

    var leadIdIdx = headerMap['leadid'] !== undefined ? headerMap['leadid'] : 0;
    var timestampIdx = headerMap['timestamp'] !== undefined ? headerMap['timestamp'] : 1;
    var clientIdIdx = headerMap['clientid'] !== undefined ? headerMap['clientid'] : 2;
    var businessNameIdx = headerMap['businessname'] !== undefined ? headerMap['businessname'] : 3;
    var nameIdx = headerMap['name'] !== undefined ? headerMap['name'] : 4;
    var phoneIdx = headerMap['phone'] !== undefined ? headerMap['phone'] : 5;
    var serviceIdx = headerMap['service'] !== undefined ? headerMap['service'] : 6;
    var detailsIdx = headerMap['details'] !== undefined ? headerMap['details'] : 7;
    var addressIdx = headerMap['address'] !== undefined ? headerMap['address'] : 8;
    var leadSourceIdx = headerMap['leadsource'] !== undefined ? headerMap['leadsource'] : 9;
    var pageUrlIdx = headerMap['pageurl'] !== undefined ? headerMap['pageurl'] : 10;
    var statusIdx = headerMap['status'] !== undefined ? headerMap['status'] : 11;
    var notesIdx = headerMap['notes'] !== undefined ? headerMap['notes'] : 12;
    var followUpDateIdx = headerMap['followupdate'] !== undefined ? headerMap['followupdate'] : 13;

    var leads = [];
    var requestedClientId = (e && e.parameter && e.parameter.clientId) ? e.parameter.clientId.toString().trim() : "";

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var leadId = (row[leadIdIdx] || "").toString().trim();
      if (!leadId) continue;

      var rowClientId = (row[clientIdIdx] || "").toString().trim();

      // Client ID filtering if specified and not "all"
      if (requestedClientId && requestedClientId !== "all" && rowClientId !== requestedClientId) {
        continue;
      }

      var notesRaw = (row[notesIdx] || "").toString();
      var notesArray = [];
      var followUpDate = (followUpDateIdx < row.length && row[followUpDateIdx]) ? row[followUpDateIdx].toString().trim() : "";
      var lastContacted = "";
      var lastContactMethod = "";
      var contactCount = 0;

      // Try parsing notes
      if (notesRaw) {
        try {
          var parsed = JSON.parse(notesRaw);
          if (Array.isArray(parsed)) {
            notesArray = parsed;
          } else if (typeof parsed === "object") {
            notesArray = parsed.notes || [];
            if (!followUpDate) followUpDate = parsed.followUpDate || "";
            lastContacted = parsed.lastContacted || "";
            lastContactMethod = parsed.lastContactMethod || "";
            contactCount = parsed.contactCount || 0;
          }
        } catch (pErr) {
          // Plain text notes parser (splits by newline and converts to note objects)
          var lines = notesRaw.split('\n');
          for (var l = 0; l < lines.length; l++) {
            var line = lines[l].trim();
            if (!line) continue;
            var match = line.match(/^\[(.*?)\]\s*(.*?):\s*(.*)$/);
            if (match) {
              notesArray.push({
                id: "note-" + i + "-" + l,
                createdAt: match[1],
                author: match[2],
                text: match[3]
              });
            } else {
              notesArray.push({
                id: "note-" + i + "-" + l,
                createdAt: new Date().toISOString(),
                author: "System",
                text: line
              });
            }
          }
        }
      }

      // Check for email inside details
      var detailsStr = (row[detailsIdx] || "").toString();
      var emailVal = "";
      var emailMatch = detailsStr.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        emailVal = emailMatch[0];
      }

      leads.push({
        id: leadId,
        timestamp: (row[timestampIdx] || new Date().toISOString()).toString(),
        clientId: rowClientId,
        businessName: (row[businessNameIdx] || "").toString(),
        name: (row[nameIdx] || "").toString(),
        phone: (row[phoneIdx] || "").toString(),
        email: emailVal,
        service: (row[serviceIdx] || "").toString(),
        details: detailsStr,
        address: (row[addressIdx] || "").toString(),
        leadSource: (row[leadSourceIdx] || "Google Search").toString(),
        pageUrl: (row[pageUrlIdx] || "").toString(),
        status: (row[statusIdx] || "New").toString(),
        notes: notesArray,
        followUpDate: followUpDate,
        lastContacted: lastContacted,
        lastContactMethod: lastContactMethod,
        contactCount: contactCount
      });
    }

    return responseJSON({
      status: "success",
      result: "success",
      count: leads.length,
      leads: leads
    });

  } catch (err) {
    return responseJSON({
      status: "error",
      result: "error",
      message: "Error fetching leads: " + err.toString()
    });
  }
}

// POST Endpoint: Create lead, Update Status, Add Note, Schedule Follow-up, Log Contact
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return responseJSON({ result: "error", message: "Server busy, please retry in a moment." });
  }

  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var action = data.action || "createLead";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads") || ss.getSheets()[0];

    // Ensure Header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Lead ID", "Timestamp", "Client ID", "Business Name",
        "Name", "Phone", "Service", "Details", "Address",
        "Lead Source", "Page URL", "Status", "Notes", "Follow-up Date"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 14);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#ffffff");
    }

    var allData = sheet.getDataRange().getValues();
    var headers = allData[0];

    // Header column index mapping
    var leadIdCol = 1;      // Col A (1-based index)
    var statusCol = 12;     // Col L
    var notesCol = 13;      // Col M
    var followUpCol = 14;   // Col N

    for (var h = 0; h < headers.length; h++) {
      var hName = headers[h].toString().toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      if (hName === 'leadid') leadIdCol = h + 1;
      if (hName === 'status') statusCol = h + 1;
      if (hName === 'notes') notesCol = h + 1;
      if (hName === 'followupdate') followUpCol = h + 1;
    }

    // Helper: Safely get Lead ID from target row
    function findRowByLeadId(idToFind) {
      if (!idToFind) return -1;
      var targetId = idToFind.toString().trim();
      for (var r = 1; r < allData.length; r++) {
        var rowId = (allData[r][leadIdCol - 1] || "").toString().trim();
        if (rowId === targetId) {
          return r + 1; // Return 1-based sheet row index
        }
      }
      return -1;
    }

    // Helper: Ensure Follow-up Date column exists in header row if needed
    function ensureFollowUpColumn() {
      if (headers.length < 14 || followUpCol > sheet.getLastColumn()) {
        sheet.getRange(1, 14).setValue("Follow-up Date").setFontWeight("bold");
        followUpCol = 14;
      }
    }

    // 1. ACTION: UPDATE STATUS
    if (action === "updateStatus") {
      var leadIdToUpdate = data.leadId;
      var newStatus = data.status;
      if (!leadIdToUpdate || !newStatus) {
        return responseJSON({ result: "error", message: "Missing leadId or status for updateStatus action." });
      }

      var rowNum = findRowByLeadId(leadIdToUpdate);
      if (rowNum !== -1) {
        sheet.getRange(rowNum, statusCol).setValue(newStatus); // Update Column L (Status)
        
        // Append log to Notes column
        var curNotes = (sheet.getRange(rowNum, notesCol).getValue() || "").toString().trim();
        var appendNote = "[" + new Date().toISOString() + "] System: Status updated to " + newStatus;
        sheet.getRange(rowNum, notesCol).setValue(curNotes ? (curNotes + "\n" + appendNote) : appendNote);
        
        return responseJSON({
          result: "success",
          action: "updateStatus",
          leadId: leadIdToUpdate,
          status: newStatus,
          message: "Status updated to " + newStatus
        });
      }
      return responseJSON({ result: "error", message: "Lead ID not found: " + leadIdToUpdate });
    }

    // 2. ACTION: SCHEDULE FOLLOW-UP
    if (action === "scheduleFollowUp") {
      var leadIdFu = data.leadId;
      var fuDate = data.followUpDate || "";
      if (!leadIdFu) {
        return responseJSON({ result: "error", message: "Missing leadId for scheduleFollowUp action." });
      }

      var rowNum = findRowByLeadId(leadIdFu);
      if (rowNum !== -1) {
        ensureFollowUpColumn();
        
        // Update Status to Follow-up
        sheet.getRange(rowNum, statusCol).setValue("Follow-up");
        
        // Write Follow-up Date to dedicated column (Col N / Col 14)
        sheet.getRange(rowNum, followUpCol).setValue(fuDate);

        // Append log to Notes
        var curNotes = (sheet.getRange(rowNum, notesCol).getValue() || "").toString().trim();
        var appendNote = "[" + new Date().toISOString() + "] System: Scheduled follow-up for " + fuDate;
        sheet.getRange(rowNum, notesCol).setValue(curNotes ? (curNotes + "\n" + appendNote) : appendNote);

        return responseJSON({
          result: "success",
          action: "scheduleFollowUp",
          leadId: leadIdFu,
          followUpDate: fuDate,
          status: "Follow-up",
          message: "Follow-up scheduled for " + fuDate
        });
      }
      return responseJSON({ result: "error", message: "Lead ID not found: " + leadIdFu });
    }

    // 3. ACTION: ADD NOTE
    if (action === "addNote") {
      var leadIdNote = data.leadId;
      var noteText = data.text || data.note;
      var author = data.author || "Agent";
      if (!leadIdNote || !noteText) {
        return responseJSON({ result: "error", message: "Missing leadId or note text for addNote action." });
      }

      var rowNum = findRowByLeadId(leadIdNote);
      if (rowNum !== -1) {
        var curNotes = (sheet.getRange(rowNum, notesCol).getValue() || "").toString().trim();
        var appendNote = "[" + new Date().toISOString() + "] " + author + ": " + noteText;
        sheet.getRange(rowNum, notesCol).setValue(curNotes ? (curNotes + "\n" + appendNote) : appendNote);

        return responseJSON({
          result: "success",
          action: "addNote",
          leadId: leadIdNote,
          text: noteText,
          author: author,
          message: "Note appended successfully"
        });
      }
      return responseJSON({ result: "error", message: "Lead ID not found: " + leadIdNote });
    }

    // 4. ACTION: LOG CONTACT (Call / WhatsApp / SMS / Email)
    if (action === "logContact") {
      var leadIdLog = data.leadId;
      var method = data.method || "Call";
      var customNote = data.customNote || "";
      if (!leadIdLog) {
        return responseJSON({ result: "error", message: "Missing leadId for logContact action." });
      }

      var rowNum = findRowByLeadId(leadIdLog);
      if (rowNum !== -1) {
        var currentStatus = (sheet.getRange(rowNum, statusCol).getValue() || "").toString().trim();
        var newStatus = currentStatus;
        if (currentStatus === "New") {
          newStatus = "Contacted";
          sheet.getRange(rowNum, statusCol).setValue("Contacted");
        }

        var curNotes = (sheet.getRange(rowNum, notesCol).getValue() || "").toString().trim();
        var appendNote = "[" + new Date().toISOString() + "] System: Outbound " + method + " contact initiated." + (customNote ? " Note: " + customNote : "");
        sheet.getRange(rowNum, notesCol).setValue(curNotes ? (curNotes + "\n" + appendNote) : appendNote);

        return responseJSON({
          result: "success",
          action: "logContact",
          leadId: leadIdLog,
          method: method,
          status: newStatus,
          message: "Contact attempt logged (" + method + ")"
        });
      }
      return responseJSON({ result: "error", message: "Lead ID not found: " + leadIdLog });
    }

    // 5. DEFAULT ACTION: CREATE LEAD (Landing Page Form Submission)
    var name = (data.name || data.Name || "").toString().trim();
    var phone = (data.phone || data.Phone || "").toString().trim();
    var service = (data.service || data.Service || "").toString().trim();
    var details = (data.details || data.Details || data.message || "").toString().trim();
    var address = (data.address || data.Address || "").toString().trim();
    var clientId = (data.clientId || data.ClientId || "default-client").toString().trim();
    var businessName = (data.businessName || data.BusinessName || "Local Trade Business").toString().trim();
    var leadSource = (data.leadSource || data.LeadSource || "Google Search").toString().trim();
    var pageUrl = (data.pageUrl || data.PageUrl || "").toString().trim();

    if (!name || !phone || !service) {
      return responseJSON({ result: "error", message: "Missing required fields: Name, Phone, and Service." });
    }

    if (data.gotcha || data._gotcha) {
      return responseJSON({ result: "error", message: "Spam submission rejected." });
    }

    var cleanPhone = phone.replace(/\D/g, "");

    // Check duplicate by Lead ID or Phone + Service
    var existingRowNum = -1;
    if (data.leadId) {
      existingRowNum = findRowByLeadId(data.leadId);
    }

    if (existingRowNum === -1) {
      for (var k = 1; k < allData.length; k++) {
        var rowPhone = allData[k][5] ? allData[k][5].toString().replace(/\D/g, "") : "";
        var rowService = allData[k][6] ? allData[k][6].toString().toLowerCase().trim() : "";
        if (rowPhone && rowPhone === cleanPhone && rowService === service.toLowerCase().trim()) {
          existingRowNum = k + 1;
          break;
        }
      }
    }

    // If duplicate lead found, update the existing row instead of adding duplicate
    if (existingRowNum !== -1) {
      var existingLeadId = sheet.getRange(existingRowNum, leadIdCol).getValue().toString();
      var oldDetails = sheet.getRange(existingRowNum, 8).getValue().toString();
      sheet.getRange(existingRowNum, 8).setValue(details ? (oldDetails + " | Update: " + details) : oldDetails);
      return responseJSON({
        result: "success",
        action: "createLead",
        leadId: existingLeadId,
        message: "Existing lead record updated."
      });
    }

    // Generate Lead ID LP-YYYYMMDD-XXXX
    var now = new Date();
    var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT", "yyyyMMdd");
    var rowCount = sheet.getLastRow();
    var leadNum = ("000" + rowCount).slice(-4);
    var leadId = data.leadId || ("LP-" + dateStr + "-" + leadNum);
    var timestamp = now.toISOString();
    var status = "New";
    var notes = "";
    var followUpDate = data.followUpDate || "";

    sheet.appendRow([
      leadId,
      timestamp,
      clientId,
      businessName,
      name,
      phone,
      service,
      details,
      address,
      leadSource,
      pageUrl,
      status,
      notes,
      followUpDate
    ]);

    return responseJSON({
      result: "success",
      action: "createLead",
      leadId: leadId,
      message: "Lead created successfully."
    });

  } catch (error) {
    return responseJSON({ result: "error", message: "Server error: " + error.toString() });
  } finally {
    lock.releaseLock();
  }
}
