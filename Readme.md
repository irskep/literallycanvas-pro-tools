# Making the demo work

1. Clone this repository.
2. `git submodule update --init`
3. `make copyimages`
4. Open Readme.html

# Usage

```javascript
// addToDefaultTools takes LC namespace arg for forward compatibility with
// 0.4.12 (CommonJS support).
require('lc-pro-tools').tools.addToDefaultTools(LC);

LC.init(
  document.getElementById('lc-container'),
  {imageURLPrefix: "my/image/path"});
```

Or:

```javascript
const LCProTools = require('lc-pro-tools');

LC.init(
  document.getElementById('lc-container'), {
    imageURLPrefix: "my/image/path",
    tools: [
      LC.tools.Pencil,
      LC.tools.Eraser,
      LC.tools.Line,
      LC.tools.Rectangle,
      LC.tools.Ellipse,
      LC.tools.Text,
      LC.tools.Polygon,
      LCProTools.tools.PaintBucket,
      LCProTools.tools.Spraypaint,
      LC.tools.Pan
    ]
  });
```
