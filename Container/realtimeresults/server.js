'use strict';

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const errorHandler = require('errorhandler');
const partials = require('express-partials');
const multer = require('multer');
const upload = multer();
const fs = require('fs/promises');
const sanitizeHtml = require('sanitize-html');

// Express configuration
const app = express();
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(partials());
// app.use(express.json({ extended: false }));        // parse JSON bodies
app.use(express.json()); //Used to parse JSON bodies
// app.use(express.urlencoded({ extended: false }));  // parse URL-encoded bodies
app.use(express.urlencoded());  // parse URL-encoded bodies
app.use(errorHandler());

var unsanitizedContent = "";
var sanitizedContent = "";

app.get('/form', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.get('/', function(req, res) {
    res.setHeader("Content-Type", "text/html")
    res.send(sanitizedContent);
});

// app.get('/unsanitized', function(req, res) {
//     res.setHeader("Content-Type", "text/html")
//     res.send(unsanitizedContent);
// });

async function readFile(filename) {
    try {
        var content = await fs.readFile(filename, { encoding: 'utf8' });
    } catch (err) {
        console.log(err);
    }
    return content;
}

async function rmFile(filename) {
    await fs.rm(filename, { force: true });;
}

app.post('/upload', upload.none(), async function(req, res) {
    let filename = "";
    for (var key in req.body) {
        let terms = key.split('.');
        if (terms.length > 1) {
            if (terms[1] == 'path') {
                filename = req.body[key];
                unsanitizedContent = await readFile(filename);
                rmFile(filename)
                sanitizedContent = sanitizeHtml(unsanitizedContent, {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'head', 'html', 'body', 'style', 'title', 'nobr' ]),
                    allowedAttributes: Object.assign({}, sanitizeHtml.defaults.allowedAttributes, {
                        style: ['type'],
                        table: ['width', 'style'],
                        td: ['width', 'id', 'style'],
                        th: ['id'],
                        tr: ['id'],
                        col: ['width'],
                        div: ['id']
                    })
                });
                break;
            }
        }
    }

    res.set('Content-Type', 'text/html');
    res.send("Upload succeeded<br><br>Go back one page to return to upload form");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("server listening on port " + (process.env.PORT || 3000));
});