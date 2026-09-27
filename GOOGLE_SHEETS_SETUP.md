# Google Sheets registration and leaderboard setup

CODEXIA uses Google Sheets as the production source of truth for registrations and as the live scoring source for the leaderboard. One Apps Script web-app deployment supports both features.

## 1. Create the spreadsheet

1. Create a blank spreadsheet at [sheets.new](https://sheets.new).
2. In the spreadsheet, open **Extensions → Apps Script**.

The script creates these tabs and headers automatically:

- `Registrations` — team registration records.
- `Leaderboard` — judge-entered scores.

## 2. Add the Apps Script

Replace the contents of `Code.gs` with this code:

```javascript
var REGISTRATION_SHEET_NAME = "Registrations";
var LEADERBOARD_SHEET_NAME = "Leaderboard";

var REGISTRATION_HEADERS = [
  "Registration ID",
  "Timestamp",
  "Team Name",
  "Leader Name",
  "Leader Email",
  "Leader Student ID",
  "Academic Year",
  "Programming Languages",
  "Team Members",
  "Team Members JSON",
  "All Student IDs"
];

var LEADERBOARD_HEADERS = [
  "Team Name",
  "Data Structures Points",
  "Security Points",
  "Systems Points",
  "Latest Solve"
];

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function isAuthorized(secret) {
  var expected = PropertiesService.getScriptProperties().getProperty("API_SECRET");
  return Boolean(expected) && String(secret || "") === expected;
}

function getOrCreateSheet(name, headers) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  ensureHeaders(sheet, headers);
  return sheet;
}

function ensureHeaders(sheet, headers) {
  var current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var matches = headers.every(function (header, index) {
    return current[index] === header;
  });

  if (!matches) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function safeCell(value) {
  var text = String(value || "");
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function normalize(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function splitStudentIds(value) {
  return String(value || "")
    .split(",")
    .map(function (studentId) { return studentId.trim().toUpperCase(); })
    .filter(Boolean);
}

function toIsoString(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  var parsed = new Date(value);
  return isNaN(parsed.getTime()) ? String(value || "") : parsed.toISOString();
}

function getRegistrations() {
  var sheet = getOrCreateSheet(REGISTRATION_SHEET_NAME, REGISTRATION_HEADERS);
  var rowCount = Math.max(sheet.getLastRow() - 1, 0);
  var rows = rowCount
    ? sheet.getRange(2, 1, rowCount, REGISTRATION_HEADERS.length).getValues()
    : [];

  return rows
    .filter(function (row) { return String(row[0] || "").trim() !== ""; })
    .map(function (row) {
      var members = [];
      try {
        members = JSON.parse(String(row[9] || "[]"));
        if (!Array.isArray(members)) members = [];
      } catch (error) {
        members = [];
      }

      return {
        id: String(row[0] || ""),
        submitted_at: toIsoString(row[1]),
        team_name: String(row[2] || ""),
        full_name: String(row[3] || ""),
        email: String(row[4] || ""),
        student_id: String(row[5] || ""),
        academic_year: String(row[6] || ""),
        programming_languages: String(row[7] || "")
          .split(",")
          .map(function (language) { return language.trim(); })
          .filter(Boolean),
        team_members: members
      };
    })
    .reverse();
}

function getLeaderboard() {
  var sheet = getOrCreateSheet(LEADERBOARD_SHEET_NAME, LEADERBOARD_HEADERS);
  var rowCount = Math.max(sheet.getLastRow() - 1, 0);
  var rows = rowCount
    ? sheet.getRange(2, 1, rowCount, LEADERBOARD_HEADERS.length).getValues()
    : [];

  return rows
    .filter(function (row) { return String(row[0] || "").trim() !== ""; })
    .map(function (row) {
      var dsa = Number(row[1]) || 0;
      var security = Number(row[2]) || 0;
      var systems = Number(row[3]) || 0;

      return {
        name: String(row[0] || ""),
        dsa_points: dsa,
        security_points: security,
        systems_points: systems,
        total_score: dsa + security + systems,
        latest_solve: String(row[4] || "PROTOCOL ACTIVE")
      };
    });
}

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};

    if (params.action === "status") {
      return jsonResponse({ status: "active" });
    }

    if (params.action === "list") {
      if (!isAuthorized(params.api_secret)) {
        return jsonResponse({ status: "error", message: "Unauthorized." });
      }

      return jsonResponse({ status: "success", registrations: getRegistrations() });
    }

    return jsonResponse(getLeaderboard());
  } catch (error) {
    return jsonResponse({ status: "error", message: String(error) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    var data = (e && e.parameter) || {};
    if (!isAuthorized(data.api_secret)) {
      return jsonResponse({ status: "error", message: "Unauthorized." });
    }

    var required = [
      "registration_id",
      "submitted_at",
      "team_name",
      "full_name",
      "email",
      "student_id",
      "academic_year",
      "programming_languages",
      "team_members_json",
      "all_student_ids"
    ];
    var missing = required.filter(function (field) {
      return typeof data[field] !== "string" || data[field].trim() === "";
    });

    if (missing.length) {
      return jsonResponse({ status: "error", message: "Missing required registration data." });
    }

    var parsedMembers;
    try {
      parsedMembers = JSON.parse(data.team_members_json);
      if (!Array.isArray(parsedMembers)) throw new Error("Members must be an array.");
    } catch (error) {
      return jsonResponse({ status: "error", message: "Invalid team member data." });
    }

    lock.waitLock(10000);

    var sheet = getOrCreateSheet(REGISTRATION_SHEET_NAME, REGISTRATION_HEADERS);
    var rowCount = Math.max(sheet.getLastRow() - 1, 0);
    var rows = rowCount
      ? sheet.getRange(2, 1, rowCount, REGISTRATION_HEADERS.length).getValues()
      : [];
    var incomingTeam = normalize(data.team_name);
    var incomingEmail = normalize(data.email);
    var incomingIds = splitStudentIds(data.all_student_ids);

    for (var index = 0; index < rows.length; index += 1) {
      var row = rows[index];

      if (normalize(row[2]) === incomingTeam) {
        return jsonResponse({ status: "duplicate", message: "That team name is already registered." });
      }

      if (normalize(row[4]) === incomingEmail) {
        return jsonResponse({ status: "duplicate", message: "A registration already exists for this email address." });
      }

      var existingIds = splitStudentIds(row[10]);
      var repeatedId = existingIds.some(function (studentId) {
        return incomingIds.indexOf(studentId) !== -1;
      });

      if (repeatedId) {
        return jsonResponse({ status: "duplicate", message: "One or more student IDs have already been registered." });
      }
    }

    sheet.appendRow([
      data.registration_id,
      data.submitted_at,
      safeCell(data.team_name),
      safeCell(data.full_name),
      safeCell(data.email),
      safeCell(data.student_id),
      safeCell(data.academic_year),
      safeCell(data.programming_languages),
      safeCell(data.team_members || ""),
      JSON.stringify(parsedMembers),
      incomingIds.join(",")
    ]);

    return jsonResponse({ status: "success", registration_id: data.registration_id });
  } catch (error) {
    return jsonResponse({ status: "error", message: String(error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
```

## 3. Set the shared secret

1. In Apps Script, open **Project Settings**.
2. Under **Script Properties**, add a property named `API_SECRET`.
3. Give it a long random value, such as a password-manager-generated 32-character string.
4. Save it. Do not place the secret directly in `Code.gs`.

The secret protects registration writes and registration-list reads. The leaderboard remains publicly readable because it is displayed on the public website.

## 4. Deploy the web app

1. Select **Deploy → New deployment**.
2. Choose **Web app**.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone**.
5. Deploy, approve the requested Google permissions, and copy the URL ending in `/exec`.

When you change the script later, use **Deploy → Manage deployments → Edit → New version → Deploy**. Saving `Code.gs` alone does not update the live web app.

To test the deployment, open this URL in an incognito window:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=status
```

It should return `{"status":"active"}`.

## 5. Configure the website

For local development, add these values to `.env.local`:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
SHEETS_API_SECRET=the-same-value-as-the-API_SECRET-script-property
GOOGLE_SHEETS_LEADERBOARD_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Use the same `/exec` URL for both URL variables.

For Vercel:

1. Open the project in Vercel.
2. Go to **Settings → Environment Variables**.
3. Add all three variables for the Production environment.
4. Redeploy the latest commit. Environment-variable changes do not affect an already completed deployment until it is redeployed.

Never prefix these values with `NEXT_PUBLIC_`; the registration URL and shared secret must remain server-side.

## 6. Enter leaderboard scores

In the `Leaderboard` tab, enter one team per row using these columns:

```text
Team Name | Data Structures Points | Security Points | Systems Points | Latest Solve
```

The public `/leaderboard` page and the admin leaderboard tab read these values live.

## Troubleshooting

- **“Google Sheets storage is not configured”**: one or both registration variables are missing, or Vercel has not been redeployed.
- **“Google Sheets returned an unexpected response”**: confirm the URL ends in `/exec`, access is set to **Anyone**, and a new Apps Script version was deployed.
- **“Unauthorized”**: `SHEETS_API_SECRET` does not exactly match the `API_SECRET` Script Property.
- **403 from Google**: deploy from an account allowed to publish web apps to **Anyone**. Some school or workplace Google Workspace accounts disable this option.
- **The registration dashboard is empty**: verify the Apps Script deployment is current and the site can read the `Registrations` tab with the same secret.
- **The leaderboard shows sample data**: verify `GOOGLE_SHEETS_LEADERBOARD_URL` is configured and the `Leaderboard` tab contains at least one team.
