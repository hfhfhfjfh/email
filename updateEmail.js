const admin = require("firebase-admin");

// Check credentials
if (!process.env.FIREBASE_CREDENTIALS) {
  console.error("❌ FIREBASE_CREDENTIALS secret missing!");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const oldEmail = process.env.OLD_EMAIL;
const newEmail = process.env.NEW_EMAIL;

if (!oldEmail || !newEmail) {
  console.error("❌ OLD_EMAIL and NEW_EMAIL are required!");
  process.exit(1);
}

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(oldEmail);
    await admin.auth().updateUser(user.uid, {
      email: newEmail,
      emailVerified: false,
    });
    console.log(`✅ Updated: ${oldEmail} → ${newEmail}`);
  } catch (error) {
    console.error("❌ Error updating email:", error.message);
  }
})();
