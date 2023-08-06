const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker/locale/pt_BR");
const Customer = require("../models/Customer"); // Atualize com o caminho correto para o seu modelo Customer
const User = require("../models/User"); // Atualize com o caminho correto para o seu modelo Customer

mongoose
  .connect(
    "mongodb+srv://saude-tv:w99qgkLoqxa0qZb0@kokua.g8cjh.mongodb.net/saude-tv-development?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    faker.helpers.arrayElement(randomIds);
    seedDatabase();
  })
  .catch((err) => {
    console.error("Connection error", err);
  });
const randomIds = Array.from({ length: 15 }).map(() =>
  mongoose.Types.ObjectId()
);
const generateRandomContract = () => ({
  company: faker.helpers.arrayElement(randomIds),
  terminals: faker.number.int(10),
  section: faker.commerce.department(),
  startDate: faker.date.past(1),
  dueDate: faker.date.future(1),
  inserts: faker.number.int(10),
  unitValue: faker.commerce.price(),
  discount: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
  signed: faker.helpers.arrayElement([true, false]),
  notes: faker.lorem.sentence(),
  payment: {
    type: faker.helpers.arrayElement([
      "installment",
      "bankSlip",
      "pix",
      "cash",
      "creditCard",
    ]),
    installments: Array.from({ length: 5 }).map((_, index) => ({
      paid: faker.helpers.arrayElement([true, false]),
      installment: index + 1, // Isso garantirá que os valores sejam 1, 2, 3, 4, 5
      dueDate: faker.date.future(),
      receipt: faker.finance.transactionType(),
      value: faker.commerce.price(),
    })),
  },
});

const generateRandomCustomer = () => ({
  corporateName: faker.company.name(),
  fantasyName: faker.company.buzzPhrase(),
  cnpj: faker.finance.creditCardNumber(), // não é um CNPJ real, apenas para ilustração
  acting: faker.commerce.department(),
  email: faker.internet.email(),
  address: faker.address.streetAddress(),
  number: faker.number.int(1000),
  complement: faker.address.secondaryAddress(),
  district: faker.address.county(),
  city: faker.address.city(),
  cep: faker.address.zipCode(),
  state: faker.address.stateAbbr(),
  cellPhone: faker.phone.number(),
  logo: faker.internet.avatar(),
  primaryColor: faker.internet.color(),
  secondaryColor: faker.internet.color(),
  type: faker.helpers.arrayElement([
    "SUBSCRIBERS",
    "FRANCHISEE",
    "ADVERTISERS",
  ]),
  active: true,
  contracts: Array.from({ length: 5 }).map(() =>
    generateRandomContract(randomIds)
  ),
  subscribers: [
    faker.helpers.arrayElement(randomIds),
    faker.helpers.arrayElement(randomIds),
  ],
});

const seedData = Array.from({ length: 15 }).map(generateRandomCustomer);

const seedDatabase = async () => {
  await Customer.deleteMany({});

  const initialCustomers = Array.from({ length: 15 }).map(() => ({
    corporateName: faker.company.name(),
    fantasyName: faker.company.buzzPhrase(),
    // ... [outros campos, mas sem subscribers e contracts]
  }));
  const savedCustomers = await Customer.insertMany(initialCustomers);

  const realIds = savedCustomers.map((customer) => customer._id);
  const customersWithValidReferences = Array.from({ length: 15 }).map(() =>
    generateRandomCustomer(realIds)
  );

  const realCustomers = await Customer.insertMany(customersWithValidReferences);

  // Aqui é onde atualizamos o usuário
  const chosenCustomer = faker.helpers.arrayElement(realCustomers);
  console.log(chosenCustomer);
  await User.updateOne(
    { email: "vitorg.dev@gmail.com" },
    { $set: { customer: chosenCustomer._id } }
  );

  console.log("Data seeded!");
  mongoose.connection.close();
};
