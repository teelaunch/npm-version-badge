// # npm-version-badge

var request = require('request')

var express = require('express')
  , app     = express()
app.get('/:user/:repo.svg', getBadge)
app.get('*', redirect)
app.listen(8083)

function redirect(req, res) {
  res.redirect('https://github.com/teelaunch/npm-version-badge#npm-version-badge')
}

function getBadge(req, res, next) {
  if (typeof req.params.user !== 'string' || req.params.user === '')
    return next(new Error('user param not specified'))
  if (typeof req.params.repo !== 'string' || req.params.repo === '')
    return next(new Error('repo param not specified'))
  // crawl the package.json file in the root
  // e.g. https://raw.github.com/silvinci/component-badge/master/package.json
  var url = 'https://raw.github.com/' + req.params.user + '/' + req.params.repo + '/master/package.json'
  request.get({ url: url, json: true }, function(err, response, body) {
    if (err) return next(err)
    if (typeof body.version !== 'string' || body.version === '')
      return next(new Error('version not found in package.json'))
    res.type('svg')
    res.set('Cache-Control', 'no-cache');
    res.send('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="10"><text y="9" font-size="12" fill="#2d2d2d" font-family="Arial">v' + body.version + '</text></svg>')
  })
}
