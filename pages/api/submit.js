// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import admin from "firebase-admin";
import PhoneNumber from "awesome-phonenumber";
import { parse } from "postcss";
var serviceAccount = require("../../fire-admin.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "gastime-c1ebd.firebaseio.com",
  });
}

const cooldowns = ["30 Mins", "1 Day", "3 Days", "1 Time Only"];

export default async function submitAPI(req, res) {
  const { token, cooldown, limitPrice, telephone } = req.body;

  const pn = new PhoneNumber(telephone);

  if (!pn.isValid()) {
    res.status(418).json({ error: "number" });
    return;
  }

  const formattedNumber = pn.getNumber();

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

  if (success) {
    const docRef = admin.firestore().collection("users").doc(formattedNumber);

    // transactions baby
    try {
      const r = await admin.firestore().runTransaction(async (t) => {
        const doc = await t.get(docRef);
        const data = doc.data();

        const { alerts } = data;
        // do fancy destructuring to avoid trying to key undefined
        const count = Object.keys({ ...alerts }).length;

        if (doc.exists && count >= 5 && !(limitPrice in { ...alerts })) {
          throw "count";
        }

        const isNum = /^\d+$/gm;
        if (isNaN(parseInt(limitPrice)) || !isNum.test(limitPrice)) {
          throw "nan";
        }

        if (!cooldowns.includes(cooldown)) {
          throw "cooldown";
        }

        docRef.set(
          {
            ...(!doc.exists && {
              phone: formattedNumber,
              created: admin.firestore.FieldValue.serverTimestamp(),
            }),
            alerts: {
              ...alerts,
              [limitPrice]: {
                limitPrice: parseInt(limitPrice),
                cooldown,
                created: admin.firestore.FieldValue.serverTimestamp(),
                // lastTextTime: admin.firestore.FieldValue.serverTimestamp(),
              },
            },
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });
      res.status(200).json({ error: false });
    } catch (e) {
      res.status(418).json({ error: true });
    }

    // res.status(200).json({ error: false });
    // Teapot. Sorry!
  } else {
    res.status(418).json({ error: "captcha" });
  }
}
