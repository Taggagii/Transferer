//
//SERVER CODE
//
const express = require("express");
const bParser = require("body-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const { FORMERR } = require("dns");
const fs = require("fs");
const bodyParser = require("body-parser");
const serveIndex = require("serve-index");

const PORT = 8000;

const app = express();

app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: path.join(__dirname, "temp"),
}));
app.use("/files", express.static("public"));
app.use("/files", serveIndex("public"))

app.set("view engine", "ejs");


app.get('/', (req, res) => {
        res.render('index');
});

app.post("/upload", (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0)
        {
                return res.status(400).send("No files were uploaded");
        }

        let basePath = path.join(__dirname, "public", req.body.folder_name);
        if (!fs.existsSync(basePath))
                fs.mkdirSync(basePath);

        let files = req.files.target_file;
        
        if (files.length === undefined)
        {
                files.mv(path.join(basePath, files.name), (err) => {
                        if (err)
                                return res.status(500).send(err);
                        res.send("File Uploaded");
                        
                });
                return;
        }
        files.forEach(file => {
                file.mv(path.join(basePath, file.name), (err) => {
                        if (err)
                                return res.status(500).send(err);
                });
        });
        res.send("Files uploaded");
});



// app.get('/download/:path', function(req, res){
//         console.log(req.params.path);
//         const file = `${__dirname}/views/index.ejs`;
//         res.download(file); // Set disposition and send it.
// });


const server = app.listen(PORT, () => {
        console.log(`Running on http://localhost:${PORT}`);
});