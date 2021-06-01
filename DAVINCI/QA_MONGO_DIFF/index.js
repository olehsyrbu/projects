const { inspect } = require('util');
const { MongoClient } = require('mongodb');

// const MONGO_DB = 'mongodb://davinci-user:iwP5jFAvALWlRMCt@cluster0-shard-00-00-nij10.mongodb.net:27017,cluster0-shard-00-01-nij10.mongodb.net:27017,cluster0-shard-00-02-nij10.mongodb.net:27017/davinci-prod?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'

const MONGO_DB = 'mongodb://davinci-qa:3hVvTy6PLvyhRB8kAOvw@qa-cluster-shard-00-00-nij10.mongodb.net:27017,qa-cluster-shard-00-01-nij10.mongodb.net:27017,qa-cluster-shard-00-02-nij10.mongodb.net:27017/davinci-qa?ssl=true&replicaSet=qa-cluster-shard-0&authSource=admin';

// const MONGO_DB = 'mongodb://davinciuser:Q1w2e3r4t5y6@stage-api.davincits.com:27017/davinci';

const MONGO_DB_ANALYTICS_URI = 'mongodb://davinci-qa:3hVvTy6PLvyhRB8kAOvw@qa-cluster-shard-00-00-nij10.mongodb.net:27017,qa-cluster-shard-00-01-nij10.mongodb.net:27017,qa-cluster-shard-00-02-nij10.mongodb.net:27017/analytics-qa?ssl=true&replicaSet=qa-cluster-shard-0&authSource=admin';

const client = new MongoClient(MONGO_DB, { useNewUrlParser: true });
client.once('open', () => console.log('client connected'));
client.connect().then(async () => {
  const changeStream = client.db()/* .collection('sessions') */.watch();
  changeStream.on('change', (next) => {
    const { _id,clusterTime, ...filtered } = next;
    console.log('\033[33m','client','\033[0m',inspect(filtered, false, null));
  });
});

const analyticsClient = new MongoClient(MONGO_DB_ANALYTICS_URI, { useNewUrlParser: true });
analyticsClient.once('open', () => console.log('analyticsClient connected'));

analyticsClient.connect().then(async () => {
  const changeStream = analyticsClient.db()/* .collection('analytics') */.watch();
  changeStream.on('change', (next) => {
    const { _id, ...filtered } = next;
    console.log('\033[33m','analyticsClient','\033[0m',inspect(filtered, false, null));
  });
});
