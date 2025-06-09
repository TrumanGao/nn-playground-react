import * as nn from './nn';
import { HeatMap } from './heatmap';
import { State, datasets, getKeyFromValue, Problem } from './state';
import { Example2D, shuffle } from './dataset';
import * as d3 from 'd3';

const NUM_SAMPLES_CLASSIFY = 500;
const DENSITY = 100;

interface InputFeature {
  f: (x: number, y: number) => number;
  label?: string;
}

const INPUTS: { [name: string]: InputFeature } = {
  x: { f: (x, y) => x, label: 'X_1' },
  y: { f: (x, y) => y, label: 'X_2' },
  xSquared: { f: (x, y) => x * x, label: 'X_1^2' },
  ySquared: { f: (x, y) => y * y, label: 'X_2^2' },
  xTimesY: { f: (x, y) => x * y, label: 'X_1X_2' },
  sinX: { f: (x, y) => Math.sin(x), label: 'sin(X_1)' },
  sinY: { f: (x, y) => Math.sin(y), label: 'sin(X_2)' },
};

class Player {
  private timerIndex = 0;
  private isPlaying = false;
  private callback?: (isPlaying: boolean) => void;

  /** Plays/pauses the player. */
  playOrPause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.pause();
    } else {
      this.isPlaying = true;
      this.play();
    }
  }

  play() {
    this.pause();
    this.isPlaying = true;
    if (this.callback) {
      this.callback(this.isPlaying);
    }
    this.start(this.timerIndex);
  }

  pause() {
    this.timerIndex++;
    this.isPlaying = false;
    if (this.callback) {
      this.callback(this.isPlaying);
    }
  }

  private start(localTimerIndex: number) {
    d3.timer(() => {
      if (localTimerIndex < this.timerIndex) {
        return true; // Done.
      }
      oneStep();
      return false; // Not done.
    }, 0);
  }
}

const state = State.deserializeState();

let boundary: { [id: string]: number[][] } = {};
const selectedNodeId: string | null = null;
// Plot the heatmap.
const xDomain: [number, number] = [-6, 6];
const heatMap = new HeatMap(
  300,
  DENSITY,
  xDomain,
  xDomain,
  d3.select('#decision-boundary'),
  { showAxes: true },
);
const colorScale = d3
  .scaleLinear<string, number>()
  .domain([-1, 0, 1])
  .range(['#f59322', '#e8eaeb', '#0877bd'])
  .clamp(true);
let iter = 0;
let trainData: Example2D[] = [];
let network: nn.Node[][] | null = null;
const player = new Player();

function makeGUI() {
  d3.select('#play-pause-button').on('click', function () {
    player.playOrPause();
  });

  const dataThumbnails = d3.selectAll('canvas[data-dataset]');
  dataThumbnails.on('click', function () {
    const newDataset = datasets[this.dataset.dataset];
    if (newDataset === state.dataset) {
      return; // No-op.
    }
    state.dataset = newDataset;
    dataThumbnails.classed('selected', false);
    d3.select(this).classed('selected', true);
    generateData();
    reset();
  });

  const datasetKey = getKeyFromValue(datasets, state.dataset);
  // Select the dataset according to the current state.
  d3.select(`canvas[data-dataset=${datasetKey}]`).classed('selected', true);

  // Add scale to the gradient color map.
  const x = d3.scaleLinear().domain([-1, 1]).range([0, 144]);
  const xAxis = d3
    .axisBottom(x)
    .tickValues([-1, 0, 1])
    .tickFormat(d3.format('d'));
  d3.select('#colormap g.core')
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,10)')
    .call(xAxis);
}

/**
 * Given a neural network, it asks the network for the output (prediction)
 * of every node in the network using inputs sampled on a square grid.
 * It returns a map where each key is the node ID and the value is a square
 * matrix of the outputs of the network for each input in the grid respectively.
 */
function updateDecisionBoundary(network: nn.Node[][], firstTime: boolean) {
  if (firstTime) {
    boundary = {};
    nn.forEachNode(network, true, (node) => {
      boundary[node.id] = new Array(DENSITY);
    });
    // Go through all predefined inputs.
    for (const nodeId in INPUTS) {
      boundary[nodeId] = new Array(DENSITY);
    }
  }
  const xScale = d3
    .scaleLinear()
    .domain([0, DENSITY - 1])
    .range(xDomain);
  const yScale = d3
    .scaleLinear()
    .domain([DENSITY - 1, 0])
    .range(xDomain);

  const i = 0,
    j = 0;
  for (let i = 0; i < DENSITY; i++) {
    if (firstTime) {
      nn.forEachNode(network, true, (node) => {
        boundary[node.id][i] = new Array(DENSITY);
      });
      // Go through all predefined inputs.
      for (let nodeId in INPUTS) {
        boundary[nodeId][i] = new Array(DENSITY);
      }
    }
    for (let j = 0; j < DENSITY; j++) {
      // 1 for points inside the circle, and 0 for points outside the circle.
      const x = xScale(i);
      const y = yScale(j);
      const input = constructInput(x, y);
      nn.forwardProp(network, input);
      nn.forEachNode(network, true, (node) => {
        boundary[node.id][i][j] = node.output;
      });
      if (firstTime) {
        // Go through all predefined inputs.
        for (let nodeId in INPUTS) {
          boundary[nodeId][i][j] = INPUTS[nodeId].f(x, y);
        }
      }
    }
  }
}

function updateUI(firstStep = false) {
  // Update the links visually.
  // updateWeightsUI(network, d3.select('g.core'));
  // Update the bias values visually.
  // updateBiasesUI(network);
  // Get the decision boundary of the network.
  updateDecisionBoundary(network, firstStep);
  const selectedId =
    selectedNodeId != null ? selectedNodeId : nn.getOutputNode(network).id;
  heatMap.updateBackground(boundary[selectedId], false);
}

function constructInputIds(): string[] {
  const result: string[] = [];
  for (const inputName in INPUTS) {
    if (state[inputName]) {
      result.push(inputName);
    }
  }
  return result;
}

function constructInput(x: number, y: number): number[] {
  const input: number[] = [];
  for (let inputName in INPUTS) {
    if (state[inputName]) {
      input.push(INPUTS[inputName].f(x, y));
    }
  }
  return input;
}

function oneStep(): void {
  iter++;
  trainData.forEach((point, i) => {
    const input = constructInput(point.x, point.y);
    nn.forwardProp(network, input);
    nn.backProp(network, point.label, nn.Errors.SQUARE);
    if ((i + 1) % state.batchSize === 0) {
      nn.updateWeights(network, state.learningRate, state.regularizationRate);
    }
  });
  updateUI();
}

function reset() {
  state.serialize();
  player.pause();

  // Make a simple network.
  iter = 0;
  const numInputs = constructInput(0, 0).length;
  const shape = [numInputs].concat(state.networkShape).concat([1]);
  const outputActivation =
    state.problem === Problem.REGRESSION
      ? nn.Activations.LINEAR
      : nn.Activations.TANH;
  network = nn.buildNetwork(
    shape,
    state.activation,
    outputActivation,
    state.regularization,
    constructInputIds(),
    state.initZero,
  );
  updateUI(true);
}

function drawDatasetThumbnails() {
  function renderThumbnail(canvas, dataGenerator) {
    const w = 100;
    const h = 100;
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    const context = canvas.getContext('2d');
    const data = dataGenerator(200, 0);
    data.forEach(function (d) {
      context.fillStyle = colorScale(d.label);
      context.fillRect((w * (d.x + 6)) / 12, (h * (d.y + 6)) / 12, 4, 4);
    });
    d3.select(canvas.parentNode).style('display', null);
  }
  d3.selectAll('.dataset').style('display', 'none');

  if (state.problem === Problem.CLASSIFICATION) {
    for (let dataset in datasets) {
      const canvas: any = document.querySelector(
        `canvas[data-dataset=${dataset}]`,
      );
      const dataGenerator = datasets[dataset];
      renderThumbnail(canvas, dataGenerator);
    }
  }
}

function generateData(firstTime = false) {
  console.log('生成图像数据');
  if (!firstTime) {
    // Change the seed.
    state.seed = Math.random().toFixed(5);
    state.serialize();
  }
  Math.seedrandom(state.seed);
  const numSamples = NUM_SAMPLES_CLASSIFY;
  const generator = state.dataset;
  const data = generator(numSamples, state.noise / 100);
  // Shuffle the data in-place.
  shuffle(data);
  // Split into train and test data.
  const splitIndex = Math.floor((data.length * state.percTrainData) / 100);
  trainData = data.slice(0, splitIndex);
}

drawDatasetThumbnails();
makeGUI();
generateData(true);
reset();
