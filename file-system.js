const fs = require('fs');

var saveData = (data) => {
  var db = [];
  db = fetchData();
  db.push(data);
  fs.writeFileSync('switch-state.json', JSON.stringify(db));
};

var fetchData = () => {
    try{
     var jsonString = fs.readFileSync('switch-state.json');
     return(JSON.parse(jsonString));
     }
      catch(e) {
     return []; //Return empty array
   }
 };

module.exports = {
  saveData
}
