require('dotenv').config();
const express = require('express');
const parser = require('body-parser')
const cors = require('cors');
const app = express();
const links = []
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(parser.urlencoded({extended : false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res)=>{
  let originalUrl = req.body.url
  let hostname
  if(originalUrl.startsWith("https://")) {hostname = originalUrl.slice(8)}
  else {res.json({"error" : 'invalid url'}); return}
  if(hostname.includes("/")){hostname = hostname.slice(0, hostname.indexOf("/"))}
  dns.lookup(hostname, (err, address)=>{
    if(err){
      console.log(err)
      res.json({"error" : 'invalid url'})
    }
    else{
      links.push(originalUrl)
      res.json({original_url : originalUrl, short_url : links.length})
    }
  })
})

app.get('/api/shorturl/:shortUrl?', (req, res)=>{
  const shortUrl = req.params.shortUrl
  if(links.length < Number(shortUrl)) return
  res.redirect(links[Number(shortUrl) - 1])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
