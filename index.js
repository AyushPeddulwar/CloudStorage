const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'myfiles'; // Change to your container name

app.use(cors());
app.use(express.static('public'));

// File upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    const blobClient = blobServiceClient.getContainerClient(containerName).getBlockBlobClient(req.file.originalname);

    try {
        await blobClient.upload(req.file.buffer, req.file.size);
        res.status(200).send({ message: 'File uploaded successfully!', fileUrl: blobClient.url });
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});