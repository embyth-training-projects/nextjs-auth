import { hashPassword } from "../../../helpers/auth";
import { connectToDatabase } from "../../../helpers/db";

async function handler(req, res) {
  if (req.method !== `POST`) {
    res.status(405).json({ message: `Not supported request method!` });
    return;
  }

  const { email, password } = req.body;

  if (
    !email ||
    !email.includes(`@`) ||
    !password ||
    password.trim().length < 6
  ) {
    res.status(422).json({ message: `Invalid input data` });
    return;
  }

  const client = await connectToDatabase();

  const db = client.db();

  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    res.status(422).json({ message: `User exists already!` });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection("users").insertOne({
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: `User created!` });
  client.close();
}

export default handler;
