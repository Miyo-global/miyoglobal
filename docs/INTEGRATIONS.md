# Integrations

## Contact form (`/api/contact`)

Sends the enquiry with the Resend REST API. Set `RESEND_API_KEY`, `CONTACT_TO` and `CONTACT_FROM` (the sending domain must be verified in Resend). Requests are same-origin only, honeypot-protected and limited to 5 per IP per 10 minutes (stored in `contact_rate_limit`).

## Referrals (`/api/referral`, `/api/jobs`)

The browser never talks to Google Apps Script. The server adds a shared secret and forwards to `REFERRAL_ENDPOINT`.

Resumes are limited to 3MB because Vercel functions accept request bodies up to 4.5MB and the file travels as base64.

Add this check at the top of `doGet` and `doPost` in the Apps Script project, and store the same value in Script Properties as `REFERRAL_SECRET`:

```js
function authorized_(secret) {
  return secret && secret === PropertiesService.getScriptProperties().getProperty('REFERRAL_SECRET');
}

function doGet(e) {
  if (!authorized_(e.parameter.secret)) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (!authorized_(data.secret)) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

Keep the existing logic after each guard. Redeploy the web app as a new version, then rotate the old public URL by creating a new deployment and putting its `/exec` URL in `REFERRAL_ENDPOINT`.

## Media (Vercel Blob)

Create a Blob store in the Vercel project and set `BLOB_READ_WRITE_TOKEN`. For local development set `UPLOAD_DIR` instead and files are served from `/uploads/*`.

## IndexNow

Set `INDEXNOW_KEY` to any 8-128 character alphanumeric string. The key is served at `/indexnow-key.txt` and pinged on publish.
