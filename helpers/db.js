import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  return await MongoClient.connect(
    `mongodb+srv://AuthAdmin:tAGyku0vVfW4jylx@cluster0.kz2sc.mongodb.net/auth-demo?retryWrites=true&w=majority`
  );
}
