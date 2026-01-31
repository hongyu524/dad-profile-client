import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

let stocks = [];
let industries = [];

const ensureId = (item) => item.id ?? crypto.randomUUID();

app.get('/stocks', (_req, res) => {
  res.json(stocks);
});

app.post('/stocks', (req, res) => {
  const incoming = { ...req.body, id: ensureId(req.body) };
  const existingIndex = stocks.findIndex((s) => s.id === incoming.id);
  if (existingIndex >= 0) {
    stocks[existingIndex] = { ...stocks[existingIndex], ...incoming };
    return res.json(stocks[existingIndex]);
  }
  stocks.push(incoming);
  res.status(201).json(incoming);
});

app.put('/stocks/:id', (req, res) => {
  const idx = stocks.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Stock not found' });
  stocks[idx] = { ...stocks[idx], ...req.body, id: req.params.id };
  res.json(stocks[idx]);
});

app.delete('/stocks/:id', (req, res) => {
  stocks = stocks.filter((s) => s.id !== req.params.id);
  res.json({ ok: true });
});

app.get('/industries', (_req, res) => {
  res.json(industries);
});

app.post('/industries', (req, res) => {
  const incoming = { ...req.body, id: ensureId(req.body) };
  const existingIndex = industries.findIndex((i) => i.id === incoming.id);
  if (existingIndex >= 0) {
    industries[existingIndex] = { ...industries[existingIndex], ...incoming };
    return res.json(industries[existingIndex]);
  }
  industries.push(incoming);
  res.status(201).json(incoming);
});

app.put('/industries/:id', (req, res) => {
  const idx = industries.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Industry not found' });
  industries[idx] = { ...industries[idx], ...req.body, id: req.params.id };
  res.json(industries[idx]);
});

app.delete('/industries/:id', (req, res) => {
  industries = industries.filter((i) => i.id !== req.params.id);
  res.json({ ok: true });
});

app.post('/ai/invoke', (req, res) => {
  const { type, prompt, stockId } = req.body || {};
  if (type === 'news') {
    return res.json({ news: [] });
  }
  if (type === 'analysis') {
    return res.json({
      summary_one_line: 'Mock AI summary',
      ai_stance: '中性',
      confidence_level: '中',
      data_time_range: '最近30天',
      industry_analysis: 'Mock industry analysis',
      institution_analysis: 'Mock institution analysis',
      news_summary: 'Mock news summary',
      risk_analysis: 'Mock risk analysis',
      comprehensive_view: 'Mock comprehensive view',
      stock_id: stockId,
      prompt_used: prompt,
    });
  }
  return res.json({ text: 'Mock AI response', stock_id: stockId, prompt_used: prompt, type });
});

app.listen(port, () => {
  console.log(`Mock API server running on http://localhost:${port}`);
});
