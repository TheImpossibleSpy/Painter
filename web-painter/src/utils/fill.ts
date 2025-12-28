export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: string,
  width: number,
  height: number
) {
  // Convert hex color to RGBA
  const r = parseInt(fillColor.slice(1, 3), 16);
  const g = parseInt(fillColor.slice(3, 5), 16);
  const b = parseInt(fillColor.slice(5, 7), 16);
  const a = 255;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Get starting pixel color
  const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;
  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];
  const startA = data[startPos + 3];

  // If trying to fill with the same color, do nothing
  if (startR === r && startG === g && startB === b && startA === a) {
    return;
  }

  const stack = [[Math.floor(startX), Math.floor(startY)]];

  while (stack.length) {
    const pop = stack.pop();
    if (!pop) continue;

    let [x, y] = pop;
    let pixelPos = (y * width + x) * 4;

    while (y >= 0 && matchColor(data, pixelPos, startR, startG, startB, startA)) {
      y--;
      pixelPos -= width * 4;
    }

    pixelPos += width * 4;
    y++;
    let reachLeft = false;
    let reachRight = false;

    while (y < height && matchColor(data, pixelPos, startR, startG, startB, startA)) {
      colorPixel(data, pixelPos, r, g, b, a);

      if (x > 0) {
        if (matchColor(data, pixelPos - 4, startR, startG, startB, startA)) {
          if (!reachLeft) {
            stack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < width - 1) {
        if (matchColor(data, pixelPos + 4, startR, startG, startB, startA)) {
          if (!reachRight) {
            stack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      y++;
      pixelPos += width * 4;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function matchColor(
  data: Uint8ClampedArray,
  pos: number,
  r: number,
  g: number,
  b: number,
  a: number
) {
  return (
    data[pos] === r &&
    data[pos + 1] === g &&
    data[pos + 2] === b &&
    data[pos + 3] === a
  );
}

function colorPixel(
  data: Uint8ClampedArray,
  pos: number,
  r: number,
  g: number,
  b: number,
  a: number
) {
  data[pos] = r;
  data[pos + 1] = g;
  data[pos + 2] = b;
  data[pos + 3] = a;
}
