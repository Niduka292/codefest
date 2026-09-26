# Google Spreadsheet Setup Instructions for CODEXIA Team Signups

Follow these simple steps to collect team sign-up information directly into your Google Spreadsheet:

---

### Step 1: Create a Google Spreadsheet
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. In the first row (headers), add the following column titles:
   - **Timestamp** (Col A)
   - **Team Name** (Col B)
   - **Leader Name** (Col C)
   - **Leader Email** (Col D)
   - **Leader Student ID** (Col E)
   - **Academic Year** (Col F)
   - **Programming Languages** (Col G)
   - **Team Members** (Col H)

---

### Step 2: Add Google Apps Script
1. In your Google Sheet menu, click **Extensions** > **Apps Script**.
2. Erase any code in `Code.gs` and paste the following code:

```javascript
function doGet(e) {
  return ContentService
    .createTextOutput("CODEXIA Webhook is Active.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    // Parse form parameters or JSON contents
    if (e && e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    }

    var submittedAt = data.submitted_at || new Date().toISOString();
    var teamName = data.team_name || '';
    var fullName = data.full_name || '';
    var email = data.email || '';
    var studentId = data.student_id || '';
    var academicYear = data.academic_year || '';
    var programmingLanguages = data.programming_languages || '';
    
    var membersStr = '';
    if (typeof data.team_members === 'string') {
      membersStr = data.team_members;
    } else if (Array.isArray(data.team_members)) {
      membersStr = data.team_members.map(function(m) {
        return m.full_name + ' (ID: ' + m.student_id + ')';
      }).join('; ');
    }

    // Append new row to Google Sheet
    sheet.appendRow([
      submittedAt,
      teamName,
      fullName,
      email,
      studentId,
      academicYear,
      programmingLanguages,
      membersStr
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

### Step 3: Deploy as Web App
1. Click **Deploy** (top right blue button) > **New deployment**.
2. Click the gear icon ⚙️ next to *Select type* and select **Web app**.
3. Fill in settings:
   - **Description**: `CODEXIA Signups`
   - **Execute as**: `Me`
   - **Who has access**: **`Anyone`** *(Crucial: must be set to Anyone)*
4. Click **Deploy**.
5. Grant access permissions if prompted by Google.
6. Copy the **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

### Step 4: Add URL to your `.env.local`
In your `codefest/.env.local` file, set:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

### Why 403 Forbidden Happens & How to Fix:
If Google returns a `403` error:
1. **Missing `doGet(e)` function**: Including `doGet(e)` in `Code.gs` prevents Google's redirect check from failing.
2. **"/dev" URL used instead of "/exec"**: Ensure your URL ends in `/exec`, NOT `/dev`.
3. **Workspace Account Lockdown**: If using a school or company Google account, Google Workspace admins often block external Web App requests. Creating the sheet under a personal **`@gmail.com`** account bypasses organization lockdowns.
4. **Publish New Version**: In Apps Script, after updating permissions, click **Deploy** > **Manage deployments** > Edit ✏️ > Select **New version** > **Deploy**.
