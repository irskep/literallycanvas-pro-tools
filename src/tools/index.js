module.exports = {
  SpraypaintTool: require("./SpraypaintTool"),

  addToDefaultTools: function(LC) {
    Array.prototype.push.apply(LC.defaultTools, [
        require("./SpraypaintTool")
    ]);
  }
}
