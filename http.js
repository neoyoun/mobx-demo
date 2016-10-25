'use strict';
let express = require('express');
let app = new express();
app.use(express.static('dist'));
app.get('/',(req,res)=>{
	res.send('index.html')
})

let server = app.listen(3000,function () {
	let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
})