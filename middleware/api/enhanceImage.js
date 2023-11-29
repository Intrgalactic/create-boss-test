const asyncHandler = require("express-async-handler")
const Replicate = require('replicate');
const sendToStorage = require("./sendToStorage");
const generateRandomFileName = require("../utils/generateFileName");
const blobUtil = require('blob-util');
const sharp = require('sharp');

const enhanceImage = (storage) => {
  return asyncHandler(async (req, res) => {
    try {
      var { upscale, denoise, deblur, lowLightEnhancement, faceEnhancement } = req.body;
      var imageFile = req.file;
      var editedImageFile;
      var finalBuffer;
      const imgBase64 = await detectHeavyImage(imageFile);
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_KEY
      })
      const optionsArr = [
        {
          allowed: ["enable"],
          value: denoise,
          editFunc: denoiseImage
        },
        {
          allowed: ["enable"],
          value: deblur,
          editFunc: deblurImage
        },
        {
          allowed: ["enable"],
          value: lowLightEnhancement,
          editFunc: lowLightEnhanceImage
        },
        {
          allowed: ["2x", "3x", "4x"],
          value: upscale,
          editFunc: upscaleImage
        },  
        {
          allowed: ["enable"],
          value: faceEnhancement,
          editFunc: faceEnhanceImage
        }
      ]
      for (const option of optionsArr) {
        for (const [key, value] of Object.entries(option)) {
          if (key === "allowed") {
            for (const allowedValue of value) {
              if (allowedValue === option.value) {
                editedImageFile = await option.editFunc(replicate, `data:image/jpeg;base64,${imgBase64}`, option.value);
              }
            }
          }
        }
      }
      const imageBlobFromUrl = await fetch(editedImageFile).then(async (response) => {
        const buffer = Buffer.from(await response.arrayBuffer());
        finalBuffer = buffer;
        const blob = blobUtil.createBlob([buffer], { type: response.headers.get("content-type") });
        return blob;
      });
      const imageFileName = generateRandomFileName(imageBlobFromUrl.type.split("/").pop());
      await sendToStorage(imageFileName, finalBuffer, imageBlobFromUrl.type, storage);
      res.status(200).send(JSON.stringify({ fileName: imageFileName.substring(0, imageFileName.lastIndexOf('.')) }));
    }
    catch (err) {
      console.log(err);
    }
  })

}

module.exports = enhanceImage;

async function detectHeavyImage(imageFile) {
  return sharp(imageFile.buffer)
    .metadata()
    .then(async metadata => {
      if (metadata.width > 1024) {
        console.log('siemanko');
        const resizeImageBuffer = await sharp(imageFile.buffer)
          .resize(1024, null, {
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          .toBuffer();
        return resizeImageBuffer;
      }
      else {
        return imageFile.buffer;
      }
    }).toString("base64");
}

async function upscaleImage(replicate, image, upscale) {
  const output = await replicate.run(
    "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
    {
      input: {
        image: image,
        codeformer_fidelity: 0.8,
        background_enhance: true,
        face_upsample: false,
        upscale: parseInt(upscale[0])
      }
    }
  );
  console.log(output);
  return output;
}

async function denoiseImage(replicate, image) {
  const output = await replicate.run(
    "google-research/maxim:494ca4d578293b4b93945115601b6a38190519da18467556ca223d219c3af9f9",
    {
      input: {
        model: "Image Denoising",
        image: image,
      }
    }
  );
  console.log(output);
  return output;
}

async function lowLightEnhanceImage(replicate, image) {
  console.log("isema");
  const output = await replicate.run(
    "sczhou/lednet:2349ec8d0a40cf4ca6ba62fa2d8239e14cd2e1535e4aafefabe09dd6b7992dd5",
    {
      input: {
        model: "lednet_retrain",
        image: image,
      }
    }
  );
  console.log(output);
  return output;
}

async function deblurImage(replicate, image) {
  const output = await replicate.run(
    "google-research/maxim:494ca4d578293b4b93945115601b6a38190519da18467556ca223d219c3af9f9",
    {
      input: {
        model: "Image Deblurring (REDS)",
        image: image
      }
    }
  );
  console.log(output);
  return output;
}

async function faceEnhanceImage(replicate, image) {
  const output = await replicate.run(
    "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
    {
      input: {
        image: image,
        face_upsample: true,
        upscale: 1,
        background_enhance: false
      }
    }
  );
  console.log(output);
  return output;
}