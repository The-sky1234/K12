import { promises as fs } from 'node:fs'
import path from 'node:path'

const FILES = {
  docs: 'docs.json',
  resources: 'resources.json',
  tasks: 'tasks.json',
  templates: 'templates.json',
  discussions: 'discussions.json',
  versions: 'versions.json',
  logs: 'logs.json',
  activities: 'activities.json',
  aiSettings: 'ai-settings.json',
  // 服务端真Key只存这里：ctx.dataDir/models-secrets.json（0o600，仅server.js可读）
  // models.json 是随包静态文件，可被前端/静态访问，绝不能放Key
  aiSecrets: 'models-secrets.json'
}

const FALLBACK_MODEL_PRESETS = [
  { id: 'deepseek/deepseek-chat', label: 'DeepSeek V4', desc: '默认直连 DeepSeek V4' },
  { id: '', label: '跟随系统默认模型', desc: '走宿主 Core 默认模型（备用）' },
  { id: 'google/gemini-flash', label: 'Gemini Flash（备用）', desc: 'flash 高速备用通道' }
]

const DEFAULT_TEMPLATES = [
  {
    id: 'tpl-class-hour',
    name: '课时教案模板（新课标·深圳版）',
    subject: '通用',
    description: '课时教案：学情分析、重难点、教学目标、流程、反思为必填',
    fields: [
      { key: 'objectives', label: '教学目标', required: true },
      { key: 'keyPoints', label: '教学重难点', required: true },
      { key: 'studentAnalysis', label: '学情分析', required: true },
      { key: 'process', label: '教学流程', required: true },
      { key: 'import', label: '课堂导入设计', required: false },
      { key: 'activities', label: '课堂活动设计', required: false },
      { key: 'board', label: '板书设计', required: false },
      { key: 'taskSheet', label: '课堂任务单', required: false },
      { key: 'exercises', label: '随堂练习', required: false },
      { key: 'reflection', label: '教学反思', required: true }
    ],
    builtin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tpl-unit',
    name: '单元整体教学设计模板',
    subject: '通用',
    description: '单元整体备课：单元目标、课时划分必填',
    fields: [
      { key: 'unitGoals', label: '单元教学目标', required: true },
      { key: 'keyPoints', label: '单元重难点', required: true },
      { key: 'studentAnalysis', label: '学情分析', required: true },
      { key: 'lessonSplit', label: '课时划分', required: true },
      { key: 'process', label: '教学流程', required: true },
      { key: 'reflection', label: '教学反思', required: false }
    ],
    builtin: true,
    createdAt: new Date().toISOString()
  }
]

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

async function readJson(dataDir, file, fallback) {
  try {
    const raw = await fs.readFile(path.join(dataDir, file), 'utf-8')
    return JSON.parse(raw) ?? fallback
  } catch { return fallback }
}

async function writeJson(dataDir, file, value) {
  await fs.mkdir(dataDir, { recursive: true })
  const tmp = path.join(dataDir, `.${file}.tmp`)
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), { mode: 0o600 })
  await fs.rename(tmp, path.join(dataDir, file))
  try { await fs.chmod(path.join(dataDir, file), 0o600) } catch {}
}

async function appendLog(ctx, entry) {
  const logs = await readJson(ctx.dataDir, FILES.logs, [])
  logs.push({ id: uid('log'), at: new Date().toISOString(), ...entry })
  await writeJson(ctx.dataDir, FILES.logs, logs)
  return logs[logs.length - 1]
}

function actorOf(ctx, request) {
  try {
    const identity = ctx.identity?.getContext?.(request)
    if (identity?.user?.username) return identity.user.username
  } catch {}
  const b = request?.body
  if (b && typeof b.actor === 'string' && b.actor.trim()) return b.actor.trim().slice(0, 32)
  const q = request?.query
  if (q && typeof q.actor === 'string' && q.actor.trim()) return q.actor.trim().slice(0, 32)
  return '教师'
}

function missingRequired(template, content) {
  if (!template || !Array.isArray(template.fields)) return []
  return template.fields.filter(f => f.required).filter(f => {
    const v = content ? content[f.key] : ''
    return !v || !String(v).trim()
  }).map(f => ({ key: f.key, label: f.label }))
}

function ensureReview(doc) {
  if (!doc.review || typeof doc.review !== 'object') {
    doc.review = { status: 'draft', comment: '', reviewer: '', at: '', history: [] }
  }
  if (!Array.isArray(doc.review.history)) doc.review.history = []
  return doc.review
}

function localDesign(input) {
  const { stage = '初中', subject = '语文', grade = '七年级', edition = '深圳版', unit = '', topic = '' } = input || {}
  const title = topic || unit || `${subject}示范课`
  return {
    title: `${title}教学设计（参考草稿，需人工确认）`,
    sections: [
      { key: 'objectives', label: '教学目标', text: `1.依据新课标与${edition}${grade}${subject}要求，达成知识与素养双目标。\n2.学生能准确理解“${title}”核心概念并迁移运用。\n3.培养合作探究与语言表达素养。` },
      { key: 'keyPoints', label: '教学重难点', text: `重点：“${title}”的概念建构与方法掌握。\n难点：结合${stage}学情的分层突破与高阶思维培养。` },
      { key: 'studentAnalysis', label: '学情分析参考', text: `${grade}学生具备一定${subject}基础，差异体现在理解速度与表达完整度，宜采用分层任务与小组互助。` },
      { key: 'process', label: '教学流程', text: `一、情境导入（5分钟）\n二、新知探究（20分钟）\n三、合作活动（12分钟）\n四、巩固练习（5分钟）\n五、总结与板书（3分钟）` },
      { key: 'import', label: '课堂导入设计', text: `用生活情境或问题链导入“${title}”，激发疑问，2分钟呈现学习目标。` },
      { key: 'activities', label: '课堂活动设计', text: `活动1：小组研读+代表展示（8分钟）。\n活动2：分层任务单练习（基础/提升/拓展三档）。` },
      { key: 'board', label: '板书设计', text: `主板书：${title} + 重难点关键词；副板书：学生生成性结论。` },
      { key: 'taskSheet', label: '课堂任务单', text: `任务一：基础梳理。任务二：合作探究。任务三：拓展迁移（选做）。` },
      { key: 'exercises', label: '随堂练习（教师自用参考）', text: `1.基础题2道 2.能力题1道 3.拓展思考1道，均需教师审核后使用。` },
      { key: 'reflection', label: '教学反思（待补充）', text: `本节课目标达成度、学生参与度、作业反馈待课后补充。` }
    ],
    notice: 'AI生成内容仅为参考草稿，必须人工确认后才可提交审核，不替代教研审核。'
  }
}

async function callEngine(ctx, request, prompt, systemPrompt, model) {
  if (typeof ctx.engine?.generate !== 'function') {
    const err = new Error('当前环境暂不支持宿主模型调用')
    err.code = 'PLUGIN_ENGINE_UNAVAILABLE'
    throw err
  }
  const input = {
    prompt: String(prompt).slice(0, 60 * 1024),
    systemPrompt: String(systemPrompt || '你是中小学备课助手，只输出教学相关参考内容。').slice(0, 16 * 1024),
    timeoutMs: 90_000,
    maxOutputChars: 32_000
  }
  // 仅当明确指定 providerId/modelId 时传 model；不传则由 AgentOS/Core 选择当前可用默认模型。
  if (model && String(model).includes('/')) input.model = String(model).slice(0, 128)
  const raw = await ctx.engine.generate(request, input)
  const out = normalizeEngineResult(raw)
  if (!out.text.trim()) {
    const err = new Error('宿主模型返回为空')
    err.code = 'PLUGIN_ENGINE_EMPTY'
    throw err
  }
  return out
}

function modelOf(body, settings) {
  // 优先级：本次请求指定 > 后端保存的默认 > 配置文件默认 > 跟随系统
  const m = body?.model ?? settings?.defaultModel ?? ''
  return String(m || '')
}

async function readAiSettings(ctx) {
  // models.json 是随包静态可访问文件：只读预设/默认模型/非敏感endpoint；绝不读Key
  let filePresets = []
  let fileDefault = ''
  let fileProviders = null
  try {
    const raw = await fs.readFile(path.join(ctx.pluginDir, 'models.json'), 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed.presets)) filePresets = parsed.presets
    if (typeof parsed.defaultModel === 'string') fileDefault = parsed.defaultModel
    if (parsed.providers && typeof parsed.providers === 'object') fileProviders = parsed.providers
    // 安全网：有人误把Key写进 models.json，直接忽略且打日志，绝不使用
    if (parsed.apiKey || parsed.deepseekKey || parsed.geminiKey || parsed.secret || parsed.secrets) {
      routerLog(ctx, 'warn', 'models.json中发现疑似Key字段，已忽略；Key必须只放在服务端models-secrets.json')
    }
  } catch {}
  const saved = await readJson(ctx.dataDir, FILES.aiSettings, null)
  const presets = filePresets.length ? filePresets : FALLBACK_MODEL_PRESETS
  return {
    presets,
    defaultModel: typeof saved?.defaultModel === 'string' ? saved.defaultModel : fileDefault,
    // 非敏感endpoint/模型名：运行期覆盖 > models.json providers > 内置默认
    deepseekBase: (typeof saved?.deepseekBase === 'string' && saved.deepseekBase) || fileProviders?.deepseek?.base || 'https://api.deepseek.com/chat/completions',
    deepseekModel: (typeof saved?.deepseekModel === 'string' && saved.deepseekModel) || fileProviders?.deepseek?.model || 'deepseek-chat',
    geminiModel: (typeof saved?.geminiModel === 'string' && saved.geminiModel) || fileProviders?.gemini?.model || 'gemini-2.0-flash',
    // 只返回是否配置，前端永远拿不到原文
    hasDeepseekKey: false || !!((await readAiSecrets(ctx)).deepseekKey),
    hasGeminiKey: false || !!((await readAiSecrets(ctx)).geminiKey),
    updatedAt: saved?.updatedAt || '',
    updatedBy: saved?.updatedBy || ''
  }
}

function maskKey(k) {
  if (!k || k.length < 8) return k ? '****' : ''
  return k.slice(0, 3) + '****' + k.slice(-4)
}

function routerLog(ctx, level, msg) {
  try { ctx?.routerLog?.[level]?.(msg) } catch {}
  try {
    const fn = { debug: console.debug, info: console.info, warn: console.warn, error: console.error }[level] || console.info
    fn(`[k12-ai-lesson-prep] ${msg}`)
  } catch {}
}

function isPlaceholderKey(value) {
  const k = String(value || '').trim()
  if (!k) return true
  return /在此填|your[-_ ]?key|replace|example|示例|填入|xxxx|\*\*\*\*/i.test(k)
}

function sanitizeSecretKey(value) {
  const k = String(value || '').trim().replace(/^["']+|["']+$/g, '')
  return isPlaceholderKey(k) ? '' : k
}

function normalizeEngineResult(result) {
  if (typeof result === 'string') return { text: result, model: null, usage: null }
  const text = result?.text ?? result?.content ?? result?.outputText ?? result?.message?.content ?? ''
  return { text: String(text || ''), model: result?.model || null, usage: result?.usage || null }
}

function isRetryableError(err) {
  const code = String(err?.code || '')
  const msg = String(err?.message || '')
  return /429|408|5\d\d|ECONNRESET|ETIMEDOUT|EAI_AGAIN|fetch failed|timeout|超时|temporar/i.test(`${code} ${msg}`)
}

async function withRetry(fn, { retries = 2, baseDelayMs = 500 } = {}) {
  let last
  for (let i = 0; i <= retries; i++) {
    try { return await fn(i) } catch (e) {
      last = e
      if (i >= retries || !isRetryableError(e)) throw e
      await new Promise(resolve => setTimeout(resolve, baseDelayMs * Math.pow(2, i)))
    }
  }
  throw last
}

async function readAiSecrets(ctx) {
  // 真Key来源（省事模式）：优先 ctx.dataDir/models-secrets.json，不存在再兜底读
  // ctx.pluginDir/models-secrets.json（单机省事，改源码目录重装即生效）
  // models.json 仍绝不放Key。警告：pluginDir 随zip分发，不要把带真Key的包发给别人
  const primaryPath = path.join(ctx.dataDir, FILES.aiSecrets)
  const fallbackPath = path.join(ctx.pluginDir, FILES.aiSecrets)
  const clean = v => String(v || '').trim().replace(/^["']+|["']+$/g, '')
  const parseSecrets = s => ({
    deepseekKey: sanitizeSecretKey(s?.deepseek?.key || s?.deepseekKey || ''),
    deepseekBase: clean(s?.deepseek?.base || s?.deepseekBase) || 'https://api.deepseek.com/chat/completions',
    deepseekModel: clean(s?.deepseek?.model || s?.deepseekModel) || 'deepseek-chat',
    geminiKey: sanitizeSecretKey(s?.gemini?.key || s?.geminiKey || ''),
    geminiModel: clean(s?.gemini?.model || s?.geminiModel) || 'gemini-2.0-flash'
  })
  try {
    const s = JSON.parse(await fs.readFile(primaryPath, 'utf-8'))
    const r = parseSecrets(s)
    if (!r.deepseekKey && !r.geminiKey) {
      routerLog(ctx, 'warn', `真模型Key未配置：在 ${primaryPath} 写入{deepseek:{key:"sk-..."}}（0o600），不要写进models.json`)
    }
    return { ...r, secretsPath: primaryPath, secretsExists: true, secretsSource: 'dataDir' }
  } catch (e) {
    if (e?.code !== 'ENOENT') {
      routerLog(ctx, 'error', `读取 ${primaryPath} 失败:${e?.message || e}（多为JSON带注释/尾随逗号/BOM，请用严格JSON），尝试读插件目录兜底`)
    }
  }
  try {
    const s = JSON.parse(await fs.readFile(fallbackPath, 'utf-8'))
    const r = parseSecrets(s)
    if (r.deepseekKey || r.geminiKey) {
      routerLog(ctx, 'warn', `使用插件目录兜底Key:${fallbackPath}（省事模式；分发zip会带出真Key，仅限单机自用）`)
      return { ...r, secretsPath: fallbackPath, secretsExists: true, secretsSource: 'pluginDir' }
    }
    routerLog(ctx, 'warn', `未找到可用Key：${primaryPath} 与 ${fallbackPath} 均无Key，仅走宿主网关`)
  } catch (e2) {
    if (e2?.code === 'ENOENT') {
      routerLog(ctx, 'warn', `未找到 ${primaryPath}，已尝试兜底 ${fallbackPath} 也不存在；如需直连，二选一建文件写入Key（推荐dataDir 0o600）`)
    } else {
      routerLog(ctx, 'error', `读取兜底 ${fallbackPath} 失败:${e2?.message || e2}（请用严格JSON）`)
    }
  }
  return { deepseekKey: '', deepseekBase: 'https://api.deepseek.com/chat/completions', deepseekModel: 'deepseek-chat', geminiKey: '', geminiModel: 'gemini-2.0-flash', secretsPath: primaryPath, secretsExists: false, secretsSource: 'none' }
}

async function fetchWithTimeout(url, options, ms) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(new Error('请求超时')), ms || 60000)
  try {
    const res = await fetch(url, { ...(options || {}), signal: ctrl.signal })
    return res
  } catch (e) {
    // fetch 对中文URL/非法头抛的 ByteString TypeError 在此归一为可读错误
    if (e?.name === 'TypeError' || /ByteString/i.test(e?.message || '')) {
      const err = new Error(`直连请求构造失败:${e.message}（多为base地址含中文/空格或Key含非法字符，请检查models-secrets.json的base与key）`)
      err.code = 'DIRECT_REQUEST_BUILD_FAILED'
      throw err
    }
    throw e
  } finally { clearTimeout(t) }
}

// 真直连 DeepSeek（OpenAI 兼容）：POST {model, messages} -> choices[0].message.content
async function callDirectDeepSeek(prompt, systemPrompt, secrets, overrideModel) {
  if (!secrets.deepseekKey) {
    const e = new Error('未配置 DeepSeek Key，先在“AI模型”处填写')
    e.code = 'NO_DEEPSEEK_KEY'
    throw e
  }
  const model = overrideModel || secrets.deepseekModel || 'deepseek-chat'
  const base = String(secrets.deepseekBase || 'https://api.deepseek.com/chat/completions').trim()
  // base 必须 ASCII http(s) URL：含中文/空格/换行会触发 fetch ByteString 报错，先拦截
  if (!/^https?:\/\/[^\s\u4e00-\u9fff]+$/i.test(base)) {
    const e = new Error(`DeepSeek地址非法:${base}（含中文/空格/换行或非http，请改models-secrets.json的deepseek.base）`)
    e.code = 'BAD_DEEPSEEK_BASE'
    throw e
  }
  const url = base
  const key = String(secrets.deepseekKey || '').trim()
  if (/[\s\u4e00-\u9fff]/.test(key)) {
    const e = new Error('DeepSeek Key含空格/换行/中文，请检查models-secrets.json的deepseek.key前后是否多复制了字符')
    e.code = 'BAD_DEEPSEEK_KEY'
    throw e
  }
  const res = await withRetry(() => fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt || '你是中小学备课助手。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  }, 90000), { retries: 2 })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const e = new Error(data?.error?.message || `DeepSeek请求失败 HTTP ${res.status}`)
    e.code = 'DEEPSEEK_HTTP_' + res.status
    throw e
  }
  const text = data?.choices?.[0]?.message?.content || ''
  if (!text.trim()) { const e = new Error('DeepSeek返回为空'); e.code = 'DEEPSEEK_EMPTY'; throw e }
  return { text, model: { providerId: 'deepseek', modelId: model }, raw: data }
}

// 真直连 Gemini Flash：POST :generateContent?key= -> candidates[0].content.parts
async function callDirectGemini(prompt, systemPrompt, secrets, overrideModel) {
  if (!secrets.geminiKey) {
    const e = new Error('未配置 Gemini Key，先在“AI模型”处填写')
    e.code = 'NO_GEMINI_KEY'
    throw e
  }
  const model = overrideModel || secrets.geminiModel || 'gemini-2.0-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(secrets.geminiKey)}`
  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt || '你是中小学备课助手。' }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
    })
  }, 60000)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const e = new Error(data?.error?.message || `Gemini请求失败 HTTP ${res.status}`)
    e.code = 'GEMINI_HTTP_' + res.status
    throw e
  }
  const parts = data?.candidates?.[0]?.content?.parts || []
  const text = parts.map(p => p.text || '').join('').trim()
  if (!text) { const e = new Error('Gemini返回为空'); e.code = 'GEMINI_EMPTY'; throw e }
  return { text, model: { providerId: 'google', modelId: model }, raw: data }
}

// 把真模型全文按【教学目标/重难点/学情/...】切成结构化十节，切不出则回退本地模板
function parseSectionsFromText(rawText) {
  const text = String(rawText || '')
  if (!text.trim()) return {}
  const defs = [
    { key: 'objectives', titles: ['教学目标'] },
    { key: 'keyPoints', titles: ['重难点', '教学重点', '教学难点'] },
    { key: 'studentAnalysis', titles: ['学情分析', '学情'] },
    { key: 'process', titles: ['教学流程', '教学过程', '教学环节'] },
    { key: 'import', titles: ['导入设计', '课堂导入', '导入'] },
    { key: 'activities', titles: ['活动设计', '课堂活动'] },
    { key: 'board', titles: ['板书设计', '板书'] },
    { key: 'taskSheet', titles: ['任务单', '课堂任务'] },
    { key: 'exercises', titles: ['随堂练习', '练习题', '课堂练习'] },
    { key: 'reflection', titles: ['教学反思', '反思'] }
  ]
  const positions = []
  for (const d of defs) {
    let best = -1
    for (const t of d.titles) {
      const i = text.indexOf(t)
      if (i >= 0 && (best < 0 || i < best)) best = i
    }
    if (best >= 0) positions.push({ key: d.key, index: best })
  }
  positions.sort((a, b) => a.index - b.index)
  if (positions.length < 3) return {}
  const out = {}
  for (let i = 0; i < positions.length; i++) {
    const cur = positions[i]
    const next = positions[i + 1]
    let chunk = text.slice(cur.index, next ? next.index : undefined).trim()
    chunk = chunk.replace(/^.{0,12}(教学目标|重难点|学情分析|教学流程|导入设计|活动设计|板书设计|任务单|随堂练习|教学反思)[:：\s]*/, '').trim()
    if (chunk) out[cur.key] = chunk.slice(0, 4000)
  }
  return out
}

function buildStructured(title, parsed, fallbackInput) {
  const fb = localDesign(fallbackInput)
  const labels = {}
  for (const s of fb.sections) labels[s.key] = s.label
  const keys = ['objectives', 'keyPoints', 'studentAnalysis', 'process', 'import', 'activities', 'board', 'taskSheet', 'exercises', 'reflection']
  const parsedKeys = Object.keys(parsed || {})
  if (parsedKeys.length >= 3) {
    return {
      title: title || fb.title,
      sections: keys.filter(k => parsed[k] || fb.sections.find(s => s.key === k)).map(k => ({
        key: k, label: labels[k] || k, text: parsed[k] || (fb.sections.find(s => s.key === k)?.text || ''),
        fromModel: !!parsed[k]
      })),
      notice: '以下各节由真模型实时生成，已按模板切节；标“模型生成”的节请人工逐节确认后再提交。'
    }
  }
  return fb
}

// 统一真模型入口：DeepSeek V4 直连优先，再走宿主网关，最后本地兜底且明确标记
async function generateReal(ctx, request, { prompt, systemPrompt, wantModel }) {
  const secrets = await readAiSecrets(ctx)
  const settings = await readAiSettings(ctx)
  let raw = String(wantModel ?? settings.defaultModel ?? '').trim()
  if (raw && !raw.includes('/') && /^deepseek[-_]/i.test(raw)) raw = `deepseek/${raw.replace(/^deepseek[-_:]?/i, '') || 'deepseek-chat'}`
  if (raw === 'deepseek-flash') raw = 'deepseek/deepseek-chat'
  const want = raw
  const attempts = []

  // 1) 有合法直连 Key 时，尊重用户显式选择的 provider。
  if (want.startsWith('deepseek/') && secrets.deepseekKey) {
    try {
      const m = want.split('/')[1] || secrets.deepseekModel
      const r = await callDirectDeepSeek(prompt, systemPrompt, secrets, m)
      return { ...r, source: 'direct-deepseek', modelUsed: `deepseek/${m}` }
    } catch (e) { attempts.push(`直连DeepSeek失败:${e.code || e.message}`) }
  }
  if ((want.startsWith('google/') || want.startsWith('gemini/')) && secrets.geminiKey) {
    try {
      const m = want.split('/')[1] || secrets.geminiModel
      const r = await callDirectGemini(prompt, systemPrompt, secrets, m)
      return { ...r, source: 'direct-gemini', modelUsed: want }
    } catch (e) { attempts.push(`直连Gemini失败:${e.code || e.message}`) }
  }

  // 2) 显式模型先尝试宿主网关。
  if (want) {
    try {
      const r = await callEngine(ctx, request, prompt, systemPrompt, want)
      return { ...r, source: 'gateway-selected', modelUsed: want }
    } catch (e) { attempts.push(`指定模型网关失败:${e.code || e.message}`) }
  }

  // 3) 最关键兜底：不传 model，让 AgentOS/Core 自动使用当前真正可用的默认模型。
  try {
    const r = await callEngine(ctx, request, prompt, systemPrompt, '')
    return { ...r, source: 'gateway-default', modelUsed: '(系统默认可用模型)' }
  } catch (e) { attempts.push(`系统默认模型网关失败:${e.code || e.message}`) }

  // 4) 没有显式选择，或网关失败时，再尝试任何已配置的直连模型。
  if (secrets.deepseekKey && !want.startsWith('deepseek/')) {
    try {
      const r = await callDirectDeepSeek(prompt, systemPrompt, secrets, secrets.deepseekModel)
      return { ...r, source: 'direct-deepseek-fallback', modelUsed: `deepseek/${secrets.deepseekModel}` }
    } catch (e) { attempts.push(`DeepSeek备用直连失败:${e.code || e.message}`) }
  }
  if (secrets.geminiKey && !(want.startsWith('google/') || want.startsWith('gemini/'))) {
    try {
      const r = await callDirectGemini(prompt, systemPrompt, secrets, secrets.geminiModel)
      return { ...r, source: 'direct-gemini-fallback', modelUsed: `gemini/${secrets.geminiModel}` }
    } catch (e) { attempts.push(`Gemini备用直连失败:${e.code || e.message}`) }
  }

  if (!secrets.deepseekKey) attempts.push('DeepSeek直连未启用:未配置有效Key（示例占位Key会自动忽略）')
  if (!secrets.geminiKey) attempts.push('Gemini直连未启用:未配置有效Key')
  const err = new Error(attempts.join('；') || '所有模型通道均不可用')
  err.code = 'ALL_MODEL_CHANNELS_FAILED'
  err.attempts = attempts
  throw err
}

export async function register(router, ctx) {
  for (const [file, fallback] of [
    [FILES.docs, []], [FILES.resources, []], [FILES.tasks, []],
    [FILES.templates, DEFAULT_TEMPLATES], [FILES.discussions, []],
    [FILES.versions, []], [FILES.logs, []], [FILES.activities, []]
  ]) {
    const cur = await readJson(ctx.dataDir, file, null)
    if (cur === null || cur === undefined) await writeJson(ctx.dataDir, file, fallback)
  }
  // 兼容老数据：补 review 字段
  try {
    const docs = await readJson(ctx.dataDir, FILES.docs, [])
    let changed = false
    for (const d of docs) {
      if (!d.review) { ensureReview(d); if (d.status === '定稿') d.review.status = 'approved'; changed = true }
    }
    if (changed) await writeJson(ctx.dataDir, FILES.docs, docs)
  } catch {}

  ctx.hooks?.on?.('core:beforeSpawn', () => ({}))
  router.log?.info?.('[k12-ai-lesson-prep] backend v1.2 loaded')

  router.get('/health', async () => {
    const secrets = await readAiSecrets(ctx)
    // 健康检查只暴露是否配Key/文件位置，不暴露原文；改错位置时一眼能看出来
    return {
      ok: true, pluginId: ctx.id, time: new Date().toISOString(),
      dataDir: ctx.dataDir, secretsPath: secrets.secretsPath,
      secretsExists: secrets.secretsExists,
      deepseekKeyConfigured: !!secrets.deepseekKey,
      geminiKeyConfigured: !!secrets.geminiKey,
      deepseekBase: secrets.deepseekBase, deepseekModel: secrets.deepseekModel
    }
  })

  // ---------- AI 模型配置 ----------
  router.get('/ai/models', async () => ({ ok: true, data: await readAiSettings(ctx) }))

  router.put('/ai/models', async (request, reply) => {
    const b = request.body || {}
    const settings = await readAiSettings(ctx)
    const ids = settings.presets.map(p => p.id)
    const next = String(b.defaultModel ?? '')
    if (next && !ids.includes(next) && !next.includes('/')) {
      return reply.status(400).send({ ok: false, error: '模型格式必须为 providerId/modelId，或从预设中选择' })
    }
    // 安全：前端永远不能经接口写入/读取Key原文；Key只由运维在服务端models-secrets.json手工维护
    if (b.deepseekKey !== undefined || b.geminiKey !== undefined || b.apiKey !== undefined || b.secret !== undefined) {
      return reply.status(400).send({ ok: false, error: 'Key不能经前端接口提交，请运维在服务端models-secrets.json手工配置' })
    }
    const prev = await readJson(ctx.dataDir, FILES.aiSettings, null)
    const saved = {
      defaultModel: next,
      deepseekBase: typeof b.deepseekBase === 'string' && b.deepseekBase.trim() ? b.deepseekBase.trim().slice(0, 200) : (prev?.deepseekBase || settings.deepseekBase),
      deepseekModel: typeof b.deepseekModel === 'string' && b.deepseekModel.trim() ? b.deepseekModel.trim().slice(0, 64) : (prev?.deepseekModel || settings.deepseekModel),
      geminiModel: typeof b.geminiModel === 'string' && b.geminiModel.trim() ? b.geminiModel.trim().slice(0, 64) : (prev?.geminiModel || settings.geminiModel),
      updatedBy: actorOf(ctx, request), updatedAt: new Date().toISOString()
    }
    await writeJson(ctx.dataDir, FILES.aiSettings, saved)
    const secrets = await readAiSecrets(ctx)
    // 日志只记是否配置，不记Key原文
    await appendLog(ctx, { actor: saved.updatedBy, action: 'ai.model-config', targetId: 'ai-settings', detail: `${next || '跟随系统默认'}｜deepseek:${secrets.deepseekKey ? '已配' : '未配'} gemini:${secrets.geminiKey ? '已配' : '未配'}` })
    return { ok: true, data: { ...(await readAiSettings(ctx)) } }
  })

  // 连通性自检：分别试真直连与网关，不写业务数据
  router.post('/ai/test', async request => {
    const b = request.body || {}
    const prompt = String(b.prompt || '用一句话介绍《春》这篇课文的教学导入思路。')
    const systemPrompt = '你是中小学备课助手，只返回一句话。'
    const settings = await readAiSettings(ctx)
    const want = String(b.model ?? settings.defaultModel ?? '')
    const out = { modelUsed: want || '(系统默认)', steps: [] }
    const secrets = await readAiSecrets(ctx)
    if (want.startsWith('deepseek/') || (!want && secrets.deepseekKey)) {
      try {
        const r = await callDirectDeepSeek(prompt, systemPrompt, secrets, want.startsWith('deepseek/') ? want.split('/')[1] : undefined)
        out.steps.push({ channel: 'direct-deepseek', ok: true, model: r.model, text: r.text.slice(0, 500) })
      } catch (e) { out.steps.push({ channel: 'direct-deepseek', ok: false, error: `${e.code || ''} ${e.message}`.trim() }) }
    }
    if (want.startsWith('google/') || want.startsWith('gemini/') || want.includes('flash') || (!want && secrets.geminiKey)) {
      try {
        const m = want.includes('/') ? want.split('/')[1] : secrets.geminiModel
        const r = await callDirectGemini(prompt, systemPrompt, secrets, m)
        out.steps.push({ channel: 'direct-gemini', ok: true, model: r.model, text: r.text.slice(0, 500) })
      } catch (e) { out.steps.push({ channel: 'direct-gemini', ok: false, error: `${e.code || ''} ${e.message}`.trim() }) }
    }
    try {
      const r = await callEngine(ctx, request, prompt, systemPrompt, want)
      out.steps.push({ channel: 'gateway', ok: true, model: r.model || null, text: String(r.text || '').slice(0, 500) })
    } catch (e) { out.steps.push({ channel: 'gateway', ok: false, error: `${e.code || ''} ${e.message}`.trim() }) }
    return { ok: true, data: out }
  })

  // ---------- 模板 ----------
  router.get('/templates', async () => {
    const templates = await readJson(ctx.dataDir, FILES.templates, DEFAULT_TEMPLATES)
    return { ok: true, data: templates }
  })

  router.post('/templates', async (request, reply) => {
    const b = request.body || {}
    if (!b.name || !String(b.name).trim()) return reply.status(400).send({ ok: false, error: '模板名称必填' })
    const templates = await readJson(ctx.dataDir, FILES.templates, [])
    const tpl = {
      id: uid('tpl'), name: String(b.name).slice(0, 64),
      subject: String(b.subject || '通用').slice(0, 32),
      description: String(b.description || '').slice(0, 500),
      fields: (Array.isArray(b.fields) ? b.fields : []).map(f => ({
        key: String(f.key || f.label || '').slice(0, 32),
        label: String(f.label || f.key || '字段').slice(0, 32),
        required: !!f.required
      })),
      builtin: false, createdBy: actorOf(ctx, request), createdAt: new Date().toISOString()
    }
    templates.push(tpl)
    await writeJson(ctx.dataDir, FILES.templates, templates)
    await appendLog(ctx, { actor: tpl.createdBy, action: 'template.create', targetId: tpl.id, detail: tpl.name })
    return { ok: true, data: tpl }
  })

  // ---------- 备课文档 ----------
  router.get('/docs', async request => {
    const q = request.query || {}
    let docs = await readJson(ctx.dataDir, FILES.docs, [])
    docs.forEach(d => ensureReview(d))
    if (q.reviewStatus) docs = docs.filter(d => d.review.status === q.reviewStatus)
    if (q.owner) docs = docs.filter(d => d.owner === q.owner)
    if (q.status) docs = docs.filter(d => d.status === q.status)
    if (q.keyword) {
      const kw = String(q.keyword).toLowerCase()
      docs = docs.filter(d => JSON.stringify(d).toLowerCase().includes(kw))
    }
    docs = docs.slice().sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    return { ok: true, data: docs }
  })

  router.post('/docs', async (request, reply) => {
    const b = request.body || {}
    if (!b.title || !String(b.title).trim()) return reply.status(400).send({ ok: false, error: '标题必填' })
    const docs = await readJson(ctx.dataDir, FILES.docs, [])
    const actor = actorOf(ctx, request)
    const now = new Date().toISOString()
    const doc = {
      id: uid('doc'),
      title: String(b.title).slice(0, 120),
      kind: ['课时教案', '单元整体备课', '学案', '任务单', '教学反思'].includes(b.kind) ? b.kind : '课时教案',
      stage: String(b.stage || '').slice(0, 16),
      subject: String(b.subject || '').slice(0, 16),
      grade: String(b.grade || '').slice(0, 16),
      edition: String(b.edition || '深圳版').slice(0, 32),
      unit: String(b.unit || '').slice(0, 64),
      templateId: b.templateId || 'tpl-class-hour',
      content: (b.content && typeof b.content === 'object') ? b.content : {},
      aiDraft: !!b.aiDraft,
      status: '草稿', version: 1, owner: actor,
      review: { status: 'draft', comment: '', reviewer: '', at: '', history: [] },
      createdAt: now, updatedAt: now
    }
    docs.push(doc)
    await writeJson(ctx.dataDir, FILES.docs, docs)
    const versions = await readJson(ctx.dataDir, FILES.versions, [])
    versions.push({ id: uid('ver'), docId: doc.id, version: 1, label: '草稿版', snapshot: doc.content, title: doc.title, by: actor, at: now, note: b.aiDraft ? 'AI生成参考稿（待人工确认）' : '新建文档' })
    await writeJson(ctx.dataDir, FILES.versions, versions)
    await appendLog(ctx, { actor, action: 'doc.create', targetId: doc.id, detail: doc.title })
    return { ok: true, data: doc }
  })

  router.get('/docs/:id', async (request, reply) => {
    const docs = await readJson(ctx.dataDir, FILES.docs, [])
    const doc = docs.find(d => d.id === request.params.id)
    if (!doc) return reply.status(404).send({ ok: false, error: '文档不存在' })
    ensureReview(doc)
    return { ok: true, data: doc }
  })

  router.put('/docs/:id', async (request, reply) => {
    const docs = await readJson(ctx.dataDir, FILES.docs, [])
    const idx = docs.findIndex(d => d.id === request.params.id)
    if (idx < 0) return reply.status(404).send({ ok: false, error: '文档不存在' })
    ensureReview(docs[idx])
    if (docs[idx].review.status === 'submitted') {
      return reply.status(400).send({ ok: false, error: '已提交审核，教导审核期间锁定编辑；被驳回后可继续修改' })
    }
    if (docs[idx].status === '定稿' && !(request.body?.allowFinalEdit)) {
      return reply.status(400).send({ ok: false, error: '定稿已锁定，如需修改请联系教导驳回' })
    }
    const b = request.body || {}
    const actor = actorOf(ctx, request)
    const now = new Date().toISOString()
    for (const k of ['title', 'kind', 'stage', 'subject', 'grade', 'edition', 'unit', 'templateId']) {
      if (b[k] !== undefined) docs[idx][k] = typeof b[k] === 'string' ? b[k].slice(0, 200) : b[k]
    }
    if (b.content && typeof b.content === 'object') docs[idx].content = b.content
    if (docs[idx].status === '草稿') docs[idx].status = '修订中'
    if (docs[idx].review.status === 'rejected') docs[idx].review.status = 'draft'
    docs[idx].version += 1
    docs[idx].updatedAt = now
    docs[idx].lastEditor = actor
    await writeJson(ctx.dataDir, FILES.docs, docs)
    const versions = await readJson(ctx.dataDir, FILES.versions, [])
    versions.push({ id: uid('ver'), docId: docs[idx].id, version: docs[idx].version, label: '修订版', snapshot: docs[idx].content, title: docs[idx].title, by: actor, at: now, note: String(b.note || '教师编辑').slice(0, 200) })
    await writeJson(ctx.dataDir, FILES.versions, versions)
    await appendLog(ctx, { actor, action: 'doc.edit', targetId: docs[idx].id, detail: `${docs[idx].title} v${docs[idx].version}` })
    return { ok: true, data: docs[idx] }
  })

  // 老师：提交审核（带必填校验）
  router.post('/docs/:id/submit-review', async (request, reply) => {
    const docs = await readJson(ctx.dataDir, FILES.docs, [])
    const idx = docs.findIndex(d => d.id === request.params.id)
    if (idx < 0) return reply.status(404).send({ ok: false, error: '文档不存在' })
    ensureReview(docs[idx])
    const templates = await readJson(ctx.dataDir, FILES.templates, [])
    const tpl = templates.find(t => t.id === docs[idx].templateId)
    const missing = missingRequired(tpl, docs[idx].content)
    if (missing.length) return reply.status(400).send({ ok: false, error: `缺必填项无法提交：${missing.map(m => m.label).join('、')}`, data: { missing } })
    docs[idx].review.status = 'submitted'
    docs[idx].review.at = new Date().toISOString()
    docs[idx].review.history.push({ at: docs[idx].review.at, by: actorOf(ctx, request), action: 'submit', note: '教师提交审核' })
    docs[idx].updatedAt = docs[idx].review.at
    await writeJson(ctx.dataDir, FILES.docs, docs)
    await appendLog(ctx, { actor: actorOf(ctx, request), action: 'doc.submit-review', targetId: docs[idx].id, detail: docs[idx].title })
    return { ok: true, data: docs[idx] }
  })

  // 老师：撤回审核
  router.post('/docs/:id/withdraw', async (request, reply) => {
    const docs = await readJson(ctx.dataDir, FILES.docs, [])
    const idx = docs.findIndex(d => d.id === request.params.id)
    if (idx < 0) return reply.status(404).send({ ok: false, error: '文档不存在' })
    ensureReview(docs[idx])
    if (docs[idx].review.status !== 'submitted') return reply.status(400).send({ ok: false, error: '只有待审核状态可撤回' })
    docs[idx].review.status = 'draft'
    docs[idx].review.history.push({ at: new Date().toISOString(), by: actorOf(ctx, request), action: 'withdraw', note: '教师撤回' })
    await writeJson(ctx.dataDir, FILES.docs, docs)
    await appendLog(ctx, { actor: actorOf(ctx, request), action: 'doc.withdraw', targetId: docs[idx].id, detail: docs[idx].title })
    return { ok: true, data: docs[idx] }
  })

  // 教导：审核队列
  router.get('/audit/queue', async request => {
    const q = request.query || {}
    let docs = await readJson(ctx.dataDir, FILES.docs, [])
    docs.forEach(d => ensureReview(d))
    const status = q.status || 'submitted'
    if (status !== 'all') docs = docs.filter(d => d.review.status === status)
    if (q.keyword) {
      const kw = String(q.keyword).toLowerCase()
      docs = docs.filter(d => `${d.title}${d.owner}${d.subject}${d.grade}`.toLowerCase().includes(kw))
    }
    docs = docs.slice().sort((a, b) => String(a.review.at || a.updatedAt || '').localeCompare(String(b.review.at || b.updatedAt || '')))
    return { ok: true, data: docs }
  })

  // 教导：通过 / 驳回（驳回必须写意见）
  router.post('/docs/:id/audit', async (request, reply) => {
    const b = request.body || {}
    const decision = b.decision === 'approve' ? 'approve' : b.decision === 'reject' ? 'reject' : ''
    if (!decision) return reply.status(400).send({ ok: false, error: 'decision仅支持 approve / reject' })
    if (decision === 'reject' && !String(b.comment || '').trim()) {
      return reply.status(400).send({ ok: false, error: '驳回必须填写修改意见' })
    }
    const docs = await readJson(ctx.dataDir, FILES.docs, [])
    const idx = docs.findIndex(d => d.id === request.params.id)
    if (idx < 0) return reply.status(404).send({ ok: false, error: '文档不存在' })
    ensureReview(docs[idx])
    if (docs[idx].review.status !== 'submitted') return reply.status(400).send({ ok: false, error: '只有待审核文档可审核' })
    const reviewer = actorOf(ctx, request)
    const now = new Date().toISOString()
    const comment = String(b.comment || '').slice(0, 2000)
    if (decision === 'approve') {
      docs[idx].review.status = 'approved'
      docs[idx].status = '定稿'
      docs[idx].version += 1
    } else {
      docs[idx].review.status = 'rejected'
      docs[idx].status = '修订中'
    }
    docs[idx].review.comment = comment
    docs[idx].review.reviewer = reviewer
    docs[idx].review.at = now
    docs[idx].review.history.push({ at: now, by: reviewer, action: decision, note: comment || (decision === 'approve' ? '审核通过' : '驳回') })
    docs[idx].updatedAt = now
    await writeJson(ctx.dataDir, FILES.docs, docs)
    const versions = await readJson(ctx.dataDir, FILES.versions, [])
    versions.push({ id: uid('ver'), docId: docs[idx].id, version: docs[idx].version, label: decision === 'approve' ? '定稿版' : '修订版', snapshot: docs[idx].content, title: docs[idx].title, by: reviewer, at: now, note: decision === 'approve' ? `教导审核通过${comment ? '：' + comment : ''}` : `教导驳回：${comment}` })
    await writeJson(ctx.dataDir, FILES.versions, versions)
    await appendLog(ctx, { actor: reviewer, action: decision === 'approve' ? 'doc.approve' : 'doc.reject', targetId: docs[idx].id, detail: `${docs[idx].title}｜${comment}`.slice(0, 200) })
    return { ok: true, data: docs[idx] }
  })

  router.get('/docs/:id/versions', async request => {
    const versions = await readJson(ctx.dataDir, FILES.versions, [])
    return { ok: true, data: versions.filter(v => v.docId === request.params.id).sort((a, b) => a.version - b.version) }
  })

  router.get('/logs', async request => {
    const q = request.query || {}
    let logs = await readJson(ctx.dataDir, FILES.logs, [])
    if (q.targetId) logs = logs.filter(l => l.targetId === q.targetId)
    if (q.action) logs = logs.filter(l => l.action === q.action)
    logs = logs.slice().sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 300)
    return { ok: true, data: logs }
  })

  router.get('/stats/audit', async () => {
    const docs = await readJson(ctx.dataDir, FILES.docs, [])
    docs.forEach(d => ensureReview(d))
    const count = s => docs.filter(d => d.review.status === s).length
    return {
      ok: true,
      data: {
        submitted: count('submitted'), approved: count('approved'),
        rejected: count('rejected'), draft: count('draft'), total: docs.length,
        approveRate: docs.length ? Math.round((count('approved') / docs.length) * 100) : 0
      }
    }
  })

  // ---------- AI（真模型直连优先 + 网关兜底 + 本地模板最终兜底） ----------
  router.post('/ai/design', async (request, reply) => {
    const b = request.body || {}
    if (!b.topic && !b.unit) return reply.status(400).send({ ok: false, error: '请填写课题或单元' })
    const settings = await readAiSettings(ctx)
    const secrets = await readAiSecrets(ctx)
    const model = modelOf(b, settings)
    const fallback = localDesign(b)
    const title = `${b.topic || b.unit}教学设计`
    const prompt = `为${b.stage || '中小学'}${b.subject || ''}${b.grade || ''}（${b.edition || '深圳版'}）单元“${b.unit || ''}”课题“${b.topic || ''}”生成教学设计参考，必须按以下十节分别输出，每节以节名为小标题：教学目标、教学重难点、学情分析、教学流程、课堂导入设计、课堂活动设计、板书设计、课堂任务单、随堂练习、教学反思。`
    const systemPrompt = '你是中小学备课助手，只输出教学相关参考内容，不输出无关内容，并注明须人工确认。'
    const diag = {
      dataDir: ctx.dataDir, secretsPath: secrets.secretsPath,
      secretsExists: secrets.secretsExists,
      deepseekKeyConfigured: !!secrets.deepseekKey,
      deepseekBase: secrets.deepseekBase, deepseekModel: secrets.deepseekModel,
      wantModel: model || settings.defaultModel || 'deepseek/deepseek-chat'
    }
    try {
      const r = await generateReal(ctx, request, { prompt, systemPrompt, wantModel: model })
      const parsed = parseSectionsFromText(r.text)
      const structured = buildStructured(`${title}（参考草稿，需人工确认）`, parsed, b)
      return { ok: true, data: { engine: r.model || null, modelUsed: r.modelUsed, source: r.source, text: r.text, structured, usage: r.usage || null, diag } }
    } catch (e) {
      return { ok: true, data: { engine: null, modelUsed: model || '(系统默认)', source: 'local-fallback', engineError: e.code ? `${e.code} ${e.message}` : e.message, attempts: e.attempts || [], text: '', structured: fallback, diag } }
    }
  })

  router.post('/ai/polish', async (request, reply) => {
    const b = request.body || {}
    const text = String(b.text || '')
    if (!text.trim()) return reply.status(400).send({ ok: false, error: '请提供需要优化的教案内容' })
    const settings = await readAiSettings(ctx)
    const secrets = await readAiSecrets(ctx)
    const model = modelOf(b, settings)
    const mode = ['润色', '精简', '扩写', '专业化', '分层建议'].includes(b.mode) ? b.mode : '润色'
    const diag = {
      dataDir: ctx.dataDir, secretsPath: secrets.secretsPath,
      secretsExists: secrets.secretsExists, deepseekKeyConfigured: !!secrets.deepseekKey,
      wantModel: model || settings.defaultModel || 'deepseek/deepseek-chat'
    }
    try {
      const r = await generateReal(ctx, request, {
        prompt: `对以下教案做“${mode}”优化，保持新课标表述，直接返回优化后正文，不要解释过程：\n${text.slice(0, 20000)}`,
        systemPrompt: '你是教学语言优化助手，只返回优化后的教案正文。',
        wantModel: model
      })
      return { ok: true, data: { engine: r.model || null, modelUsed: r.modelUsed, source: r.source, text: r.text, diag } }
    } catch (e) {
      return { ok: true, data: { engine: null, modelUsed: model || '(系统默认)', source: 'local-fallback', engineError: e.code ? `${e.code} ${e.message}` : e.message, attempts: e.attempts || [], text: `【${mode}参考稿·真模型均失败已本地兜底，须人工确认】\n${text.slice(0, 4000)}`, diag } }
    }
  })

  router.post('/ai/review', async request => {
    const b = request.body || {}
    const settings = await readAiSettings(ctx)
    const secrets = await readAiSecrets(ctx)
    const model = modelOf(b, settings)
    const templates = await readJson(ctx.dataDir, FILES.templates, [])
    const tpl = templates.find(t => t.id === b.templateId)
    const content = b.content || {}
    const missing = missingRequired(tpl, content)
    let engineText = ''
    let source = 'local-fallback'
    let used = model || '(系统默认)'
    let attempts = []
    const diag = {
      dataDir: ctx.dataDir, secretsPath: secrets.secretsPath,
      secretsExists: secrets.secretsExists, deepseekKeyConfigured: !!secrets.deepseekKey,
      wantModel: model || settings.defaultModel || 'deepseek/deepseek-chat'
    }
    try {
      const r = await generateReal(ctx, request, {
        prompt: `初审以下教案的完整性与规范性，列出缺失与优化建议（仅参考，不定稿）：\n${JSON.stringify(content).slice(0, 20000)}`,
        systemPrompt: '你是教研初审助手，只给参考意见，不做最终结论。',
        wantModel: model
      })
      engineText = r.text
      source = r.source
      used = r.modelUsed
    } catch (e) { attempts = e.attempts || []; engineText = `本地初审：${missing.length ? '缺' + missing.map(m => m.label).join('、') : '必填项齐全'}（真模型失败：${e.code || e.message}${attempts.length ? '｜' + attempts.join('；') : ''}，仅参考）` }
    return { ok: true, data: { missing, passed: missing.length === 0, advice: engineText, source, modelUsed: used, attempts, diag, notice: 'AI初审仅供教研参考，不替代人工审核；最终以教导人工结论为准。' } }
  })

  // ---------- 兼容老路由（资源/任务等保留最小可用） ----------
  router.get('/resources', async () => ({ ok: true, data: await readJson(ctx.dataDir, FILES.resources, []) }))
  router.get('/tasks', async () => ({ ok: true, data: await readJson(ctx.dataDir, FILES.tasks, []) }))
  router.get('/stats/summary', async () => {
    const docs = await readJson(ctx.dataDir, FILES.docs, [])
    docs.forEach(d => ensureReview(d))
    return {
      ok: true, data: {
        docsTotal: docs.length,
        docsFinalized: docs.filter(d => d.status === '定稿').length,
        submitted: docs.filter(d => d.review.status === 'submitted').length,
        approved: docs.filter(d => d.review.status === 'approved').length,
        rejected: docs.filter(d => d.review.status === 'rejected').length
      }
    }
  })
}

export async function unregister(ctx) {
  try { ctx.hooks?.off?.('core:beforeSpawn', () => ({})) } catch {}
}
