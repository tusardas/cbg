Mongodb start command:
mongod --config="D:\e\mongodb-win32-x86_64-2008plus-2.5.1\mongod.conf"


Enable Authentication:
1) Start mongod without 'auth=true'

2) connect to database in console using 'mongo'

3) Create system administrator;
use admin;
show users; //this should give empty set, if not delete users
db.removeUser('username');
db.addUser('adminuser', 'admin123');

4) Create administrator for single db:
use cbg;
db.addUser('cbguser', 'cbg123');

Conncet to mongodb:
mongo localhost:27017/cbg -u cbguser -p


Store cricketers data:
mongoimport -d cbg -c cards --type csv --file "D:\e\funspace\nodeprograms\cbg\Book1.csv" --headerline -u cbguser -p

Update cards with random number for shuffling properly from database login:
db.cards.dropIndex( { shuffle: '2d' } );
db.cards.find({shuffle: {$exists : false }}).forEach(function(cards) { db.cards.update({_id: cards._id}, {$set: {shuffle: [Math.random(), 0]}}); });
db.cards.ensureIndex( { shuffle: '2d' } );
db.cards.find( { shuffle : { $near : [Math.random(), 0] } } ).limit(2);

starting the node server:
node "D:\e\funspace\nodeprograms\cbg\server.js"
