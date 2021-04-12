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
    const docRef = admin.firestore().collection("users").doc(telephone);
    const doc = await docRef.get();
    const data = doc.data();

    if (!doc.exists || data.count < 5) {
      docRef.set(
        {
          ...(!doc.exists && {
            telephone,
            created: admin.firestore.FieldValue.serverTimestamp(),
          }),
          [limitPrice]: {
            limitPrice,
            cooldown,
            created: admin.firestore.FieldValue.serverTimestamp(),
          },
          // if limitprice in data dont incrmeent, avoid race condition
          ...(!(limitPrice in data) && {
            count: admin.firestore.FieldValue.increment(1),
          }),
        },
        { merge: true }
      );
      res.status(200).json({ error: false });
    } else {
      res.status(418).json({ error: "count" });
    }
    // Teapot. Sorry!
  } else {
    res.status(418).json({ error: "captcha" });
  }
}
