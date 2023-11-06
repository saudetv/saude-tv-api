// ContentsService.js

const AWS = require("aws-sdk");
const Service = require("../../service"); // Atualize o caminho conforme necessário
const Model = require("../../../models/Content"); // Atualize o caminho conforme necessário
const TerminalModel = require("../../../models/Terminal"); // Atualize o caminho conforme necessário
const Entity = "content";
const mongoose = require("mongoose"); // Importe mongoose

class ContentsService extends Service {
  constructor() {
    super(Entity);

    // Configure o AWS com as suas credenciais
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this.s3 = new AWS.S3();
  }

  store = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const customerId = req.user.customer._id;
      const terminals = req.body.terminals;
      const fileNames = req.body.fileNames;
      let contents = [];
      let signedUrls = [];

      if (!Array.isArray(terminals)) {
        throw new Error("terminals deve ser um array.");
      }

      if (!Array.isArray(fileNames)) {
        throw new Error("fileNames deve ser um array.");
      }

      for (const name of fileNames) {
        const body = { ...req.body, name };
        const content = await Model.create([body], { session });

        contents.push(content[0]); // Como o resultado de Model.create é um array

        // Gerar URL assinada para o vídeo
        const videoUrl = await this.generatePresignedUrls(
          name,
          customerId,
          content[0]._id,
          "video"
        );

        // Gerar URL assinada para a thumbnail
        const thumbnailUrl = await this.generatePresignedUrls(
          "thumb.jpg", // Nome da thumbnail
          customerId,
          content[0]._id,
          "thumbnail"
        );

        // Criar um objeto com ambas as URLs
        const urls = {
          video: videoUrl,
          thumbnail: thumbnailUrl,
        };
        signedUrls.push(urls);

        // Formular URL final do vídeo
        const finalVideoUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/contents/${customerId}/${content[0]._id}.mp4`;
        content[0].file = finalVideoUrl;

        // Formular URL final da thumbnail
        const finalThumbnailUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/contents/${customerId}/${content[0]._id}/thumb.jpg`;
        content[0].thumbnail = finalThumbnailUrl;

        await content[0].save({ session });

        // Adicionar o content aos terminais
        for (const element of terminals) {
          const terminal = await TerminalModel.findById(element);
          if (terminal) {
            terminal.contents.push(content[0]._id);
            await terminal.save({ session });
          }
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.json({ contents, signedUrls });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error("Erro no método store:", error);
      res.status(500).send("Erro ao processar sua solicitação.");
    }
  };

  generatePresignedUrls = async (
    file,
    customerId,
    contentId,
    fileType // Adicionar um novo parâmetro para tipo de arquivo
  ) => {
    try {
      const s3Params = {
        Bucket: process.env.AWS_BUCKET,
        Key: "",
        Expires: 200,
      };

      if (fileType === "video") {
        s3Params.Key = `contents/${customerId}/${contentId}.mp4`;
        s3Params.ContentType = "video/mp4";
      } else if (fileType === "thumbnail") {
        s3Params.Key = `contents/${customerId}/${contentId}/thumb.jpg`;
        s3Params.ContentType = "image/jpeg";
      }

      return new Promise((resolve, reject) => {
        this.s3.getSignedUrl("putObject", s3Params, (err, url) => {
          if (err) {
            reject(err);
          } else {
            resolve({ file, signedUrl: url });
          }
        });
      });
    } catch (err) {
      console.error("Erro ao gerar URLs assinadas", err);
    }
  };
}

module.exports = ContentsService;
