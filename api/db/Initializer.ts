import { createConnection as createDbConnection, getConnection, ConnectionOptions, Connection } from 'typeorm';
import * as config from 'config';
import * as bcrypt from "bcryptjs";
import User from "../models/User";
import Contact from "../models/Contact";

export default class DbInitializer {
  static async init() {
    let options = config.get("database") as ConnectionOptions;
    try {
      let connection = await createDbConnection(options);
      if (config.get("database.seed_test_data")) {
        this.seedData();
      }
    } catch (err) {
      console.log(`Error initializing the database: ${err}`);
      throw err;
    }
  }

  private static async seedData() {
    let connection = getConnection();

    // Create test user
    let email = "user@test.com";
    let password = "P2ssw0rd!";

    let user1 = new User()
    user1.email = email;
    let hashedPassword = await bcrypt.hash(password, 3);
    user1.hashedPassword = hashedPassword;
    user1.emailConfirmed = true;

    let userRepo = connection.getRepository(User);
    await userRepo.persist(user1);

    // Create test contacts
    let contact1 = new Contact();
    contact1.id = 1;
    contact1.lastName = "Finkley";
    contact1.firstName = "Adam";
    contact1.phone = "555-555-5555";
    contact1.email = "adam@somewhere.com";

    let contact2 = new Contact();
    contact2.id = 2;
    contact2.lastName = "Biles";
    contact2.firstName = "Steven";
    contact2.phone = "555-555-5555";
    contact2.email = "sbiles@somewhere.com";

    let contactRepo = connection.getRepository(Contact);
    await contactRepo.persist(contact1);
    await contactRepo.persist(contact2);
  }
}
