<script lang="ts">
	import { onMount } from 'svelte';

	type IdleWorkerMessage =
		| { type: 'frame'; bitmap: ImageBitmap }
		| { type: 'ready' }
		| { type: 'error'; message: string };

	let {
		isTitleHovered = false,
		imageSrc = '/images/background.jpg',
		threshold = 190,
		ditherAmount = 36,
		ditherLevels = 4,
		tintVariable = '--bg-tint',
		tintFallback = '#673399',
		idleDelayMs = 6000,
		idleRevealInMs = 120000,
		idleCellSize = 4,
		idleNoiseScale = 0.04,
		idleNoiseJitter = 0.12,
		hoverInMs = 300,
		hoverOutMs = 120
	} = $props<{
		isTitleHovered?: boolean;
		imageSrc?: string;
		threshold?: number;
		ditherAmount?: number;
		ditherLevels?: number;
		tintVariable?: string;
		tintFallback?: string;
		idleDelayMs?: number;
		idleRevealInMs?: number;
		idleCellSize?: number;
		idleNoiseScale?: number;
		idleNoiseJitter?: number;
		hoverInMs?: number;
		hoverOutMs?: number;
	}>();

	let canvasEl: HTMLCanvasElement | null = null;
	let viewportWidth = 0;
	let viewportHeight = 0;
	let devicePixelRatioValue = 1;

	let animationFrameId = 0;
	let idleTimerId = 0;
	let isIdle = false;
	let hoverAlpha = 0;
	let hoverTargetAlpha = 0;
	let lastFrameTime = 0;

	let sourceImage: HTMLImageElement | null = null;
	let processedCanvas: HTMLCanvasElement | null = null;
	let processedReady = false;

	let idleMaskBitmap: ImageBitmap | null = null;
	let idleWorker: Worker | null = null;
	let idleWorkerReady = false;
	let useWorkerMask = false;

	let idleMaskCanvas: HTMLCanvasElement | null = null;
	let idleMaskContext: CanvasRenderingContext2D | null = null;
	let idleCellColumns = 0;
	let idleCellRows = 0;
	let idleCellTotal = 0;
	let idleOrder = new Uint32Array(0);
	let idleVisibleCount = 0;
	let idleCycleStartedAt = 0;

	const bayer4x4 = [
		[0, 8, 2, 10],
		[12, 4, 14, 6],
		[3, 11, 1, 9],
		[15, 7, 13, 5]
	] as const;

	const activityEvents: Array<keyof WindowEventMap> = [
		'pointermove',
		'keydown',
		'scroll',
		'touchstart'
	];

	$effect(() => {
		hoverTargetAlpha = isTitleHovered ? 1 : 0;
	});

	function parseColor(color: string): [number, number, number] {
		const normalizedColor = color.trim().replace(/^['\"]|['\"]$/g, '');
		const parserCanvas = document.createElement('canvas');
		parserCanvas.width = 1;
		parserCanvas.height = 1;
		const parserContext = parserCanvas.getContext('2d');

		if (!parserContext) {
			return [80, 104, 80];
		}

		parserContext.fillStyle = '#000000';
		parserContext.fillStyle = normalizedColor;
		const resolved = parserContext.fillStyle;

		if (resolved.startsWith('#')) {
			if (resolved.length === 4) {
				return [
					parseInt(resolved[1] + resolved[1], 16),
					parseInt(resolved[2] + resolved[2], 16),
					parseInt(resolved[3] + resolved[3], 16)
				];
			}

			return [
				parseInt(resolved.slice(1, 3), 16),
				parseInt(resolved.slice(3, 5), 16),
				parseInt(resolved.slice(5, 7), 16)
			];
		}

		const rgbMatch = resolved.match(/\d+/g);
		if (!rgbMatch || rgbMatch.length < 3) {
			return [80, 104, 80];
		}

		return [Number(rgbMatch[0]), Number(rgbMatch[1]), Number(rgbMatch[2])];
	}

	function resolveTintColor(): [number, number, number] {
		const rootStyles = getComputedStyle(document.documentElement);
		const colorFromVariable = rootStyles.getPropertyValue(tintVariable).trim();
		return parseColor(colorFromVariable || tintFallback);
	}

	function drawImageCover(
		context: CanvasRenderingContext2D,
		image: HTMLImageElement,
		width: number,
		height: number
	) {
		const sourceAspect = image.width / image.height;
		const targetAspect = width / height;

		let drawWidth = width;
		let drawHeight = height;
		let offsetX = 0;
		let offsetY = 0;

		if (sourceAspect > targetAspect) {
			drawHeight = height;
			drawWidth = height * sourceAspect;
			offsetX = (width - drawWidth) / 2;
		} else {
			drawWidth = width;
			drawHeight = width / sourceAspect;
			offsetY = (height - drawHeight) / 2;
		}

		context.clearRect(0, 0, width, height);
		context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
	}

	function processImage() {
		if (!sourceImage || !processedCanvas || viewportWidth <= 0 || viewportHeight <= 0) {
			return;
		}

		processedCanvas.width = viewportWidth;
		processedCanvas.height = viewportHeight;

		const context = processedCanvas.getContext('2d', { willReadFrequently: true });
		if (!context) {
			processedReady = false;
			return;
		}

		drawImageCover(context, sourceImage, viewportWidth, viewportHeight);

		const imageData = context.getImageData(0, 0, viewportWidth, viewportHeight);
		const data = imageData.data;
		const [tintR, tintG, tintB] = resolveTintColor();
		const clampedThreshold = Math.max(0, Math.min(255, threshold));
		const clampedDitherAmount = Math.max(0, Math.min(64, ditherAmount));
		const clampedDitherLevels = Math.max(2, Math.min(12, Math.round(ditherLevels)));

		for (let i = 0; i < data.length; i += 4) {
			const pixelIndex = i / 4;
			const x = pixelIndex % viewportWidth;
			const y = Math.floor(pixelIndex / viewportWidth);
			const bayerValue = bayer4x4[y % 4][x % 4] / 15 - 0.5;

			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const originalAlpha = data[i + 3];
			const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
			const localThreshold = clampedThreshold + bayerValue * clampedDitherAmount;

			if (luminance >= localThreshold) {
				data[i + 3] = 0;
				continue;
			}

			const shade = clampedThreshold === 0 ? 0 : luminance / clampedThreshold;
			const ditheredShade = Math.max(0, Math.min(1, shade + bayerValue / clampedDitherLevels));
			const quantizedShade =
				Math.round(ditheredShade * (clampedDitherLevels - 1)) / (clampedDitherLevels - 1);
			const tone = 0.15 + 0.85 * quantizedShade;

			data[i] = Math.round(tintR * tone);
			data[i + 1] = Math.round(tintG * tone);
			data[i + 2] = Math.round(tintB * tone);
			data[i + 3] = originalAlpha;
		}

		context.putImageData(imageData, 0, 0);
		processedReady = true;
	}

	function randomSeed() {
		return Math.floor(Math.random() * 2147483647);
	}

	function fract(value: number) {
		return value - Math.floor(value);
	}

	function smoothstep(value: number) {
		return value * value * (3 - 2 * value);
	}

	function lerp(a: number, b: number, t: number) {
		return a + (b - a) * t;
	}

	function hash2D(x: number, y: number, seed: number) {
		const dot = x * 127.1 + y * 311.7 + seed * 0.0001;
		return fract(Math.sin(dot) * 43758.5453123);
	}

	function valueNoise2D(x: number, y: number, seed: number) {
		const x0 = Math.floor(x);
		const y0 = Math.floor(y);
		const x1 = x0 + 1;
		const y1 = y0 + 1;

		const sx = smoothstep(x - x0);
		const sy = smoothstep(y - y0);

		const n00 = hash2D(x0, y0, seed);
		const n10 = hash2D(x1, y0, seed);
		const n01 = hash2D(x0, y1, seed);
		const n11 = hash2D(x1, y1, seed);

		const ix0 = lerp(n00, n10, sx);
		const ix1 = lerp(n01, n11, sx);
		return lerp(ix0, ix1, sy);
	}

	function fbmNoise2D(x: number, y: number, seed: number) {
		let value = 0;
		let amplitude = 0.55;
		let frequency = 1;

		for (let octave = 0; octave < 3; octave += 1) {
			value += amplitude * valueNoise2D(x * frequency, y * frequency, seed + octave * 1013);
			amplitude *= 0.5;
			frequency *= 2;
		}

		return value;
	}

	function buildNoiseOrderedCells(
		columns: number,
		rows: number,
		noiseScale: number,
		noiseJitter: number,
		seed: number
	) {
		const total = columns * rows;
		const order = new Uint32Array(total);
		const scores = new Float32Array(total);
		const indices = new Array<number>(total);
		const clampedScale = Math.max(0.0005, noiseScale);
		const clampedJitter = Math.max(0, Math.min(0.4, noiseJitter));

		for (let cell = 0; cell < total; cell += 1) {
			const x = cell % columns;
			const y = Math.floor(cell / columns);
			const nx = x * clampedScale;
			const ny = y * clampedScale;
			const base = fbmNoise2D(nx, ny, seed);
			const blueNoise = hash2D(x * 2 + 17, y * 2 + 31, seed + 1619);
			const jitter = (hash2D(x, y, seed + 7919) - 0.5) * clampedJitter;
			scores[cell] = Math.max(0, Math.min(1, base * 0.82 + blueNoise * 0.18 + jitter));
			indices[cell] = cell;
		}

		indices.sort((a, b) => scores[a] - scores[b]);

		for (let index = 0; index < total; index += 1) {
			order[index] = indices[index];
		}

		return order;
	}

	function canUseWorkerMask() {
		return (
			typeof Worker !== 'undefined' &&
			typeof OffscreenCanvas !== 'undefined' &&
			typeof createImageBitmap !== 'undefined'
		);
	}

	function createIdleWorker() {
		if (!canUseWorkerMask()) {
			useWorkerMask = false;
			return;
		}

		const source = `
self.maskCanvas = null;
self.maskContext = null;
self.cellSize = 4;
self.columns = 0;
self.rows = 0;
self.total = 0;
self.order = null;
self.visible = 0;
self.running = false;
self.revealStartedAt = 0;
self.revealInMs = 30000;
self.noiseScale = 0.04;
self.noiseJitter = 0.12;
self.framePending = false;

function fract(value) {
  return value - Math.floor(value);
}

function smoothstep(value) {
  return value * value * (3 - 2 * value);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hash2D(x, y, seed) {
  const dot = x * 127.1 + y * 311.7 + seed * 0.0001;
  return fract(Math.sin(dot) * 43758.5453123);
}

function valueNoise2D(x, y, seed) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const sx = smoothstep(x - x0);
  const sy = smoothstep(y - y0);
  const n00 = hash2D(x0, y0, seed);
  const n10 = hash2D(x1, y0, seed);
  const n01 = hash2D(x0, y1, seed);
  const n11 = hash2D(x1, y1, seed);
  const ix0 = lerp(n00, n10, sx);
  const ix1 = lerp(n01, n11, sx);
  return lerp(ix0, ix1, sy);
}

function fbmNoise2D(x, y, seed) {
  let value = 0;
  let amplitude = 0.55;
  let frequency = 1;
  for (let octave = 0; octave < 3; octave += 1) {
    value += amplitude * valueNoise2D(x * frequency, y * frequency, seed + octave * 1013);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

function buildNoiseOrderedCells(columns, rows, noiseScale, noiseJitter, seed) {
  const total = columns * rows;
  const order = new Uint32Array(total);
  const scores = new Float32Array(total);
  const indices = new Array(total);
  const clampedScale = Math.max(0.0005, noiseScale);
  const clampedJitter = Math.max(0, Math.min(0.4, noiseJitter));

  for (let cell = 0; cell < total; cell += 1) {
    const x = cell % columns;
    const y = Math.floor(cell / columns);
    const nx = x * clampedScale;
    const ny = y * clampedScale;
    const base = fbmNoise2D(nx, ny, seed);
    const blueNoise = hash2D(x * 2 + 17, y * 2 + 31, seed + 1619);
    const jitter = (hash2D(x, y, seed + 7919) - 0.5) * clampedJitter;
    scores[cell] = Math.max(0, Math.min(1, base * 0.82 + blueNoise * 0.18 + jitter));
    indices[cell] = cell;
  }

  indices.sort((a, b) => scores[a] - scores[b]);

  for (let index = 0; index < total; index += 1) {
    order[index] = indices[index];
  }

  return order;
}

function initGrid(width, height, seed) {
  self.columns = Math.ceil(width / self.cellSize);
  self.rows = Math.ceil(height / self.cellSize);
  self.total = self.columns * self.rows;
  self.order = buildNoiseOrderedCells(self.columns, self.rows, self.noiseScale, self.noiseJitter, seed);
  self.visible = 0;
  self.maskCanvas = new OffscreenCanvas(width, height);
  self.maskContext = self.maskCanvas.getContext('2d', { alpha: true });
  self.maskContext.clearRect(0, 0, width, height);
  self.maskContext.fillStyle = '#000';
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function revealProgress(now) {
  const elapsed = Math.max(0, now - self.revealStartedAt);
  const normalized = Math.min(1, elapsed / Math.max(1000, self.revealInMs));
  return easeInOutCubic(normalized);
}

function applyVisibleCount(nextCount) {
  if (!self.maskContext || !self.order) return;
  const clamped = Math.max(0, Math.min(self.total, nextCount));
  if (clamped === self.visible) return;

  if (clamped > self.visible) {
    for (let i = self.visible; i < clamped; i += 1) {
      const cell = self.order[i];
      const x = (cell % self.columns) * self.cellSize;
      const y = Math.floor(cell / self.columns) * self.cellSize;
      self.maskContext.fillRect(x, y, self.cellSize, self.cellSize);
    }
  } else {
    for (let i = clamped; i < self.visible; i += 1) {
      const cell = self.order[i];
      const x = (cell % self.columns) * self.cellSize;
      const y = Math.floor(cell / self.columns) * self.cellSize;
      self.maskContext.clearRect(x, y, self.cellSize, self.cellSize);
    }
  }

  self.visible = clamped;
}

function emitFrame() {
  if (!self.maskCanvas || self.framePending) return;
  self.framePending = true;
  createImageBitmap(self.maskCanvas).then((bitmap) => {
    self.framePending = false;
    self.postMessage({ type: 'frame', bitmap }, [bitmap]);
  }).catch((error) => {
    self.framePending = false;
    self.postMessage({ type: 'error', message: String(error) });
  });
}

function tick() {
  if (!self.running) return;
  const progress = revealProgress(performance.now());
  applyVisibleCount(Math.floor(progress * self.total));
  emitFrame();
  if (progress >= 1) {
    self.running = false;
    return;
  }
  setTimeout(tick, 33);
}

self.onmessage = (event) => {
  const data = event.data;
  if (data.type === 'init') {
    self.cellSize = Math.max(2, data.cellSize || 4);
    self.revealInMs = Math.max(1000, data.revealInMs || 30000);
    self.noiseScale = Math.max(0.0005, data.noiseScale || 0.04);
    self.noiseJitter = Math.max(0, Math.min(0.4, data.noiseJitter || 0.12));
    initGrid(data.width, data.height, data.seed || 1337);
    self.postMessage({ type: 'ready' });
    return;
  }

  if (data.type === 'start') {
    if (!self.order) return;
    self.order = buildNoiseOrderedCells(
      self.columns,
      self.rows,
      self.noiseScale,
      self.noiseJitter,
      data.seed || Math.floor(Math.random() * 2147483647)
    );
    self.maskContext.clearRect(0, 0, self.maskCanvas.width, self.maskCanvas.height);
    self.visible = 0;
    self.revealStartedAt = data.now || performance.now();
    self.running = true;
    tick();
    return;
  }

  if (data.type === 'stop') {
    self.running = false;
    if (self.maskContext && self.maskCanvas) {
      self.maskContext.clearRect(0, 0, self.maskCanvas.width, self.maskCanvas.height);
    }
    self.visible = 0;
    return;
  }

  if (data.type === 'resize') {
    self.cellSize = Math.max(2, data.cellSize || self.cellSize);
    self.revealInMs = Math.max(1000, data.revealInMs || self.revealInMs);
    self.noiseScale = Math.max(0.0005, data.noiseScale || self.noiseScale);
    self.noiseJitter = Math.max(0, Math.min(0.4, data.noiseJitter || self.noiseJitter));
    initGrid(data.width, data.height, data.seed || Math.floor(Math.random() * 2147483647));
    return;
  }
};`;

		const blob = new Blob([source], { type: 'application/javascript' });
		const worker = new Worker(URL.createObjectURL(blob));
		worker.onmessage = (event: MessageEvent<IdleWorkerMessage>) => {
			const data = event.data;
			if (data.type === 'ready') {
				idleWorkerReady = true;
				return;
			}

			if (data.type === 'frame') {
				idleMaskBitmap?.close();
				idleMaskBitmap = data.bitmap;
				return;
			}

			if (data.type === 'error') {
				useWorkerMask = false;
			}
		};

		idleWorker = worker;
		useWorkerMask = true;
	}

	function terminateIdleWorker() {
		if (!idleWorker) {
			return;
		}

		idleWorker.terminate();
		idleWorker = null;
		idleWorkerReady = false;
		useWorkerMask = false;
	}

	function initMainThreadIdleMask() {
		idleMaskCanvas = document.createElement('canvas');
		idleMaskCanvas.width = viewportWidth;
		idleMaskCanvas.height = viewportHeight;
		idleMaskContext = idleMaskCanvas.getContext('2d');
		if (!idleMaskContext) {
			return;
		}

		idleMaskContext.clearRect(0, 0, viewportWidth, viewportHeight);
		idleMaskContext.fillStyle = '#000';

		idleCellColumns = Math.ceil(viewportWidth / Math.max(2, idleCellSize));
		idleCellRows = Math.ceil(viewportHeight / Math.max(2, idleCellSize));
		idleCellTotal = idleCellColumns * idleCellRows;
		idleOrder = buildNoiseOrderedCells(
			idleCellColumns,
			idleCellRows,
			idleNoiseScale,
			idleNoiseJitter,
			randomSeed()
		);
		idleVisibleCount = 0;
	}

	function easeInOutCubic(value: number) {
		return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
	}

	function computeIdleProgress(now: number) {
		const elapsed = Math.max(0, now - idleCycleStartedAt);
		const normalized = Math.min(1, elapsed / Math.max(1000, idleRevealInMs));
		return easeInOutCubic(normalized);
	}

	function updateMainThreadIdleMask(now: number) {
		if (!idleMaskContext || !idleMaskCanvas || idleCellTotal <= 0) {
			return;
		}

		const progress = computeIdleProgress(now);
		const nextVisibleCount = Math.max(
			0,
			Math.min(idleCellTotal, Math.floor(progress * idleCellTotal))
		);

		if (nextVisibleCount === idleVisibleCount) {
			return;
		}

		const cellSize = Math.max(2, idleCellSize);

		if (nextVisibleCount > idleVisibleCount) {
			for (let index = idleVisibleCount; index < nextVisibleCount; index += 1) {
				const cell = idleOrder[index];
				const x = (cell % idleCellColumns) * cellSize;
				const y = Math.floor(cell / idleCellColumns) * cellSize;
				idleMaskContext.fillRect(x, y, cellSize, cellSize);
			}
		} else {
			for (let index = nextVisibleCount; index < idleVisibleCount; index += 1) {
				const cell = idleOrder[index];
				const x = (cell % idleCellColumns) * cellSize;
				const y = Math.floor(cell / idleCellColumns) * cellSize;
				idleMaskContext.clearRect(x, y, cellSize, cellSize);
			}
		}

		idleVisibleCount = nextVisibleCount;
	}

	function startIdleReveal(now: number) {
		idleCycleStartedAt = now;
		idleMaskBitmap?.close();
		idleMaskBitmap = null;

		if (useWorkerMask && idleWorker && idleWorkerReady) {
			idleWorker.postMessage({ type: 'start', now, seed: randomSeed() });
			return;
		}

		if (!idleMaskCanvas || !idleMaskContext) {
			initMainThreadIdleMask();
		}

		if (!idleMaskContext || !idleMaskCanvas) {
			return;
		}

		idleMaskContext.clearRect(0, 0, idleMaskCanvas.width, idleMaskCanvas.height);
		idleOrder = buildNoiseOrderedCells(
			idleCellColumns,
			idleCellRows,
			idleNoiseScale,
			idleNoiseJitter,
			randomSeed()
		);
		idleVisibleCount = 0;
	}

	function stopIdleReveal() {
		idleMaskBitmap?.close();
		idleMaskBitmap = null;

		if (useWorkerMask && idleWorker) {
			idleWorker.postMessage({ type: 'stop' });
		}

		if (idleMaskContext && idleMaskCanvas) {
			idleMaskContext.clearRect(0, 0, idleMaskCanvas.width, idleMaskCanvas.height);
		}

		idleVisibleCount = 0;
	}

	function rebuildIdleInfrastructure() {
		if (useWorkerMask && idleWorker) {
			idleWorker.postMessage({
				type: 'resize',
				width: viewportWidth,
				height: viewportHeight,
				cellSize: idleCellSize,
				revealInMs: idleRevealInMs,
				noiseScale: idleNoiseScale,
				noiseJitter: idleNoiseJitter,
				seed: randomSeed()
			});
		}

		initMainThreadIdleMask();
	}

	function resizeCanvas() {
		if (!canvasEl) {
			return;
		}

		viewportWidth = window.innerWidth;
		viewportHeight = window.innerHeight;
		devicePixelRatioValue = Math.max(1, window.devicePixelRatio || 1);

		canvasEl.width = Math.floor(viewportWidth * devicePixelRatioValue);
		canvasEl.height = Math.floor(viewportHeight * devicePixelRatioValue);

		const context = canvasEl.getContext('2d');
		if (!context) {
			return;
		}

		context.setTransform(devicePixelRatioValue, 0, 0, devicePixelRatioValue, 0, 0);
		context.clearRect(0, 0, viewportWidth, viewportHeight);

		processImage();
		rebuildIdleInfrastructure();
	}

	function resetIdleTimer() {
		window.clearTimeout(idleTimerId);
		idleTimerId = window.setTimeout(() => {
			isIdle = true;
			startIdleReveal(performance.now());
		}, idleDelayMs);
	}

	function onActivity() {
		if (isIdle) {
			isIdle = false;
			stopIdleReveal();
		}

		resetIdleTimer();
	}

	function drawIdleReveal(context: CanvasRenderingContext2D, now: number) {
		if (!processedCanvas || !processedReady || !isIdle) {
			return;
		}

		if (!useWorkerMask) {
			updateMainThreadIdleMask(now);
		}

		const maskSource = useWorkerMask ? idleMaskBitmap : idleMaskCanvas;
		if (!maskSource) {
			return;
		}

		context.save();
		context.drawImage(maskSource, 0, 0, viewportWidth, viewportHeight);
		context.globalCompositeOperation = 'source-in';
		context.drawImage(processedCanvas, 0, 0);
		context.restore();
	}

	function animate(now: number) {
		if (!canvasEl) {
			return;
		}

		if (lastFrameTime === 0) {
			lastFrameTime = now;
		}

		const deltaMs = now - lastFrameTime;
		lastFrameTime = now;

		const context = canvasEl.getContext('2d');
		if (!context) {
			animationFrameId = window.requestAnimationFrame(animate);
			return;
		}

		const durationMs = hoverTargetAlpha > hoverAlpha ? hoverInMs : hoverOutMs;
		const alphaStep = durationMs <= 0 ? 1 : deltaMs / durationMs;
		hoverAlpha += (hoverTargetAlpha - hoverAlpha) * Math.min(1, alphaStep);

		context.clearRect(0, 0, viewportWidth, viewportHeight);

		if (processedReady && processedCanvas && hoverAlpha > 0.001) {
			context.globalAlpha = Math.min(1, Math.max(0, hoverAlpha));
			context.drawImage(processedCanvas, 0, 0);
		}

		context.globalAlpha = 1;
		drawIdleReveal(context, now);

		animationFrameId = window.requestAnimationFrame(animate);
	}

	onMount(() => {
		processedCanvas = document.createElement('canvas');
		createIdleWorker();

		if (useWorkerMask && idleWorker) {
			idleWorker.postMessage({
				type: 'init',
				width: Math.max(1, window.innerWidth),
				height: Math.max(1, window.innerHeight),
				cellSize: idleCellSize,
				revealInMs: idleRevealInMs,
				noiseScale: idleNoiseScale,
				noiseJitter: idleNoiseJitter,
				seed: randomSeed()
			});
		}

		sourceImage = new Image();
		sourceImage.decoding = 'async';
		sourceImage.src = imageSrc;
		sourceImage.onload = () => {
			resizeCanvas();
		};

		resizeCanvas();
		resetIdleTimer();

		for (const eventName of activityEvents) {
			window.addEventListener(eventName, onActivity, { passive: true });
		}

		window.addEventListener('resize', resizeCanvas);
		animationFrameId = window.requestAnimationFrame(animate);

		return () => {
			window.cancelAnimationFrame(animationFrameId);
			window.clearTimeout(idleTimerId);
			window.removeEventListener('resize', resizeCanvas);

			for (const eventName of activityEvents) {
				window.removeEventListener(eventName, onActivity);
			}

			idleMaskBitmap?.close();
			idleMaskBitmap = null;
			terminateIdleWorker();
		};
	});
</script>

<canvas bind:this={canvasEl} class="background-canvas" aria-hidden="true"></canvas>

<style>
	.background-canvas {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 4;
	}
</style>
