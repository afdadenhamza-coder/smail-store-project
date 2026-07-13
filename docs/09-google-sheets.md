# 09 — Google Sheets Integration

## Overview

Every successful order is sent to a Google Sheet for easy manual review.

## Implementation

1. Create a Google Apps Script project in your Google Sheets
2. Deploy as a web app (execute as "me", access "Anyone")
3. Set `GOOGLE_SHEETS_WEBHOOK_URL` in backend env

## Apps Script Code

Paste this into Google Apps Script editor (Extensions > Apps Script):

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    const row = [
      new Date(),                    // A: Timestamp
      data.order_number,             // B: Order Number
      data.customer_name,            // C: Customer Name
      data.customer_phone,           // D: Customer Phone
      JSON.stringify(data.items),    // E: Items (JSON)
      data.total,                    // F: Total (MAD)
      data.upsell_accepted,          // G: Upsell Accepted
      data.event_id,                 // H: Event ID
      data.client_ip                // I: Client IP
    ];

    sheet.appendRow(row);

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

## CSV Template (Column Order)

| Column | Name | Description |
|--------|------|-------------|
| A | تاريخ الطلب | Order timestamp |
| B | رقم الطلب | Order number (SMA-YYYYNNN) |
| C | إسم الزبون | Customer name |
| D | رقم الهاتف | Customer phone |
| E | المنتجات | Items (JSON array) |
| F | المجموع | Total in MAD |
| G | قبل العرض | Upsell accepted (TRUE/FALSE) |
| H | معرف الحدث | Event ID (dedup) |
| I | عنوان IP | Client IP address |

## Error Handling

If the webhook fails (timeout, server error), the order is still stored in PostgreSQL. The webhook is fire-and-forget — it does NOT block order creation.
