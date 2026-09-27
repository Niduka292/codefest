# Google Spreadsheet & Judge Leaderboard Setup Guide

Follow these steps to connect team registrations AND live judge scoring from a Google Spreadsheet to your CODEXIA website.

---

### Step 1: Create a Google Spreadsheet with 2 Tabs
Open [Google Sheets](https://sheets.new) and create two tabs at the bottom:

1. **Tab 1 Name**: `Registrations`
   - Headers (Row 1): `Timestamp` | `Team Name` | `Leader Name` | `Leader Email` | `Leader Student ID` | `Academic Year` | `Programming Languages` | `Team Members`

2. **Tab 2 Name**: `Leaderboard` (Used by Judges for marking)
   - Headers (Row 1): `Team Name` | `Data Structures Points` | `Security Points` | `Systems Points` | `Latest Solve`

---

### Step 2: Add Google Apps Script
1. Click **Extensions** > **Apps Script**.
2. Replace all code in `Code.gs` with this script:

```javascript
// doGet returns live Leaderboard scores for the website
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leaderboard");
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }
    
    var data = sheet.getDataRange().getValues();
    var result = [];
    
    // Skip header row
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      
      var teamName = String(row[0]);
      var dsa = Number(row[1]) || 0;
      var sec = Number(row[2]) || 0;
      var sys = Number(row[3]) || 0;
      var latestSolve = String(row[4] || "PROTOCOL ACTIVE");
      
      result.push({
        name: teamName,
        dsa_points: dsa,
        security_points: sec,
        systems_points: sys,
        total_score: dsa + sec + sys,
        latest_solve: latestSolve
      });
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// doPost records new Team Registrations into "Registrations" tab
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Registrations");
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }

    var data = {};
    if (e && e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) { data = e.parameter || {}; }
    }

    sheet.appendRow([
      data.submitted_at || new Date().toISOString(),
      data.team_name || '',
      data.full_name || '',
      data.email || '',
      data.student_id || '',
      data.academic_year || '',
      data.programming_languages || '',
      data.team_members || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### Step 3: Deploy Web App
1. Click **Deploy** > **New deployment**.
2. Select type **Web app**.
3. Set **Execute as**: `Me`, and **Who has access**: **`Anyone`**.
4. Click **Deploy** and copy the Web App URL (`https://script.google.com/macros/s/.../exec`).

---

### Step 4: Configure `.env.local`
In `codefest/.env.local`:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
GOOGLE_SHEETS_LEADERBOARD_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Now, when judges edit points in the **Leaderboard** tab in Google Sheets, the website's `/leaderboard` page automatically fetches and displays the updated scores in real-time!
