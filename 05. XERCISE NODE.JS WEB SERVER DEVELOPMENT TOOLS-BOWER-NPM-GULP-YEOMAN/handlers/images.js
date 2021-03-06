const url = require('url')
const fs = require('fs')
const path = require('path')
const database = require('../database/database')
const qs = require('querystring')

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname.startsWith('/viewImages') && req.method === 'GET') {
    let filePath = path.normalize(
      path.join(__dirname, '../viewImages.html'))

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        })

        res.write('404 not found!')
        res.end()
        return
      }

      let queryData = qs.parse(url.parse(req.url).query)

      let allImages = database.images.getAll()

      allImages.then((images) => {
        images = JSON.parse(images)
        if (queryData.query) {
          images = images.filter(image => {
            if (image.name.toLowerCase().indexOf(queryData.query.toLowerCase()) !== -1 || image.description.toLowerCase().indexOf(queryData.query.toLowerCase()) !== -1) {
              return image.name
            }
          })
        }
        let content = ''
        for (let image of images) {
          content +=
            `<div class="image">
              <h2>${image.name}</h2>
              <img class="image-link" src="${image.link}" width="200" height='200'>
              <p>${image.description}</p>
            </div>`
        }

        let html = data.toString().replace('{***}', content)

        res.writeHead(200, {
          'Content-Type': 'text/html'
        })
        res.write(html)
        res.end()
      })
    })
  } else {
    return true
  }
}
