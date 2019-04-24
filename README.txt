This is still work-in-progress. It is basically a card game. Similar to the one I played in my school days. Cards with pictures and attributes of wrestling superstars. Here a difference is I am using international cricket players and their attributes. We used to call this game as 'Trump Card' in my school days. Using 'MEAN' stack implementation. Follow the below steps to get started with the setup.


Mongodb start command:
mongod --config="D:\installations\mongodb-win32-x86_64-2008plus-2.5.1\mongod.conf"


Enable Authentication:
1) Start mongod without 'auth=true'

2) connect to database in console using 'mongo'
command_prompt> mongo <ENTER>

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

Update cards with random number for shuffling properly. Run queries after login into database:
db.cards.dropIndex( { shuffle: '2d' } );
db.cards.find({shuffle: {$exists : false }}).forEach(function(cards) { db.cards.update({_id: cards._id}, {$set: {shuffle: [Math.random(), 0]}}); });
db.cards.ensureIndex( { shuffle: '2d' } );
db.cards.find( { shuffle : { $near : [Math.random(), 0] } } ).limit(2);

starting the node server:
node "D:\e\funspace\nodeprograms\cbg\server.js"
