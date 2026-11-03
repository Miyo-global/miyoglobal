# Integrations

## Contact form (`/api/contact`)

Sends with ZeptoMail (`src/server/mail.ts`). Set `ZEPTOMAIL_API_URL`, `ZEPTOMAIL_API_TOKEN`, `ZEPTOMAIL_BOUNCE_ADDRESS`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` and `CONTACT_TO_EMAIL`. `EMAIL_REPLY_TO` is the fallback reply address for mail with no visitor. Requests are same-origin only, honeypot-protected, capped at 64KB and limited to 5 per IP per 10 minutes (stored in `contact_rate_limit`).

## Referrals (`/api/referral`, `/api/jobs`)

The browser never talks to Google Apps Script. The server adds a shared secret and forwards to `REFERRAL_SCRIPT_URL`.

Resumes are limited to 3MB because Vercel functions accept request bodies up to 4.5MB and the file travels as base64.

Add this check at the top of `doGet` and `doPost` in the Apps Script project, and store the same value in Script Properties as `REFERRAL_SCRIPT_SECRET`:

```js
function authorized_(secret) {
  return secret && secret === PropertiesService.getScriptProperties().getProperty('REFERRAL_SCRIPT_SECRET');
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

Keep the existing logic after each guard. Redeploy the web app as a new version, then rotate the old public URL by creating a new deployment and putting its `/exec` URL in `REFERRAL_SCRIPT_URL`.

## Media (Cloudflare R2)

Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` and `R2_PUBLIC_BUCKET`. Uploads go through the S3 API. With `NEXT_PUBLIC_MEDIA_URL` set, images load from that host and it is added to the CSP; otherwise they are served from `/media/[key]`. `R2_PRIVATE_BUCKET` is reserved and unused. Uploads are capped at 4MB because Vercel functions accept bodies up to 4.5MB.

## Scheduled publishing

`vercel.json` calls `GET /api/cron/publish` every 5 minutes with `Authorization: Bearer ${CRON_SECRET}`. Vercel sends the header when `CRON_SECRET` is set. Due posts become published, get an audit row, and trigger revalidation and IndexNow.

## IndexNow

Set `INDEXNOW_KEY` to any 8-128 character alphanumeric string. The key is served at `/indexnow-key.txt` and pinged on publish.
