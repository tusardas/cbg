This is still work-in-progress. It is basically a card game. Similar to the one I played in my school days. Cards with pictures and attributes of wrestling superstars. Here a difference is I am using international cricket players and their attributes. We used to call this game as 'Trump Card' in my school days. Using 'MEAN' stack implementation. Follow the below steps to get started with the setup.


Mongodb start command:
mongod --config="D:\installations\mongodb-4.2.2\mongod.conf" --noauth

mongod.conf contains:
logpath=D:\installations\mongodb-4.2.2\log\mongod.log
dbpath=D:\installations\mongodb-4.2.2\data\db

Make sure to create these directories in your file system.

How to enable authentication in mongodb:

Mongo provides authentication out-of-the box, but you need to set it up first.

1) Start mongodb with above command - 
mongod --config="D:\installations\mongodb-4.2.2\mongod.conf" --noauth

2) connect to database in console using 'mongo'
command_prompt>mongo <ENTER>

3) Create system administrator;
use admin;
show users; //this should give empty set, if not delete users
db.createUser( {user:"adminuser", pwd:"admin123", roles:["root"]} );

4) Create administrator for single db:
use cbg;
db.createUser( {user:"cbguser", pwd:"cbg123", roles:["dbAdmin"]} );

Conncet to mongodb:
mongo localhost:27017/cbg -u cbguser -p


Store cricketers data:
mongoimport -d cbg -c cards --type csv --file "D:\e\funspace\nodeprograms\cbg\Book1.csv" --headerline

Update cards with random number for shuffling properly. Run queries after login into database:
db.cards.dropIndex( { shuffle: '2d' } );
db.cards.find({shuffle: {$exists : false }}).forEach(function(cards) { db.cards.update({_id: cards._id}, {$set: {shuffle: [Math.random(), 0]}}); });
db.cards.ensureIndex( { shuffle: '2d' } );
db.cards.find( { shuffle : { $near : [Math.random(), 0] } } ).limit(2).pretty();

starting the node server:
node "D:\e\funspace\nodeprograms\cbg\server.js"
