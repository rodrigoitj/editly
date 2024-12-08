import chalk from 'chalk';
import editly from '../index.js';
import { registerFont } from '../sources/fabric.js';
import EventEmitter from 'node:events';

registerFont('./examples/assets/Patua_one/PatuaOne-Regular.ttf', {
  family: 'Patua_One',
});

async function func({ width, height, fabric }) {
  async function onRender(progress, canvas) {
    canvas.backgroundColor = 'hsl(33%, 100%, 50%)';

    const text = new fabric.Text(`PROGRESS\n${Math.floor(progress * 100)}%`, {
      originX: 'center',
      originY: 'center',
      left: width / 2,
      top: (height / 2) * (1 + (progress * 0.1 - 0.05)),
      fontSize: 16,
      textAlign: 'center',
      fill: 'white',
    });

    canvas.add(text);
  }

  function onClose() {
    // Cleanup if you initialized anything
  }

  return { onRender, onClose };
}
async function funcTitle({ width, height, fabric }) {
  async function onRender(progress, canvas) {
    function drawTextWithBackground(options) {
      const {
        text,
        fontFamily = 'Arial',
        fontSize = 40,
        textColor = 'black',
        backgroundColor = 'blue',
        cornerRadius = 10,
        padding = 10,
        angle = 0,
        top = 0,
        lineHeight = 1,
        textWidth = canvas.width * 0.9,
      } = options;

      // Create the text object
      const textObj = new fabric.Textbox(text, {
        fontFamily,
        fontSize,
        fill: textColor,
        // backgroundColor: 'blue',
        lineHeight,
        textAlign: 'center',
        originX: 'center',
        originY: 'top',
        width: textWidth,
        top,
      });
      // Calculate and log the line height for each line
      const actualLineHeight = textObj.fontSize * textObj.lineHeight;
      // Optionally, log each line's top position
      const backgrounds = [];
      let currentTopOffset = 0;
      for (let i = 0; i < textObj._textLines.length; i++) {
        const lineWidth = textObj.getLineWidth(i);
        const thisLineHeight = textObj.getHeightOfLine(i);
        // const lineTop = topOffset + i * actualLineHeight;
        const backgroundObj = new fabric.Rect({
          width: lineWidth + padding * 2,
          height: actualLineHeight + padding,
          fill: backgroundColor,
          rx: cornerRadius, // Rounded corners
          ry: cornerRadius,
          originX: 'center',
          originY: 'top',
          left: 0,
          top: currentTopOffset + top - padding / 2, //lineTop + i,
        });
        backgrounds.push(backgroundObj);
        currentTopOffset += thisLineHeight;
      }
      const group = new fabric.Group([...backgrounds, textObj], {
        left: canvas.width / 2,
        top,
        originX: 'center',
        originY: 'top',
        // backgroundColor: "yellow",
        angle,
      });
      // Return group for future updates
      return group;
    }

    const textGroup = drawTextWithBackground({
      text: `long long text long long text long long text long long text with ${Math.floor(
        progress * 100
      )}%`,
      fontFamily: 'Patua_One',
      fontSize: 20,
      textColor: 'white',
      backgroundColor: 'black',
      top: 10,
      cornerRadius: 10,
      padding: 10,
      angle: -2,
    });

    canvas.add(textGroup);
    // canvas.backgroundColor = 'hsl(33%, 100%, 50%)';
  }

  function onClose() {
    // Cleanup if you initialized anything
  }

  return { onRender, onClose };
}

const events = new EventEmitter();
events.on('data', (data) => {
  console.log(chalk.yellow(data));
});
events.on('progress', ({ percentDone }) => {
  percentDone && console.log(chalk.green(percentDone + '%'));
});
events.on('exit', (code) => {
  console.log(chalk.red(code));
});
events.on('end', (end) => {
  console.log(chalk.blue(end));
});
editly(
  {
    fast: true,
    // enableFfmpegLog: true,
    // verbose: true,
    outPath: './customFabric.mp4',
    clips: [
      // { duration: 2, layers: [{ type: 'fabric', func }] },
      {
        duration: 5,
        layers: [
          { type: 'rainbow-colors' },
          { type: 'fabric', func: funcTitle },
        ],
      },
      // {
      //   duration: 5,
      //   layers: [
      //     { type: 'rainbow-colors' },
      //     { type: 'news-title', text: 'News title' },
      //   ],
      // },
    ],
  },
  events
);

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
