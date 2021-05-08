import { getSession } from "next-auth/client";

import { hashPassword, verifyPassword } from "../../../helpers/auth";
import { connectToDatabase } from "../../../helpers/db";

async function handler(req, res) {
  if (req.method !== `PATCH`) {
    res.status(405).json({ message: `Not supported request method!` });
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: `Not authenticated!` });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();

  const usersCollections = await client.db().collection(`users`);

  const user = await usersCollections.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: `User not found!` });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const isPasswordValid = await verifyPassword(oldPassword, currentPassword);

  if (!isPasswordValid) {
    res.status(422).json({ message: `Passwords doesnt match!` });
    client.close();
    return;
  }

  const newHashedPassword = await hashPassword(newPassword);

  const result = await usersCollections.updateOne(
    { email: userEmail },
    { $set: { password: newHashedPassword } }
  );

  client.close();
  res.status(200).json({ message: `Password updated!` });
}

export default handler;
