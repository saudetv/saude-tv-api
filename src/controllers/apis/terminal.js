const express = require("express");
const TerminalServiceClass = require("../../services/terminals");
const terminalService = new TerminalServiceClass();
const authMiddleware = require("../../middleware/auth");
const checkDownloadLimit = require("../../middleware/checkDownloadLimit");
let router = express.Router();

router.get("/", terminalService.index);
router.get("/terminals-by-week", async (req, res) => {
  res.json(await terminalService.terminalsByWeek());
});
router.get("/cities", async (req, res) => {
  res.json(await terminalService.getCities());
});

router.get("/states", async (req, res) => {
  res.json(await terminalService.getStates());
});
router.get("/:id", terminalService.show);
router.post("/", authMiddleware, terminalService.store);
router.put("/:id", terminalService.update);
router.delete("/:id", terminalService.destroy);
router.patch("/:id", terminalService.update);
router.post("/:id/copy", terminalService.copy);
router.post("/:id/alive", authMiddleware, terminalService.alive);
router.post(
  "/:id/contents/:idContent/display",
  authMiddleware,
  terminalService.display
);
router.get(
  "/:id/contents/:idContent",
  authMiddleware,
  checkDownloadLimit,
  terminalService.showContent
);

module.exports = router;
