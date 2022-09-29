const express = require('express');
const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.set('view engine','ejs')
app.get('/app', function(req, res) {
    res.render('app');
  });
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`express server running on ${port}`)
})