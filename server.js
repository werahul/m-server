import express from "express";
import { json } from "express";
import axios from "axios";
// import { PORT } from "dotenv";
import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";
import cors from "cors";
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use(cors());

let imageID = null;

app.post("/api/image-url", async (req, res) => {
  try {
    if (!imageID) {
      const form = new FormData();
      form.append("file", fs.createReadStream("./Melange_wapp.jpeg"));
      console.time("Image ID")
      const { data } = await axios.post(
        `https://pre-prod.cheerio.in:3443/direct-apis/v1/whatsapp/media-id`,
        form,
        {
          headers: {
            "x-api-key":
              "7ba2af64716abcd43b107ef9d2fff8e4e5eeffcc606826a1220b240213922505",
          },
        }
      );
      imageID = data.data.id;
    }
    console.timeEnd("Image ID")
    console.time("Response")
    const { name, phone } = req.body;



    const apiKey =
      "7ba2af64716abcd43b107ef9d2fff8e4e5eeffcc606826a1220b240213922505";

    const apiUrl =
      "https://pre-prod.cheerio.in:3443/direct-apis/v1/whatsapp/template/send";

    const headers = {
      "x-api-key": apiKey,
    };

    let obj = {
      to: phone,
      data: {
        // name: "incoming_lead_website",
        name: "whatsapp_final_template",
        language: {
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: {
                  id: imageID,
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: name,
              },
            ],
          },
        ],
      },
    };

    // console.log(obj);

    axios.post(apiUrl, obj, { headers }).catch((error) =>{
      console.log({ error });
    })
    console.timeEnd("Response")
    res.status(200).json({
      data: {},

      message: "Success",
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
