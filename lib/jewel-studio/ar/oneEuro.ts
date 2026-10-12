// One Euro filter (Casiez et al., 2012): heavy smoothing when the hand is
// still (no jitter), light smoothing when it moves fast (no lag).

class LowPass {
  private value: number | null = null;
  filter(x: number, alpha: number) {
    this.value = this.value === null ? x : alpha * x + (1 - alpha) * this.value;
    return this.value;
  }
  last() {
    return this.value;
  }
  reset() {
    this.value = null;
  }
}

const alphaFor = (cutoff: number, dt: number) => {
  const tau = 1 / (2 * Math.PI * cutoff);
  return 1 / (1 + tau / dt);
};

export class OneEuro {
  private x = new LowPass();
  private dx = new LowPass();
  private lastTime: number | null = null;

  constructor(private minCutoff = 1.0, private beta = 0.02, private dCutoff = 1.0) {}

  filter(value: number, timeMs: number) {
    const dt = this.lastTime === null ? 1 / 60 : Math.max(1e-3, (timeMs - this.lastTime) / 1000);
    this.lastTime = timeMs;
    const prev = this.x.last();
    const derivative = prev === null ? 0 : (value - prev) / dt;
    const edx = this.dx.filter(derivative, alphaFor(this.dCutoff, dt));
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    return this.x.filter(value, alphaFor(cutoff, dt));
  }

  reset() {
    this.x.reset();
    this.dx.reset();
    this.lastTime = null;
  }
}

/** A bundle of filters for a fixed-length vector. */
export class OneEuroVector {
  private filters: OneEuro[];
  constructor(size: number, minCutoff?: number, beta?: number) {
    this.filters = Array.from({ length: size }, () => new OneEuro(minCutoff, beta));
  }
  filter(values: number[], timeMs: number) {
    return values.map((v, i) => this.filters[i].filter(v, timeMs));
  }
  reset() {
    this.filters.forEach((f) => f.reset());
  }
}
