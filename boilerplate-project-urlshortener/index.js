require('dotenv').config();
const express = require('express');
const parser = require('body-parser')
const cors = require('cors');
const app = express();
const links = []
const dns = require('dns')

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
  let url
  if(url.startsWith("https://")) {url = originalUrl.slice(8)}
  dns.lookup(url, (err)=>{
    if(err == null){
      links.push(url)
      res.json({"original_url" : url, short_url : links.length})
    }
    else{
      res.json({"error" : 'invalid url'})
    }
  })
})

app.get('/api/shorturl/:shortUrl?', (req, res)=>{
  const shortUrl = req.params.shortUrl
  if(links.length < Number(shortUrl)) return
  res.redirect("https://" + links[Number(shortUrl) - 1])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
