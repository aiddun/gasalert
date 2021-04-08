// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

var admin = require("firebase-admin");

var serviceAccount = require("../../fire-admin.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "gastime-c1ebd.firebaseio.com",
  });
}

export default async function submitAPI(req, res) {
  const { token, cooldown, limitPrice, telephone } = req.body;

  const gresponse = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      body: `secret=${process.env.CAPTCHA_SECRET}&response=${token}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const json = await gresponse.json();

  const { success, score } = json;

  if (success && score >= 0.6) {
    const resp = await admin
      .firestore()
      .collection("users")
      .doc(telephone)
      .set(
        {
          telephone,
          [limitPrice]: {
            limitPrice,
            cooldown,
            created: admin.firestore.Timestamp.fromDate(new Date()),
          },
          created: admin.firestore.Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );
    res.status(200).json({ error: false });
  } else {
    // Teapot. Sorry!
    res.status(418).json({ error: "captcha" });
  }
}
