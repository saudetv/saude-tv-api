const Model = require("../../models/ContentViewLog");
const Service = require("../service");
const Entity = "contentViewLog";
const mongoose = require("mongoose");

class ContentViewLogs extends Service {
  constructor() {
    super(Entity, Model);
  }

  report = async () => {
    try {
      const result = await Model.aggregate([
        {
          $group: {
            _id: {
              terminal: "$terminal",
              content: "$content",
            },
            count: { $sum: 1 },
          },
        },
      ]);

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // Modificado para agrupar por terminal e contar conteúdos únicos
  getLogsByContentId = async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;

      // Converte startDate e endDate para objetos Date do JavaScript
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Ajusta para o final do dia

      const contentId = mongoose.Types.ObjectId(id);

      const result = await Model.aggregate([
        {
          $match: {
            content: contentId,
            createdAt: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $lookup: {
            from: "terminals", // Nome da coleção de terminais no MongoDB
            localField: "terminal",
            foreignField: "_id",
            as: "terminal_info",
          },
        },
        {
          $unwind: "$terminal_info", // Desagrega o array para poder utilizar os campos dos terminais
        },
        {
          $group: {
            _id: "$terminal",
            terminalName: { $first: "$terminal_info.name" }, // Assume que cada terminal tem um nome único
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            terminal: "$_id",
            terminalName: 1,
            count: 1,
          },
        },
      ]);

      res.json(result);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while fetching the logs." });
    }
  };
  // Método modificado para incluir filtragem por data
  getTotalViewsAndTerminals = async (req, res) => {
    try {
      const { id } = req.params; // ID do conteúdo
      const { startDate, endDate } = req.query; // Parâmetros de data recebidos na query

      // Converter as strings de data para objetos Date
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Ajustar para o final do dia

      const contentId = mongoose.Types.ObjectId(id);

      const matchConditions = {
        content: contentId,
        createdAt: { $gte: start, $lte: end }, // Filtrar dentro do intervalo de datas
      };

      const result = await Model.aggregate([
        {
          $match: matchConditions,
        },
        {
          $group: {
            _id: null, // Agrupar todos os documentos que passam pelo $match
            totalViews: { $sum: 1 }, // Contar o total de documentos (exibições)
            uniqueTerminals: { $addToSet: "$terminal" }, // Coletar IDs únicos de terminais
          },
        },
        {
          $project: {
            _id: 0, // Remover campo _id do resultado
            totalViews: 1, // Total de exibições do conteúdo
            totalUniqueTerminals: { $size: "$uniqueTerminals" }, // Contar o número de terminais únicos
          },
        },
      ]);

      // Verificar se o resultado está vazio e ajustar a resposta conforme necessário
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({
          message:
            "Content not found or has no views in the specified date range.",
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while fetching the view data." });
    }
  };

  getViewsByInterval = async (req, res) => {
    try {
      const { id } = req.params; // ID do conteúdo
      const { startDate, endDate, rangeType } = req.query; // Parâmetros de data e tipo de intervalo

      const contentId = mongoose.Types.ObjectId(id);
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Definir a expressão de agrupamento baseada no rangeType
      let groupByExpression = {};
      switch (rangeType) {
        case "month":
          groupByExpression = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          };
          break;
        case "week":
          groupByExpression = {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          };
          break;
        // Adicione mais casos conforme necessário
      }

      const aggregationPipeline = [
        {
          $match: {
            content: contentId,
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: groupByExpression,
            views: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            data: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                {
                  $cond: [
                    { $lte: ["$_id.month", 9] },
                    { $concat: ["0", { $toString: "$_id.month" }] },
                    { $toString: "$_id.month" },
                  ],
                },
              ],
            },
            views: 1,
          },
        },
        {
          $sort: { data: 1 },
        },
      ];

      const result = await Model.aggregate(aggregationPipeline);
      res.json(result);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while fetching the data." });
    }
  };

  getViewsByContentAndRegion = async (req, res) => {
    try {
      const { id } = req.params; // ID do conteúdo
      const contentId = mongoose.Types.ObjectId(id);
      const { startDate, endDate } = req.query; // Parâmetros de data

      const start = new Date(startDate);
      const end = new Date(endDate);

      const result = await Model.aggregate([
        {
          $match: {
            content: contentId,
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $lookup: {
            from: "terminals", // O nome da coleção de terminais
            localField: "terminal", // Campo em ContentViewLog correspondente ao ID do terminal
            foreignField: "_id", // Campo em Terminal que corresponde ao ID
            as: "terminal_info",
          },
        },
        {
          $unwind: "$terminal_info", // Desagregar o array resultante do lookup
        },
        {
          $group: {
            _id: "$terminal_info.location.state", // Agrupar por estado
            views: { $sum: 1 }, // Contar as visualizações
          },
        },
        {
          $project: {
            _id: 0,
            state: "$_id", // Renomear _id para 'state'
            views: 1,
          },
        },
      ]);

      if (!result || result.length === 0) {
        return res.status(404).json({
          message:
            "No views found for this content in the specified date range.",
        });
      }

      res.json(result);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while fetching the data." });
    }
  };

  getViewsByTerminalAndDay = async (req, res) => {
    try {
      const { id } = req.params; // ID do conteúdo
      const contentId = mongoose.Types.ObjectId(id);
      const { startDate, endDate } = req.query; // Parâmetros de data

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Ajustar para o final do dia

      const result = await Model.aggregate([
        {
          $match: {
            content: contentId,
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $lookup: {
            from: "terminals", // Supondo que 'terminals' é o nome da coleção de terminais
            localField: "terminal",
            foreignField: "_id",
            as: "terminal_info",
          },
        },
        {
          $unwind: "$terminal_info", // Desagrega o array para poder acessar as informações dos terminais
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              terminal: "$terminal",
              terminalName: "$terminal_info.name",
            },
            views: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.date",
            terminais: {
              $push: {
                terminal: "$_id.terminal",
                terminalName: "$_id.terminalName",
                views: "$views",
              },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            terminais: 1,
          },
        },
      ]);

      if (!result || result.length === 0) {
        return res
          .status(404)
          .json({
            message:
              "No views found for this content in the specified date range.",
          });
      }

      res.json(result);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while fetching the data." });
    }
  };
}

module.exports = ContentViewLogs;
