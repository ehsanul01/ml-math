// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";

const TOPICS = [
  { id: "foundations", label: "Foundations" },
  { id: "distributions", label: "Distributions" },
  { id: "expectation", label: "Expectation & Variance" },
  { id: "bayes", label: "Bayes' Theorem" },
  { id: "information", label: "Information Theory" },
  { id: "theorems", label: "Key Theorems" },
  { id: "mle", label: "MLE vs MAP" },
  { id: "covariance", label: "Covariance & Correlation" },
];

const C = {
  purple: "#7F77DD", purpleL: "#EEEDFE", purpleD: "#3C3489",
  teal: "#1D9E75", tealL: "#E1F5EE", tealD: "#085041",
  amber: "#BA7517", amberL: "#FAEEDA", amberD: "#633806",
  coral: "#D85A30", coralL: "#FAECE7", coralD: "#712B13",
  blue: "#378ADD", blueL: "#E6F1FB", blueD: "#0C447C",
  gray: "#888780", grayL: "#F1EFE8",
  pink: "#D4537E", pinkL: "#FBEAF0",
};

function gaussian(x: number, mu: number, sigma: number): number {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}
function linspace(a: number, b: number, n: number): number[] {
  const step = (b - a) / (n - 1);
  return Array.from({ length: n }, (_, i) => a + i * step);
}
function factorial(n: number): number { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
function binomCoeff(n: number, k: number): number { return factorial(n) / (factorial(k) * factorial(n - k)); }

function Card({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 10, border: `1px solid ${color}33`, overflow: "hidden", marginBottom: 10 }}>
      <div style={{ background: color + "22", padding: "7px 14px", fontWeight: 500, fontSize: 13, color: color }}>{title}</div>
      <div style={{ padding: "10px 14px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function Formula({ children }) {
  return (
    <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "8px 14px", fontFamily: "monospace", fontSize: 13, color: "var(--color-text-primary)", margin: "8px 0", borderLeft: `3px solid ${C.purple}` }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>{title}</h2>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>{subtitle}</p>
    </div>
  );
}

// ── 1. Foundations ────────────────────────────────────────────────────────────
function Foundations() {
  const [concept, setConcept] = useState("pmf");
  const canvasRef = useRef(null);

  const pmfData = [
    { x: 1, p: 0.1 }, { x: 2, p: 0.2 }, { x: 3, p: 0.4 },
    { x: 4, p: 0.2 }, { x: 5, p: 0.1 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const pad = { l: 50, r: 20, t: 24, b: 40 };
    const w = W - pad.l - pad.r, h = H - pad.t - pad.b;

    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + h); ctx.lineTo(pad.l + w, pad.t + h); ctx.stroke();

    if (concept === "pmf") {
      pmfData.forEach(({ x, p }) => {
        const bx = pad.l + ((x - 0.5) / 6) * w;
        const bh = p * h * 2.2;
        ctx.fillStyle = C.purple;
        ctx.fillRect(bx - 22, pad.t + h - bh, 44, bh);
        ctx.fillStyle = "#555"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`${x}`, bx, pad.t + h + 16);
        ctx.fillStyle = C.purple;
        ctx.fillText(`${p}`, bx, pad.t + h - bh - 6);
      });
      ctx.fillStyle = "#888"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Sum = 1.0  (all probs sum to 1)", pad.l, pad.t + 12);
    } else if (concept === "pdf") {
      const xs = linspace(-4, 4, 200);
      ctx.beginPath(); ctx.strokeStyle = C.teal; ctx.lineWidth = 2.5;
      xs.forEach((x, i) => {
        const px = pad.l + ((x + 4) / 8) * w;
        const py = pad.t + h - gaussian(x, 0, 1) * h * 2.3;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.beginPath(); ctx.fillStyle = C.teal + "33";
      ctx.moveTo(pad.l, pad.t + h);
      xs.forEach(x => {
        const px = pad.l + ((x + 4) / 8) * w;
        const py = pad.t + h - gaussian(x, 0, 1) * h * 2.3;
        ctx.lineTo(px, py);
      });
      ctx.lineTo(pad.l + w, pad.t + h); ctx.closePath(); ctx.fill();
      // shade -1 to 1
      const region = xs.filter(x => x >= -1 && x <= 1);
      ctx.beginPath(); ctx.fillStyle = C.teal + "66";
      ctx.moveTo(pad.l + ((-1 + 4) / 8) * w, pad.t + h);
      region.forEach(x => ctx.lineTo(pad.l + ((x + 4) / 8) * w, pad.t + h - gaussian(x, 0, 1) * h * 2.3));
      ctx.lineTo(pad.l + ((1 + 4) / 8) * w, pad.t + h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.tealD; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("68.2%", pad.l + ((0 + 4) / 8) * w, pad.t + h - 30);
      [-3,-2,-1,0,1,2,3].forEach(v => {
        const px = pad.l + ((v + 4) / 8) * w;
        ctx.fillStyle = "#666"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`${v}`, px, pad.t + h + 16);
      });
      ctx.fillStyle = "#888"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Area under full curve = 1.0", pad.l, pad.t + 12);
    } else {
      const xs = linspace(-4, 4, 200);
      ctx.beginPath(); ctx.strokeStyle = C.coral; ctx.lineWidth = 2.5;
      let cum = 0;
      xs.forEach((x, i) => {
        cum += gaussian(x, 0, 1) * (8 / 200);
        const px = pad.l + ((x + 4) / 8) * w;
        const py = pad.t + h - Math.min(cum, 1) * h * 0.88;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
      // horizontal dashed at 0.5
      ctx.setLineDash([4,3]); ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, pad.t + h - 0.5 * h * 0.88); ctx.lineTo(pad.l + w, pad.t + h - 0.5 * h * 0.88); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#888"; ctx.font = "11px sans-serif"; ctx.textAlign = "right";
      ctx.fillText("0.5", pad.l - 4, pad.t + h - 0.5 * h * 0.88 + 4);
      [-3,-2,-1,0,1,2,3].forEach(v => {
        const px = pad.l + ((v + 4) / 8) * w;
        ctx.fillStyle = "#666"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`${v}`, px, pad.t + h + 16);
      });
      ctx.fillStyle = "#888"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Starts at 0, ends at 1, always non-decreasing", pad.l, pad.t + 12);
    }
  }, [concept]);

  const btns = [
    { id: "pmf", label: "PMF (discrete)" },
    { id: "pdf", label: "PDF (continuous)" },
    { id: "cdf", label: "CDF" },
  ];

  const details = {
    pmf: {
      formula: "P(X = x) where all values sum to 1",
      explain: "A PMF assigns a probability to each possible discrete outcome. Think of rolling a die: P(X=1) = 1/6, P(X=2) = 1/6, etc. The key rule is that all probabilities must be non-negative and sum to exactly 1.",
      example: "In ML: the output of a softmax layer is a PMF over class labels. If your model outputs [0.7, 0.2, 0.1] for 3 classes, that's a valid PMF.",
    },
    pdf: {
      formula: "f(x) >= 0  and  integral f(x)dx = 1",
      explain: "A PDF describes how probability is spread over a continuous range. Unlike PMF, the value f(x) is NOT a probability — it's a density. Probability is only meaningful over an interval: P(a <= X <= b) = area under the curve from a to b.",
      example: "In ML: Gaussian PDFs model continuous features, noise, and priors on weights. The shaded region shows P(-1 <= X <= 1) = 68.2% for a standard normal.",
    },
    cdf: {
      formula: "F(x) = P(X <= x)  =  integral from -inf to x of f(t)dt",
      explain: "The CDF accumulates probability from left to right. F(x) answers: 'What is the probability the variable takes a value <= x?' It always starts at 0 (far left) and ends at 1 (far right), and is monotonically non-decreasing.",
      example: "In ML: used in quantile normalisation, probability calibration, and computing p-values. F(0) = 0.5 for any symmetric distribution (e.g., Gaussian with mean 0).",
    },
  };

  const d = details[concept];

  return (
    <div>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 12 }}>
        A <b>random variable</b> maps outcomes of a random experiment to numbers. Distributions describe how probability is spread over those numbers.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {btns.map(b => (
          <button key={b.id} onClick={() => setConcept(b.id)}
            style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${concept === b.id ? C.purple : "var(--color-border-tertiary)"}`,
              background: concept === b.id ? C.purpleL : "transparent",
              color: concept === b.id ? C.purpleD : "var(--color-text-secondary)",
              cursor: "pointer", fontSize: 13, fontWeight: concept === b.id ? 500 : 400 }}>
            {b.label}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} width={580} height={220} style={{ width: "100%", maxWidth: 580 }} />
      <Formula>{d.formula}</Formula>
      <Card color={C.purple} title="What it means">{d.explain}</Card>
      <Card color={C.teal} title="ML connection">{d.example}</Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        {[
          { t: "Discrete RV", d: "Countable outcomes: die roll, word count, # of heads. Uses PMF. Examples: Bernoulli, Binomial, Poisson.", c: C.purple },
          { t: "Continuous RV", d: "Uncountably infinite outcomes: height, weight, time, pixel intensity. Uses PDF. Examples: Gaussian, Beta, Exponential.", c: C.teal },
          { t: "Independence", d: "P(A,B) = P(A)·P(B). Knowing A gives zero information about B. Naive Bayes assumes all features are independent.", c: C.coral },
          { t: "Conditional prob.", d: "P(A|B) = P(A,B)/P(B). Probability of A given B occurred. This is the cornerstone of Bayes' theorem and causal reasoning.", c: C.amber },
        ].map(card => (
          <div key={card.t} style={{ background: card.c + "11", border: `1px solid ${card.c}33`, borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontWeight: 500, fontSize: 13, color: card.c, marginBottom: 4 }}>{card.t}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{card.d}</div>
          </div>
        ))}
      </div>

      <Card color={C.blue} title="Sum rule & product rule — the two laws of probability">
        <b>Sum rule:</b> P(X) = sum over all Y of P(X, Y) — marginalize out a variable by summing.<br/>
        <b>Product rule:</b> P(X, Y) = P(X|Y) · P(Y) — joint = conditional × marginal.<br/>
        <b>Chain rule:</b> P(X1, X2, ..., Xn) = P(X1) · P(X2|X1) · P(X3|X1,X2) · ... · P(Xn|X1,...,Xn-1)<br/>
        Every probabilistic ML model (Naive Bayes, HMMs, Bayesian networks) is built from these two rules alone.
      </Card>
    </div>
  );
}

// ── 2. Distributions ─────────────────────────────────────────────────────────
function Distributions() {
  const [dist, setDist] = useState("gaussian");
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [p, setP] = useState(0.5);
  const [lam, setLam] = useState(3);
  const [alpha, setAlpha] = useState(2);
  const [beta, setBeta] = useState(5);
  const canvasRef = useRef(null);

  const dists = [
    { id: "gaussian", label: "Gaussian", color: C.purple },
    { id: "bernoulli", label: "Bernoulli", color: C.teal },
    { id: "binomial", label: "Binomial", color: C.coral },
    { id: "poisson", label: "Poisson", color: C.amber },
    { id: "beta", label: "Beta", color: C.blue },
  ];

  function betaPDF(x, a, b) {
    if (x <= 0 || x >= 1) return 0;
    const logB = lgamma(a) + lgamma(b) - lgamma(a + b);
    return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB);
  }
  function lgamma(z) {
    const c = [76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];
    let y = z, x = z, tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) ser += c[j] / ++y;
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const pad = { l: 52, r: 16, t: 24, b: 42 };
    const w = W - pad.l - pad.r, h = H - pad.t - pad.b;
    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + h); ctx.lineTo(pad.l + w, pad.t + h); ctx.stroke();

    const color = dists.find(d => d.id === dist)?.color || C.purple;

    if (dist === "gaussian") {
      const xs = linspace(mu - 4 * sigma, mu + 4 * sigma, 300);
      const maxY = gaussian(mu, mu, sigma);
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5;
      xs.forEach((x, i) => {
        const px = pad.l + ((x - (mu - 4 * sigma)) / (8 * sigma)) * w;
        const py = pad.t + h - (gaussian(x, mu, sigma) / maxY) * h * 0.85;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.beginPath(); ctx.fillStyle = color + "22";
      ctx.moveTo(pad.l, pad.t + h);
      xs.forEach(x => {
        const px = pad.l + ((x - (mu - 4 * sigma)) / (8 * sigma)) * w;
        const py = pad.t + h - (gaussian(x, mu, sigma) / maxY) * h * 0.85;
        ctx.lineTo(px, py);
      });
      ctx.lineTo(pad.l + w, pad.t + h); ctx.closePath(); ctx.fill();
      const mx = pad.l + 0.5 * w;
      ctx.setLineDash([4,3]); ctx.strokeStyle = color + "88"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(mx, pad.t); ctx.lineTo(mx, pad.t + h); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`mu=${mu}  sigma=${sigma.toFixed(1)}`, mx, pad.t + 14);
    } else if (dist === "bernoulli") {
      [{ x: 0, v: 1 - p, label: "0 (failure)" }, { x: 1, v: p, label: "1 (success)" }].forEach(({ x, v, label }) => {
        const bx = pad.l + (x === 0 ? 0.22 : 0.58) * w;
        const bh = v * h * 0.85;
        ctx.fillStyle = color;
        ctx.fillRect(bx, pad.t + h - bh, w * 0.18, bh);
        ctx.fillStyle = "#555"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(label, bx + w * 0.09, pad.t + h + 16);
        ctx.fillStyle = color;
        ctx.fillText(v.toFixed(2), bx + w * 0.09, pad.t + h - bh - 6);
      });
    } else if (dist === "binomial") {
      const n = 10;
      const vals = Array.from({ length: n + 1 }, (_, k) => ({
        k, v: binomCoeff(n, k) * p ** k * (1 - p) ** (n - k),
      }));
      const maxV = Math.max(...vals.map(d => d.v));
      const bw = w / (n + 2);
      vals.forEach(({ k, v }) => {
        const bx = pad.l + (k + 0.5) * bw;
        const bh = (v / maxV) * h * 0.85;
        ctx.fillStyle = color;
        ctx.fillRect(bx - bw * 0.38, pad.t + h - bh, bw * 0.76, bh);
        ctx.fillStyle = "#555"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(k, bx, pad.t + h + 14);
      });
      ctx.fillStyle = "#777"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`n=10, p=${p.toFixed(1)}   mean=${(10*p).toFixed(1)}`, pad.l + w/2, pad.t + 12);
    } else if (dist === "poisson") {
      const ks = Array.from({ length: 16 }, (_, k) => ({
        k, v: (Math.exp(-lam) * lam ** k) / factorial(k),
      }));
      const maxV = Math.max(...ks.map(d => d.v));
      const bw = w / 17;
      ks.forEach(({ k, v }) => {
        const bx = pad.l + (k + 0.5) * bw;
        const bh = (v / maxV) * h * 0.85;
        ctx.fillStyle = color;
        ctx.fillRect(bx - bw * 0.38, pad.t + h - bh, bw * 0.76, bh);
        ctx.fillStyle = "#555"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(k, bx, pad.t + h + 14);
      });
      ctx.fillStyle = "#777"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`lambda=${lam}   mean=variance=${lam}`, pad.l + w/2, pad.t + 12);
    } else if (dist === "beta") {
      const xs = linspace(0.001, 0.999, 300);
      const ys = xs.map(x => betaPDF(x, alpha, beta));
      const maxY = Math.max(...ys);
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5;
      xs.forEach((x, i) => {
        const px = pad.l + x * w;
        const py = pad.t + h - (ys[i] / maxY) * h * 0.85;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.beginPath(); ctx.fillStyle = color + "22";
      ctx.moveTo(pad.l, pad.t + h);
      xs.forEach((x, i) => ctx.lineTo(pad.l + x * w, pad.t + h - (ys[i] / maxY) * h * 0.85));
      ctx.lineTo(pad.l + w, pad.t + h); ctx.closePath(); ctx.fill();
      [0, 0.25, 0.5, 0.75, 1].forEach(v => {
        ctx.fillStyle = "#666"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(v.toFixed(2), pad.l + v * w, pad.t + h + 16);
      });
      const mean = (alpha / (alpha + beta)).toFixed(3);
      ctx.fillStyle = color; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`alpha=${alpha}  beta=${beta}  mean=${mean}`, pad.l + w/2, pad.t + 12);
    }
  }, [dist, mu, sigma, p, lam, alpha, beta]);

  const info = {
    gaussian: {
      formula: "f(x) = (1/sqrt(2*pi*sigma^2)) * exp(-(x-mu)^2 / (2*sigma^2))",
      params: "mu = mean, sigma = std deviation",
      props: "Symmetric bell curve. 68% of data within 1 sigma, 95% within 2 sigma, 99.7% within 3 sigma.",
      ml: "Used everywhere: feature normalisation, noise models, weight priors in Bayesian NNs, Gaussian Mixture Models, Gaussian Processes.",
    },
    bernoulli: {
      formula: "P(X=1) = p,  P(X=0) = 1-p",
      params: "p = probability of success (0 to 1)",
      props: "Simplest distribution. Mean = p, Variance = p(1-p). Variance is maximised at p=0.5.",
      ml: "Models binary labels (spam/not spam, click/no-click). Output of a sigmoid neuron. Basis of logistic regression.",
    },
    binomial: {
      formula: "P(X=k) = C(n,k) * p^k * (1-p)^(n-k)",
      params: "n = number of trials, p = probability per trial",
      props: "Sum of n independent Bernoulli trials. Mean = np, Variance = np(1-p). Approximates Gaussian for large n.",
      ml: "Models count of positive events: # of correct predictions in n samples. Used in A/B testing and hypothesis testing.",
    },
    poisson: {
      formula: "P(X=k) = (lambda^k * e^(-lambda)) / k!",
      params: "lambda = average rate of events per interval",
      props: "Mean = Variance = lambda. Models rare events in large populations. Derived as limit of Binomial with n->inf, p->0.",
      ml: "Models word counts in NLP, click counts, event frequencies. Used in count-based language models.",
    },
    beta: {
      formula: "f(x) = x^(alpha-1) * (1-x)^(beta-1) / B(alpha, beta)",
      params: "alpha, beta > 0. Support is x in (0,1).",
      props: "Flexible shape: uniform (a=b=1), U-shape (a=b<1), skewed, bell. Mean = alpha/(alpha+beta). Conjugate prior to Bernoulli/Binomial.",
      ml: "Used as a prior over probabilities in Bayesian inference. In variational autoencoders and topic models (LDA). Try alpha=beta=1 for uniform.",
    },
  };

  const d = info[dist];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {dists.map(d => (
          <button key={d.id} onClick={() => setDist(d.id)}
            style={{ padding: "5px 12px", borderRadius: 8, border: `1.5px solid ${dist === d.id ? d.color : "var(--color-border-tertiary)"}`,
              background: dist === d.id ? d.color + "22" : "transparent",
              color: dist === d.id ? d.color : "var(--color-text-secondary)",
              cursor: "pointer", fontSize: 13, fontWeight: dist === d.id ? 500 : 400 }}>
            {d.label}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} width={580} height={210} style={{ width: "100%", maxWidth: 580 }} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12 }}>
        {dist === "gaussian" && (<>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>mu: <b>{mu}</b><input type="range" min="-3" max="3" step="0.5" value={mu} onChange={e => setMu(+e.target.value)} style={{ display: "block", width: 130 }} /></label>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>sigma: <b>{sigma.toFixed(1)}</b><input type="range" min="0.3" max="2.5" step="0.1" value={sigma} onChange={e => setSigma(+e.target.value)} style={{ display: "block", width: 130 }} /></label>
        </>)}
        {(dist === "bernoulli" || dist === "binomial") && (
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>p: <b>{p.toFixed(1)}</b><input type="range" min="0.1" max="0.9" step="0.1" value={p} onChange={e => setP(+e.target.value)} style={{ display: "block", width: 180 }} /></label>
        )}
        {dist === "poisson" && (
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>lambda: <b>{lam}</b><input type="range" min="1" max="12" step="1" value={lam} onChange={e => setLam(+e.target.value)} style={{ display: "block", width: 180 }} /></label>
        )}
        {dist === "beta" && (<>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>alpha: <b>{alpha}</b><input type="range" min="0.5" max="10" step="0.5" value={alpha} onChange={e => setAlpha(+e.target.value)} style={{ display: "block", width: 130 }} /></label>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>beta: <b>{beta}</b><input type="range" min="0.5" max="10" step="0.5" value={beta} onChange={e => setBeta(+e.target.value)} style={{ display: "block", width: 130 }} /></label>
        </>)}
      </div>

      <Formula>{d.formula}</Formula>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, padding: "4px 14px" }}><b>Parameters:</b> {d.params}</div>
      <Card color={C.purple} title="Key properties">{d.props}</Card>
      <Card color={C.teal} title="ML use cases">{d.ml}</Card>
    </div>
  );
}

// ── 3. Expectation & Variance ─────────────────────────────────────────────────
function ExpectationVariance() {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const pad = { l: 48, r: 16, t: 24, b: 40 };
    const w = W - pad.l - pad.r, h = H - pad.t - pad.b;

    const xs = linspace(-6, 6, 300);
    const maxY = gaussian(mu, mu, sigma);
    const toX = x => pad.l + ((x + 6) / 12) * w;
    const toY = y => pad.t + h - (y / maxY) * h * 0.85;

    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + h); ctx.lineTo(pad.l + w, pad.t + h); ctx.stroke();

    // 2-sigma shading
    const in2 = xs.filter(x => x >= mu - 2*sigma && x <= mu + 2*sigma);
    ctx.beginPath(); ctx.fillStyle = C.purple + "18";
    ctx.moveTo(toX(mu - 2*sigma), pad.t + h);
    in2.forEach(x => ctx.lineTo(toX(x), toY(gaussian(x, mu, sigma))));
    ctx.lineTo(toX(mu + 2*sigma), pad.t + h); ctx.closePath(); ctx.fill();

    // 1-sigma shading
    const in1 = xs.filter(x => x >= mu - sigma && x <= mu + sigma);
    ctx.beginPath(); ctx.fillStyle = C.purple + "40";
    ctx.moveTo(toX(mu - sigma), pad.t + h);
    in1.forEach(x => ctx.lineTo(toX(x), toY(gaussian(x, mu, sigma))));
    ctx.lineTo(toX(mu + sigma), pad.t + h); ctx.closePath(); ctx.fill();

    // curve
    ctx.beginPath(); ctx.strokeStyle = C.purple; ctx.lineWidth = 2.5;
    xs.forEach((x, i) => {
      const px = toX(x), py = toY(gaussian(x, mu, sigma));
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();

    // mean line
    ctx.setLineDash([5,4]); ctx.strokeStyle = C.coral; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(toX(mu), pad.t + 4); ctx.lineTo(toX(mu), pad.t + h); ctx.stroke();
    ctx.setLineDash([]);

    // 1-sigma bracket
    const bracketY = pad.t + h * 0.3;
    ctx.strokeStyle = C.teal; ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(toX(mu), bracketY); ctx.lineTo(toX(mu + sigma), bracketY);
    ctx.moveTo(toX(mu + sigma), bracketY - 5); ctx.lineTo(toX(mu + sigma), bracketY + 5);
    ctx.stroke();
    ctx.fillStyle = C.tealD; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("1 sigma", toX(mu + sigma / 2), bracketY - 8);

    ctx.fillStyle = C.coral; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`E[X] = ${mu}`, toX(mu), pad.t + 13);

    // labels
    const ticks = [-4,-2,0,2,4];
    ticks.forEach(v => {
      const px = toX(v);
      if (px > pad.l && px < pad.l + w) {
        ctx.fillStyle = "#666"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(v, px, pad.t + h + 16);
      }
    });
  }, [mu, sigma]);

  const variance = (sigma ** 2).toFixed(2);

  return (
    <div>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 12 }}>
        Expectation is the "centre of gravity". Variance measures the spread. Together they summarise a distribution.
      </p>
      <canvas ref={canvasRef} width={580} height={210} style={{ width: "100%", maxWidth: 580 }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 12 }}>
        <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>E[X] = mu: <b style={{ color: C.coral }}>{mu}</b><input type="range" min="-3" max="3" step="0.5" value={mu} onChange={e => setMu(+e.target.value)} style={{ display: "block", width: 150 }} /></label>
        <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>sigma: <b style={{ color: C.teal }}>{sigma.toFixed(1)}</b><input type="range" min="0.4" max="2.5" step="0.1" value={sigma} onChange={e => setSigma(+e.target.value)} style={{ display: "block", width: 150 }} /></label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
        {[
          { label: "E[X] = mu", value: mu, color: C.coral },
          { label: "Var(X) = sigma^2", value: variance, color: C.purple },
          { label: "Std Dev sigma", value: sigma.toFixed(2), color: C.teal },
        ].map(c => (
          <div key={c.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 14px", borderLeft: `3px solid ${c.color}` }}>
            <div style={{ fontWeight: 500, fontSize: 11, color: c.color }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "4px 0" }}>{c.value}</div>
          </div>
        ))}
      </div>
      <Card color={C.coral} title="Expectation E[X]">
        The weighted average of all possible values. For discrete: E[X] = sum of x*P(X=x). For continuous: E[X] = integral of x*f(x)dx.
        <br/><b>Key properties:</b> E[aX + b] = aE[X] + b (linearity). E[X + Y] = E[X] + E[Y] always (even if X and Y are dependent).
        <br/><b>In ML:</b> Loss functions minimise expected loss. Gradient = E[gradient of single-sample loss].
      </Card>
      <Card color={C.purple} title="Variance Var(X) = E[(X - mu)^2]">
        Average squared deviation from the mean. Always non-negative. Alternative formula: Var(X) = E[X^2] - (E[X])^2.
        <br/><b>Key properties:</b> Var(aX + b) = a^2 * Var(X). For independent X,Y: Var(X+Y) = Var(X) + Var(Y).
        <br/><b>In ML:</b> Bias-variance tradeoff — models with high variance overfit. Variance of gradient estimates in SGD drives learning instability.
      </Card>
      <Card color={C.teal} title="Standard Deviation sigma = sqrt(Var(X))">
        Square root of variance — restores original units. The "typical" deviation from the mean.
        <br/>For Gaussian: 68% of values lie within mu±1sigma, 95% within mu±2sigma, 99.7% within mu±3sigma (the empirical rule).
        <br/><b>In ML:</b> Feature standardisation (z-score = (x - mu)/sigma) makes features comparable. Batch normalisation applies this layer-by-layer inside neural networks.
      </Card>
    </div>
  );
}

// ── 4. Bayes ─────────────────────────────────────────────────────────────────
function BayesTheorem() {
  const [prior, setPrior] = useState(0.01);
  const [sensitivity, setSensitivity] = useState(0.95);
  const [specificity, setSpecificity] = useState(0.90);

  const falsePositiveRate = 1 - specificity;
  const pPos = sensitivity * prior + falsePositiveRate * (1 - prior);
  const posterior = (sensitivity * prior) / pPos;
  const pct = v => `${(v * 100).toFixed(1)}%`;

  const stages = [
    { label: "Prior P(D)", value: prior, color: C.amber, desc: "Disease prevalence" },
    { label: "Likelihood P(+|D)", value: sensitivity, color: C.purple, desc: "Sensitivity" },
    { label: "Evidence P(+)", value: +pPos.toFixed(4), color: C.gray, desc: "All positive tests" },
    { label: "Posterior P(D|+)", value: +posterior.toFixed(4), color: C.teal, desc: "True probability" },
  ];

  return (
    <div>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 14 }}>
        Bayes' theorem updates a prior belief with new evidence to compute a posterior belief. Drag the sliders to see the base rate fallacy in action.
      </p>
      <Formula>P(theta | X) = P(X | theta) * P(theta) / P(X)</Formula>

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {stages.map((s, i) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ background: s.color + "22", border: `1.5px solid ${s.color}55`, borderRadius: 10, padding: "8px 12px", textAlign: "center", minWidth: 90 }}>
              <div style={{ fontSize: 10, color: s.color, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)" }}>{pct(s.value)}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{s.desc}</div>
            </div>
            {i < stages.length - 1 && <div style={{ fontSize: 18, color: "var(--color-text-secondary)" }}>→</div>}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Prior P(disease)", val: prior, set: setPrior, min: 0.001, max: 0.2, step: 0.001, c: C.amber },
          { label: "Sensitivity P(+|disease)", val: sensitivity, set: setSensitivity, min: 0.5, max: 0.999, step: 0.01, c: C.purple },
          { label: "Specificity P(-|healthy)", val: specificity, set: setSpecificity, min: 0.5, max: 0.999, step: 0.01, c: C.blue },
        ].map(ctrl => (
          <div key={ctrl.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: ctrl.c, minWidth: 230, fontWeight: 500 }}>{ctrl.label}: {pct(ctrl.val)}</span>
            <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={ctrl.val}
              onChange={e => ctrl.set(+e.target.value)} style={{ flex: 1 }} />
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 14px", borderRadius: 10, background: C.tealL, border: `1px solid ${C.teal}44`, marginBottom: 14 }}>
        <div style={{ fontWeight: 500, fontSize: 13 }}>
          With {pct(sensitivity)} sensitivity and a positive result, the true disease probability is only <span style={{ color: C.teal, fontWeight: 700 }}>{pct(posterior)}</span>.
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>
          Low disease prevalence ({pct(prior)}) means most positive tests are false positives — this is the <b>base rate fallacy</b>.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { t: "Prior P(theta)", d: "Your belief before seeing data. In ML: initial weight distributions in Bayesian NNs, or class priors in Naive Bayes. Encodes domain knowledge.", c: C.amber },
          { t: "Likelihood P(X|theta)", d: "How probable is the observed data given parameters? Maximising this gives MLE. It measures how well a model 'explains' the data.", c: C.purple },
          { t: "Posterior P(theta|X)", d: "Updated belief after seeing data. Goal of Bayesian inference. Combines prior knowledge with data evidence. Usually intractable in closed form.", c: C.teal },
          { t: "Evidence P(X)", d: "Normalising constant ensuring posterior sums to 1. Requires integrating over all parameter values — intractable for most models. Avoided via MCMC, variational inference, or MAP.", c: C.gray },
        ].map(c => (
          <div key={c.t} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${c.c}` }}>
            <div style={{ fontWeight: 500, fontSize: 12, color: c.c }}>{c.t}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 3 }}>{c.d}</div>
          </div>
        ))}
      </div>
      <Card color={C.blue} title="Conjugate priors — a key trick">
        When the prior and posterior have the same distribution family, we call it a conjugate prior. This lets us compute the posterior analytically without integration.
        <br/><b>Beta-Binomial:</b> Beta prior + Binomial likelihood = Beta posterior. Perfect for coin-flip problems.
        <br/><b>Gaussian-Gaussian:</b> Gaussian prior on mu + Gaussian likelihood = Gaussian posterior. Used in Kalman filters.
        <br/><b>Dirichlet-Multinomial:</b> Dirichlet prior + categorical data = Dirichlet posterior. Used in topic models (LDA).
      </Card>
    </div>
  );
}

// ── 5. Information Theory ─────────────────────────────────────────────────────
function InformationTheory() {
  const [pVals, setPVals] = useState([0.25, 0.25, 0.25, 0.25]);
  const canvasRef = useRef(null);

  const setP = (i, v) => {
    const newP = [...pVals];
    newP[i] = v;
    const total = newP.reduce((s, x) => s + x, 0);
    setPVals(newP.map(x => x / total));
  };

  const entropy = -pVals.reduce((s, p) => s + (p > 0 ? p * Math.log2(p) : 0), 0);
  const maxEntropy = Math.log2(4);
  const uniformCE = -pVals.reduce((s, p) => s + p * Math.log2(0.25), 0);
  const klDiv = Math.max(0, pVals.reduce((s, p) => s + (p > 0 ? p * Math.log2(p / 0.25) : 0), 0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const pad = { l: 48, r: 16, t: 28, b: 36 };
    const w = W - pad.l - pad.r, h = H - pad.t - pad.b;

    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + h); ctx.lineTo(pad.l + w, pad.t + h); ctx.stroke();

    const colors = [C.purple, C.teal, C.coral, C.amber];
    const labels = ["A", "B", "C", "D"];
    const bw = (w - 60) / 4;

    pVals.forEach((p, i) => {
      const bx = pad.l + 30 + i * (bw + 10);
      const bh = p * h * 0.85;
      ctx.fillStyle = colors[i];
      ctx.fillRect(bx, pad.t + h - bh, bw, bh);
      const bits = p > 0 ? (-Math.log2(p)).toFixed(1) : "inf";
      ctx.fillStyle = "#444"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(labels[i], bx + bw / 2, pad.t + h + 14);
      ctx.fillText(`${(p * 100).toFixed(0)}%`, bx + bw / 2, pad.t + h - bh - 14);
      ctx.fillStyle = colors[i];
      ctx.fillText(`${bits}b`, bx + bw / 2, pad.t + h - bh - 4);
    });

    // entropy bar
    const entW = (entropy / maxEntropy) * w * 0.55;
    ctx.fillStyle = C.blue + "33";
    ctx.fillRect(pad.l, pad.t + 2, entW, 10);
    ctx.strokeStyle = C.blue; ctx.lineWidth = 1;
    ctx.strokeRect(pad.l, pad.t + 2, w * 0.55, 10);
    ctx.fillStyle = C.blue; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
    ctx.fillText(`H(X) = ${entropy.toFixed(3)} bits  (max = ${maxEntropy.toFixed(2)})`, pad.l + w * 0.55 + 8, pad.t + 11);
  }, [pVals]);

  return (
    <div>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 12 }}>
        Adjust probabilities of 4 outcomes. Entropy peaks at uniform — maximum uncertainty. Each bar also shows its <b>self-information</b> (surprise in bits).
      </p>
      <canvas ref={canvasRef} width={560} height={190} style={{ width: "100%", maxWidth: 560 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
        {["A","B","C","D"].map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: [C.purple,C.teal,C.coral,C.amber][i], minWidth: 50, fontWeight: 500 }}>{label}: {(pVals[i]*100).toFixed(0)}%</span>
            <input type="range" min="1" max="100" step="1" value={Math.round(pVals[i]*100)} onChange={e => setP(i, +e.target.value/100)} style={{ flex: 1 }} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
        {[
          { label: "Entropy H(X)", value: entropy.toFixed(4), unit: "bits", color: C.blue },
          { label: "Cross-Entropy H(P,Q)", value: uniformCE.toFixed(4), unit: "bits", color: C.purple },
          { label: "KL Divergence D(P||Q)", value: klDiv.toFixed(4), unit: "bits", color: C.coral },
        ].map(c => (
          <div key={c.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 12px", borderLeft: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 11, color: c.color, fontWeight: 500 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)", margin: "4px 0" }}>{c.value}</div>
            <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{c.unit}</div>
          </div>
        ))}
      </div>
      <Card color={C.blue} title="Entropy H(X) = -sum P(x) * log2 P(x)">
        Entropy measures the average surprise or uncertainty in a distribution. High entropy = uniform, hard to predict. Low entropy = peaked, easy to predict.
        <br/><b>Intuition:</b> If P(A)=1.0, entropy=0 (no surprise ever). If all 4 outcomes are equally likely, entropy=2 bits (need 2 binary questions to identify outcome).
        <br/><b>Self-information:</b> The bar label shows -log2(P) for each outcome — how many bits of surprise you'd feel if that outcome occurred. Rare events carry more information.
      </Card>
      <Card color={C.purple} title="Cross-Entropy H(P, Q) = -sum P(x) * log Q(x)">
        Measures how many bits are needed to encode events from distribution P using a code designed for Q.
        <br/><b>In ML:</b> The standard loss for classification. True labels = P (one-hot). Model output (softmax) = Q. Minimising H(P,Q) pushes Q toward P.
        <br/><b>Relation:</b> H(P, Q) = H(P) + KL(P||Q). Since H(P) is constant, minimising cross-entropy = minimising KL divergence.
      </Card>
      <Card color={C.coral} title="KL Divergence D(P||Q) = sum P(x) * log(P(x)/Q(x))">
        Measures how different Q is from P. Always non-negative. Zero iff P = Q. NOT symmetric: D(P||Q) != D(Q||P).
        <br/><b>Forward KL (inclusive):</b> D(P||Q) — Q must cover wherever P has mass. Used in VAEs for the encoder objective.
        <br/><b>Reverse KL (exclusive):</b> D(Q||P) — Q can ignore modes of P. Used in variational inference.
        <br/><b>Mutual Information:</b> I(X;Y) = D(P(X,Y) || P(X)P(Y)) — how much knowing X reduces uncertainty about Y.
      </Card>
    </div>
  );
}

// ── 6. Key Theorems ───────────────────────────────────────────────────────────
function KeyTheorems() {
  const [nSamples, setNSamples] = useState(30);
  const canvasRef = useRef(null);
  const seedRef = useRef(Array.from({ length: 3000 }, () => Math.random()));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const pad = { l: 48, r: 16, t: 24, b: 36 };
    const w = W - pad.l - pad.r, h = H - pad.t - pad.b;

    const trials = 800;
    const means = [];
    for (let t = 0; t < trials; t++) {
      let sum = 0;
      for (let i = 0; i < nSamples; i++) sum += seedRef.current[(t * nSamples + i) % 3000];
      means.push(sum / nSamples);
    }
    const mn = 0.5, sd = 1 / (Math.sqrt(12) * Math.sqrt(nSamples));
    const minM = mn - 4 * sd, maxM = mn + 4 * sd;
    const bins = 30;
    const hist = Array(bins).fill(0);
    means.forEach(m => {
      const b = Math.floor(((m - minM) / (maxM - minM)) * bins);
      if (b >= 0 && b < bins) hist[b]++;
    });
    const maxH = Math.max(...hist);

    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + h); ctx.lineTo(pad.l + w, pad.t + h); ctx.stroke();

    const bw = w / bins;
    hist.forEach((cnt, i) => {
      const bh = (cnt / maxH) * h * 0.85;
      ctx.fillStyle = C.purple + "88";
      ctx.fillRect(pad.l + i * bw, pad.t + h - bh, bw - 1, bh);
    });

    ctx.beginPath(); ctx.strokeStyle = C.teal; ctx.lineWidth = 2.5;
    for (let i = 0; i <= 200; i++) {
      const x = minM + (i / 200) * (maxM - minM);
      const density = gaussian(x, mn, sd);
      const py = pad.t + h - (density * sd * Math.sqrt(2 * Math.PI) * trials * bw / (maxM - minM)) / maxH * h * 0.85;
      const px = pad.l + ((x - minM) / (maxM - minM)) * w;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.fillStyle = "#777"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`Histogram of ${trials} sample means (n=${nSamples} uniform RVs each)`, pad.l + w/2, pad.t + 12);
  }, [nSamples]);

  return (
    <div>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 12 }}>
        Central Limit Theorem live: sample means of uniform RVs converge to a Gaussian (teal curve) as n grows.
      </p>
      <canvas ref={canvasRef} width={560} height={200} style={{ width: "100%", maxWidth: 560 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>n = <b style={{ color: C.purple }}>{nSamples}</b></span>
        <input type="range" min="1" max="100" step="1" value={nSamples} onChange={e => setNSamples(+e.target.value)} style={{ flex: 1, maxWidth: 220 }} />
        <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>n=1 (uniform) → n=100 (Gaussian)</span>
      </div>

      {[
        {
          name: "Law of Large Numbers (LLN)", color: C.purple,
          formula: "X_bar_n → mu  as  n → infinity",
          explain: "As sample size grows, the sample mean converges to the true population mean. Two versions: Weak LLN (convergence in probability) and Strong LLN (almost sure convergence).",
          ml: "Foundation of empirical risk minimisation. Justifies approximating the true expected loss with a finite training set average. Why more data = better model.",
        },
        {
          name: "Central Limit Theorem (CLT)", color: C.teal,
          formula: "sqrt(n) * (X_bar - mu) / sigma  ->  N(0, 1)",
          explain: "The sum or mean of n i.i.d. random variables approaches a Gaussian distribution as n grows — regardless of the original distribution shape. Only requires finite mean and variance.",
          ml: "Explains why Gaussian noise appears everywhere. Enables confidence intervals in A/B testing. Justifies Gaussian assumptions in many models. Why mini-batch gradient estimates are approximately Gaussian.",
        },
        {
          name: "Jensen's Inequality", color: C.coral,
          formula: "f(E[X]) <= E[f(X)]  for convex f  (reversed for concave)",
          explain: "For a convex function f (bowl-shaped), applying f after averaging gives a smaller result than averaging after applying f. Reversed for concave functions like log: log(E[X]) >= E[log(X)].",
          ml: "EM algorithm: proves the ELBO lower bounds log-likelihood. VAEs: the KL + reconstruction loss is a valid lower bound on log P(X). Proves log-sum inequality used in information theory proofs.",
        },
        {
          name: "Markov & Chebyshev Inequalities", color: C.amber,
          formula: "P(X >= a) <= E[X]/a  |  P(|X-mu| >= k*sigma) <= 1/k^2",
          explain: "Markov: a weak tail bound using only the mean — P(X >= a) <= E[X]/a for non-negative X. Chebyshev tightens this using variance, showing that at least (1 - 1/k^2) of values lie within k standard deviations of the mean.",
          ml: "PAC (Probably Approximately Correct) learning theory. Generalisation bounds — how many samples are needed to guarantee a model performs well on unseen data. Hoeffding's inequality (a sharper version) is used in RL (bandit algorithms) and online learning.",
        },
      ].map(t => (
        <div key={t.name} style={{ borderRadius: 10, border: `1px solid ${t.color}33`, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ background: t.color + "22", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
            <span style={{ fontWeight: 500, color: t.color, fontSize: 14 }}>{t.name}</span>
            <code style={{ fontSize: 11, color: t.color, background: t.color + "22", padding: "2px 8px", borderRadius: 6 }}>{t.formula}</code>
          </div>
          <div style={{ padding: "10px 14px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            <div>{t.explain}</div>
            <div style={{ marginTop: 6, color: t.color }}><b>ML:</b> {t.ml}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 7. MLE vs MAP ─────────────────────────────────────────────────────────────
function MLEvsMAP() {
  const [nObs, setNObs] = useState(10);
  const [nHeads, setNHeads] = useState(7);
  const [priorAlpha, setPriorAlpha] = useState(2);
  const [priorBeta, setPriorBeta] = useState(2);
  const canvasRef = useRef(null);

  function lgamma(z) {
    const c = [76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];
    let y = z, x = z, tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) ser += c[j] / ++y;
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
  function betaPDF(x, a, b) {
    if (x <= 0 || x >= 1) return 0;
    const logB = lgamma(a) + lgamma(b) - lgamma(a + b);
    return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB);
  }

  const mle = nObs > 0 ? nHeads / nObs : 0;
  const postAlpha = priorAlpha + nHeads;
  const postBeta = priorBeta + (nObs - nHeads);
  const map = (postAlpha - 1) / (postAlpha + postBeta - 2);
  const postMean = postAlpha / (postAlpha + postBeta);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const pad = { l: 48, r: 16, t: 24, b: 36 };
    const w = W - pad.l - pad.r, h = H - pad.t - pad.b;

    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + h); ctx.lineTo(pad.l + w, pad.t + h); ctx.stroke();

    const xs = linspace(0.001, 0.999, 300);
    const priorY = xs.map(x => betaPDF(x, priorAlpha, priorBeta));
    const postY = xs.map(x => betaPDF(x, postAlpha, postBeta));
    const likY = xs.map(x => {
      const ll = nHeads * Math.log(x) + (nObs - nHeads) * Math.log(1 - x);
      return Math.exp(ll - Math.max(...xs.map(xx => nHeads * Math.log(xx) + (nObs - nHeads) * Math.log(1 - xx))));
    });

    const allMaxY = Math.max(...priorY, ...postY, ...likY);

    const draw = (ys, color, dash) => {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2;
      if (dash) ctx.setLineDash([5,3]); else ctx.setLineDash([]);
      xs.forEach((x, i) => {
        const px = pad.l + x * w;
        const py = pad.t + h - (ys[i] / allMaxY) * h * 0.85;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke(); ctx.setLineDash([]);
    };

    draw(priorY, C.amber, true);
    draw(likY, C.coral, true);
    draw(postY, C.teal, false);

    // MLE vertical
    ctx.strokeStyle = C.coral + "cc"; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(pad.l + mle * w, pad.t); ctx.lineTo(pad.l + mle * w, pad.t + h); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = C.coral; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`MLE=${mle.toFixed(2)}`, pad.l + mle * w, pad.t + 10);

    // MAP vertical
    if (map > 0 && map < 1) {
      ctx.strokeStyle = C.teal + "cc"; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.moveTo(pad.l + map * w, pad.t); ctx.lineTo(pad.l + map * w, pad.t + h); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.teal; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`MAP=${map.toFixed(2)}`, pad.l + map * w, pad.t + 20);
    }

    [0, 0.25, 0.5, 0.75, 1].forEach(v => {
      ctx.fillStyle = "#666"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(v.toFixed(2), pad.l + v * w, pad.t + h + 16);
    });
  }, [nObs, nHeads, priorAlpha, priorBeta]);

  return (
    <div>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 12 }}>
        Coin-flip example. Observe heads out of flips and see how MLE (ignores prior) vs MAP (uses prior) differ — especially with few samples.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        {[
          { label: "Total flips (n)", val: nObs, set: setNObs, min: 1, max: 50, step: 1, c: C.purple },
          { label: "Heads observed", val: nHeads, set: v => setNHeads(Math.min(v, nObs)), min: 0, max: nObs, step: 1, c: C.coral },
          { label: "Prior alpha", val: priorAlpha, set: setPriorAlpha, min: 0.5, max: 10, step: 0.5, c: C.amber },
          { label: "Prior beta", val: priorBeta, set: setPriorBeta, min: 0.5, max: 10, step: 0.5, c: C.amber },
        ].map(ctrl => (
          <label key={ctrl.label} style={{ fontSize: 13, color: "var(--color-text-secondary)", minWidth: 140 }}>
            {ctrl.label}: <b style={{ color: ctrl.c }}>{typeof ctrl.val === "number" ? ctrl.val : ctrl.val.toFixed(1)}</b>
            <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={ctrl.val} onChange={e => ctrl.set(+e.target.value)} style={{ display: "block", width: 130 }} />
          </label>
        ))}
      </div>
      <canvas ref={canvasRef} width={560} height={200} style={{ width: "100%", maxWidth: 560 }} />
      <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", fontSize: 12 }}>
        {[
          { label: "Prior (dashed)", color: C.amber }, { label: "Likelihood (dashed)", color: C.coral }, { label: "Posterior", color: C.teal },
        ].map(l => (
          <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--color-text-secondary)" }}>
            <span style={{ width: 18, height: 3, background: l.color, display: "inline-block", borderRadius: 2 }}></span>{l.label}
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
        {[
          { label: "MLE estimate", value: mle.toFixed(3), color: C.coral, desc: "= heads/flips" },
          { label: "MAP estimate", value: map > 0 && map < 1 ? map.toFixed(3) : "N/A", color: C.teal, desc: "= mode of posterior" },
          { label: "Posterior mean", value: postMean.toFixed(3), color: C.purple, desc: "= full Bayes estimate" },
        ].map(c => (
          <div key={c.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 12px", borderLeft: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 11, color: c.color, fontWeight: 500 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "4px 0" }}>{c.value}</div>
            <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{c.desc}</div>
          </div>
        ))}
      </div>
      <Card color={C.coral} title="Maximum Likelihood Estimation (MLE)">
        Find theta* = argmax P(data | theta). Maximise the likelihood — find parameters that make the observed data most probable.
        <br/><b>Formula:</b> theta_MLE = argmax sum of log P(xi | theta)  (log converts product to sum, easier to differentiate).
        <br/><b>Problem:</b> With small datasets, MLE overfits. 7 heads in 10 flips -> MLE says P(head)=0.7, even if coin is fair.
        <br/><b>In ML:</b> Training a neural network with cross-entropy loss IS MLE under a Gaussian/Bernoulli output assumption.
      </Card>
      <Card color={C.teal} title="Maximum A Posteriori (MAP)">
        Find theta* = argmax P(theta | data) = argmax P(data | theta) * P(theta). Like MLE but adds a prior term.
        <br/><b>Effect:</b> The prior regularises estimates toward prior beliefs, especially when data is scarce. With infinite data, MAP = MLE.
        <br/><b>In ML:</b> L2 regularisation (weight decay) IS MAP with a Gaussian prior on weights. L1 regularisation = Laplace prior. MAP is the bridge between pure optimisation and Bayesian inference.
      </Card>
    </div>
  );
}

// ── 8. Covariance & Correlation ───────────────────────────────────────────────
function CovarianceCorrelation() {
  const [rho, setRho] = useState(0.7);
  const canvasRef = useRef(null);
  const seedRef = useRef(Array.from({ length: 200 }, () => [Math.random(), Math.random()]));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const pad = { l: 48, r: 16, t: 20, b: 36 };
    const w = W - pad.l - pad.r, h = H - pad.t - pad.b;

    // generate correlated data
    const pts = seedRef.current.map(([u1, u2]) => {
      const z1 = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
      const z2 = Math.sqrt(-2 * Math.log(Math.max(u2, 1e-10))) * Math.sin(2 * Math.PI * u1);
      const x = z1;
      const y = rho * z1 + Math.sqrt(1 - rho * rho) * z2;
      return { x, y };
    });

    const allX = pts.map(p => p.x), allY = pts.map(p => p.y);
    const minX = Math.min(...allX), maxX = Math.max(...allX);
    const minY = Math.min(...allY), maxY = Math.max(...allY);
    const toX = v => pad.l + ((v - minX) / (maxX - minX)) * w;
    const toY = v => pad.t + h - ((v - minY) / (maxY - minY)) * h;

    ctx.strokeStyle = "#ddd"; ctx.lineWidth = 0.5;
    const mx = toX(0), my = toY(0);
    ctx.beginPath(); ctx.moveTo(mx, pad.t); ctx.lineTo(mx, pad.t + h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l, my); ctx.lineTo(pad.l + w, my); ctx.stroke();

    pts.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(toX(x), toY(y), 3, 0, Math.PI * 2);
      ctx.fillStyle = rho > 0 ? C.purple + "88" : rho < 0 ? C.coral + "88" : C.gray + "88";
      ctx.fill();
    });

    // regression line
    const n = pts.length;
    const mx2 = allX.reduce((s, v) => s + v, 0) / n;
    const my2 = allY.reduce((s, v) => s + v, 0) / n;
    const slope = allX.reduce((s, v, i) => s + (v - mx2) * (allY[i] - my2), 0) /
      allX.reduce((s, v) => s + (v - mx2) ** 2, 0);
    const intercept = my2 - slope * mx2;
    ctx.beginPath(); ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
    ctx.moveTo(toX(minX), toY(slope * minX + intercept));
    ctx.lineTo(toX(maxX), toY(slope * maxX + intercept));
    ctx.stroke(); ctx.setLineDash([]);

    ctx.fillStyle = "#555"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`rho = ${rho.toFixed(2)}`, pad.l + w / 2, pad.t + 14);
  }, [rho]);

  const strength = Math.abs(rho) > 0.7 ? "strong" : Math.abs(rho) > 0.3 ? "moderate" : "weak";
  const direction = rho > 0 ? "positive" : rho < 0 ? "negative" : "no";

  return (
    <div>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 12 }}>
        Drag the slider to change correlation rho between two variables. Watch the scatter plot shape change.
      </p>
      <canvas ref={canvasRef} width={480} height={240} style={{ width: "100%", maxWidth: 480 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)", minWidth: 80 }}>rho = <b style={{ color: rho > 0 ? C.purple : C.coral }}>{rho.toFixed(2)}</b></span>
        <input type="range" min="-0.99" max="0.99" step="0.01" value={rho} onChange={e => setRho(+e.target.value)} style={{ flex: 1, maxWidth: 240 }} />
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{strength} {direction} correlation</span>
      </div>
      <Card color={C.purple} title="Covariance Cov(X,Y) = E[(X - mu_x)(Y - mu_y)]">
        Measures how two variables vary together. Positive = they move in the same direction. Negative = opposite directions. Zero = no linear relationship (but could have non-linear dependence).
        <br/><b>Alternative formula:</b> Cov(X,Y) = E[XY] - E[X]E[Y]. If X and Y are independent, Cov = 0.
        <br/><b>Units:</b> In original units of X times Y — hard to interpret on its own. That's why we normalise to correlation.
      </Card>
      <Card color={C.teal} title="Correlation rho = Cov(X,Y) / (sigma_x * sigma_y)">
        Normalised covariance. Always in [-1, +1]. rho = +1: perfect positive linear relationship. rho = -1: perfect negative. rho = 0: no linear relationship.
        <br/><b>Beware:</b> Correlation only captures LINEAR relationships. Two variables can be strongly related (e.g. Y = X^2) yet have rho = 0.
        <br/><b>In ML:</b> Feature correlation = multicollinearity. Highly correlated features carry redundant info. PCA diagonalises the covariance matrix to find uncorrelated directions.
      </Card>
      <Card color={C.coral} title="Covariance matrix — for multiple variables">
        For a random vector X = [X1, X2, ..., Xd], the covariance matrix Sigma is a d×d matrix where Sigma_ij = Cov(Xi, Xj) and diagonal = variances.
        <br/><b>Properties:</b> Symmetric, positive semi-definite. Eigenvalues = variance along principal directions. Eigenvectors = principal components (PCA!).
        <br/><b>In ML:</b> Gaussian distribution is parameterised by (mu, Sigma). Mahalanobis distance uses Sigma^-1 to account for correlations. LDA uses class covariances.
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
const SECTION_MAP = {
  foundations: { component: Foundations, title: "Foundations", subtitle: "Random variables, PMF, PDF, CDF, sum & product rules" },
  distributions: { component: Distributions, title: "Key Distributions", subtitle: "Gaussian, Bernoulli, Binomial, Poisson, Beta" },
  expectation: { component: ExpectationVariance, title: "Expectation & Variance", subtitle: "E[X], Var(X), linearity, empirical rule" },
  bayes: { component: BayesTheorem, title: "Bayes' Theorem", subtitle: "Prior → Likelihood → Posterior, conjugate priors" },
  information: { component: InformationTheory, title: "Information Theory", subtitle: "Entropy, Cross-Entropy, KL Divergence, Mutual Information" },
  theorems: { component: KeyTheorems, title: "Key Theorems", subtitle: "LLN, CLT, Jensen's Inequality, Markov & Chebyshev" },
  mle: { component: MLEvsMAP, title: "MLE vs MAP Estimation", subtitle: "Likelihood, priors, regularisation as Bayesian inference" },
  covariance: { component: CovarianceCorrelation, title: "Covariance & Correlation", subtitle: "Joint variability, covariance matrix, PCA connection" },
};

export default function App() {
  const [active, setActive] = useState("foundations");
  const { component: Section, title, subtitle } = SECTION_MAP[active];

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 700, margin: "0 auto", padding: "16px 0" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {TOPICS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
              border: active === t.id ? `1.5px solid ${C.purple}` : "1px solid var(--color-border-tertiary)",
              background: active === t.id ? C.purpleL : "transparent",
              color: active === t.id ? C.purpleD : "var(--color-text-secondary)",
              transition: "all .15s",
            }}>
            {t.label}
          </button>
        ))}
      </div>
      <SectionHeader title={title} subtitle={subtitle} />
      <Section />
    </div>
  );
}
