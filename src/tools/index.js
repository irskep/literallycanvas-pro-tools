const TOOLS = {
  PaintBucket: require("./PaintBucket"),
  SpraypaintTool: require("./SpraypaintTool"),

  allTools: [
    require("./SpraypaintTool"),
    require("./PaintBucket")
  ],

  addToDefaultTools: function(LC) {
    Array.prototype.push.apply(LC.defaultTools, TOOLS.allTools);
  }
}

module.exports = TOOLS;
