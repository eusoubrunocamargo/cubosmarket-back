//importando o middleware
const processFile = require('../middleware/checkUpload');
const {format} = require("util");
const {Storage} = require("@google-cloud/storage");
const whatNodeEnv = (process.env.NODE_ENV === 'production') ? process.env.GCK :
"google-cloud-key.json";
const storage = new Storage({
    keyFilename: whatNodeEnv,
});
const BUCKET_NAME = process.env.BUCKET_NAME;
const bucket = storage.bucket(BUCKET_NAME);

const upload = async (req,res) => {
try {

    console.log("entrou no upload do back");
    await processFile(req,res);
    
    if (!req.file){
        return res.status(400).send({
            message: "Please upload a file!"
        });
    };

    const blob = bucket.file(req.file.originalname);
    //console.log(blob);

    const blobStream = blob.createWriteStream({
        resumable: false,
    });

    blobStream.on("error", (err) => {
        console.log('entrou no erro blob');
        res.status(500).send({
            message: err.message
        });
    });

    blobStream.on("finish", async (data) => {
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        console.log(publicUrl);

        try {
            await bucket.file(req.file.originalname).makePublic();
        } catch {
            return res.status(500).send({
                message:
                `Uploaded the file successfully: ${req.file.originalname},
                but public access is denied!`,
                url: publicUrl,
            });
        }

        res.status(201).send({
            message: "Uploaded!",
            url: publicUrl, 
        });
    });

    blobStream.end(req.file.buffer);

} catch (err) {

    console.log("entrou no catch do back");
    
    if(err.code == "LIMIT_FILE_SIZE"){
        return res.status(500).send({
            message: "File size cannot be larger than 2MB!",
        });
    };
    
    res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
}
};

module.exports = {
    upload,
}
 