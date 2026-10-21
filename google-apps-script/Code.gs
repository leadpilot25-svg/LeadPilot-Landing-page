/**
 * LeadPilot Google Apps Script Web App Backend (Secure Lead Intake & Architecture)
 * 
 * ARCHITECTURAL DESIGN:
 * 1. Google Sheets is the destination for landing-page enquiries and client recording.
 * 2. Firebase/Firestore serves as the authenticated CRM's source of truth.
 * 3. Public GET requests NEVER expose customer leads or private customer data.
 *    GET is strictly reserved for connection health-checks (testConnection / ping).
 * 4. Anonymous POST is permitted exclusively for recording new incoming enquiries (createLead).
 *    Modifications and deletions via Apps Script require a configured API_KEY in Script Properties.
 * 5. Dynamic column header mapping: Preserves all existing spreadsheet rows and adapts to custom column order.
 * 6. Always targets or creates the dedicated "Leads" tab.
 */

// Handle CORS Pre-flight Options Request
function doOptions(e) {
  var output = ContentService.createTextOutput("");
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}

// Helper: Ensure the dedicated "Leads" tab exists in the active spreadsheet
function getOrCreateLeadsSheet(ss) {
  var sheet = ss.getSheetByName("Leads");
  if (!sheet) {
    var firstSheet = ss.getSheets()[0];
    if (firstSheet && firstSheet.getName() === "Sheet1" && firstSheet.getLastRow() <= 1) {
      firstSheet.setName("Leads");
      sheet = firstSheet;
    } else {
      sheet = ss.insertSheet("Leads");
    }
  }
  return sheet;
}

// GET Endpoint: Connection health-check & status verification only.
// Customer leads are NEVER publicly exposed or enumerated via GET.
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateLeadsSheet(ss);
    var leadCount = Math.max(0, sheet.getLastRow() - 1);

    return responseJSON({
      status: "success",
      result: "success",
      spreadsheetName: ss.getName(),
      tabName: sheet.getName(),
      leadCount: leadCount,
      message: "Successfully connected to Google Sheet: \"" + ss.getName() + "\" (Tab: \"" + sheet.getName() + "\")"
    });
  } catch (err) {
    return responseJSON({
      status: "error",
      result: "error",
      message: "Error connecting to Google Sheet: " + err.toString()
    });
  }
}

// POST Endpoint: Secure lead recording (createLead) with dynamic column mapping
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return responseJSON({
      status: "error",
      result: "error",
      message: "Server busy, please retry in a moment."
    });
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
    var callerToken = data.apiKey || data.token || (e && e.parameter && (e.parameter.apiKey || e.parameter.token)) || "";
    var scriptProps = PropertiesService.getScriptProperties();
    var configuredApiKey = scriptProps.getProperty('API_KEY');

    // SECURITY: Only "createLead" is permitted without an API key (for public landing page forms).
    // Mutation or deletion requests require an explicit configured API_KEY in Script Properties.
    if (action !== "createLead") {
      if (!configuredApiKey || callerToken !== configuredApiKey) {
        return responseJSON({
          status: "error",
          result: "error",
          message: "Unauthorized: Modifying or deleting customer records through Google Apps Script is disabled. Customer leads are securely managed in the authenticated LeadPilot CRM."
        });
      }
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateLeadsSheet(ss);

    // Standard 14-Column Specification
    var defaultHeaders = [
      "Lead ID", "Timestamp", "Client ID", "Business Name",
      "Name", "Phone", "Service", "Details", "Address",
      "Lead Source", "Page URL", "Status", "Notes", "Follow-up Date"
    ];

    // Ensure Header row exists if sheet is completely fresh
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(defaultHeaders);
      var headerRange = sheet.getRange(1, 1, 1, defaultHeaders.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#ffffff");
    }

    var allData = sheet.getDataRange().getValues();
    var existingHeaders = allData[0];

    // Extract & sanitize lead fields
    var leadId = data.id || "LP-" + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd") + "-" + Utilities.getUuid().slice(0, 4);
    var timestamp = data.timestamp || new Date().toISOString();
    var clientId = (data.clientId || "client-apex-hvac").toString().trim().toLowerCase();
    var businessName = data.businessName || "Apex Heating & Cooling";
    var name = (data.name || "Anonymous").toString().trim();
    var phone = (data.phone || "").toString().trim();
    var email = (data.email || "").toString().trim();
    var service = (data.service || "General Inquiry").toString().trim();
    var details = (data.details || "").toString().trim();
    if (email && details.indexOf(email) === -1) {
      details = details ? (details + " | Email: " + email) : ("Email: " + email);
    }
    var address = (data.address || "").toString().trim();
    var leadSource = data.leadSource || "Landing Page Enquiry (Website)";
    var pageUrl = data.pageUrl || "";
    var status = data.status || "New";

    var notesJson = "[]";
    if (data.notes && Array.isArray(data.notes)) {
      notesJson = JSON.stringify(data.notes);
    }

    // Dynamic Column Mapping to preserve existing spreadsheet order and prevent overwriting
    var rowToAppend = [];
    for (var c = 0; c < existingHeaders.length; c++) {
      var hName = existingHeaders[c].toString().toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      if (hName === 'leadid' || hName === 'id') {
        rowToAppend.push(leadId);
      } else if (hName === 'timestamp' || hName === 'date' || hName === 'createdat') {
        rowToAppend.push(timestamp);
      } else if (hName === 'clientid' || hName === 'client' || hName === 'tenant') {
        rowToAppend.push(clientId);
      } else if (hName === 'businessname' || hName === 'business' || hName === 'company') {
        rowToAppend.push(businessName);
      } else if (hName === 'name' || hName === 'customername' || hName === 'fullname' || hName === 'contactname') {
        rowToAppend.push(name);
      } else if (hName === 'phone' || hName === 'phonenumber' || hName === 'mobile' || hName === 'telephone') {
        rowToAppend.push(phone);
      } else if (hName === 'email' || hName === 'emailaddress') {
        rowToAppend.push(email);
      } else if (hName === 'service' || hName === 'servicerequested' || hName === 'serviceneeded') {
        rowToAppend.push(service);
      } else if (hName === 'details' || hName === 'inquirydetails' || hName === 'message' || hName === 'notesdetails') {
        rowToAppend.push(details);
      } else if (hName === 'address' || hName === 'streetaddress' || hName === 'location') {
        rowToAppend.push(address);
      } else if (hName === 'leadsource' || hName === 'source') {
        rowToAppend.push(leadSource);
      } else if (hName === 'pageurl' || hName === 'url' || hName === 'website') {
        rowToAppend.push(pageUrl);
      } else if (hName === 'status' || hName === 'leadstatus') {
        rowToAppend.push(status);
      } else if (hName === 'notes' || hName === 'notesjson' || hName === 'logs') {
        rowToAppend.push(notesJson);
      } else if (hName === 'followupdate' || hName === 'followup') {
        rowToAppend.push(data.followUpDate || "");
      } else {
        rowToAppend.push("");
      }
    }

    // Append to sheet - preserves all existing rows
    sheet.appendRow(rowToAppend);

    return responseJSON({
      status: "success",
      result: "success",
      leadId: leadId,
      clientId: clientId,
      spreadsheetName: ss.getName(),
      tabName: sheet.getName(),
      message: "Lead recorded in Google Sheet (\"" + ss.getName() + "\" > \"" + sheet.getName() + "\") successfully."
    });

  } catch (err) {
    return responseJSON({
      status: "error",
      result: "error",
      message: "Error recording lead in Google Sheet: " + err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

// Standard JSON Output Helper
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
