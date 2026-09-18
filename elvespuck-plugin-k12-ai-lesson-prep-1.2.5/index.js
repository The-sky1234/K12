const CSS = `
.k12-wrap{font-family:inherit;color:var(--sys-color-text-primary);background:var(--sys-color-bg-canvas);min-height:100%;padding:16px;box-sizing:border-box}
.k12-top{display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:var(--sys-color-bg-surface);border:1px solid var(--sys-color-border-main);border-radius:12px;padding:12px 14px}
.k12-title{font-size:18px;font-weight:800}
.k12-sub{font-size:12px;color:var(--sys-color-text-secondary)}
.k12-steps{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:12px 0;font-size:12px;color:var(--sys-color-text-secondary)}
.k12-step{border:1px solid var(--sys-color-border-main);background:var(--sys-color-bg-surface);border-radius:999px;padding:4px 12px}
.k12-step.on{background:var(--sys-color-primary);border-color:var(--sys-color-primary);color:#fff}
.k12-tabs{display:flex;gap:8px;margin:12px 0;flex-wrap:wrap}
.k12-tab{border:1px solid var(--sys-color-border-main);background:var(--sys-color-bg-surface);color:var(--sys-color-text-primary);border-radius:999px;padding:8px 18px;cursor:pointer;font-size:14px;font-weight:700}
.k12-tab.on{background:var(--sys-color-primary);border-color:var(--sys-color-primary);color:#fff}
.k12-flex{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start}
.k12-card{background:var(--sys-color-bg-surface);border:1px solid var(--sys-color-border-main);border-radius:12px;padding:12px;box-sizing:border-box}
.k12-flex>.k12-card{flex:1;min-width:320px}
.k12-card h4{margin:0 0 8px;font-size:14px}
.k12-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0}
.k12-input,.k12-select,.k12-area{color:var(--sys-color-text-primary);background:var(--sys-color-bg-surface);border:1px solid var(--sys-color-border-main);border-radius:8px;padding:8px 10px;font-size:13px;box-sizing:border-box}
.k12-input,.k12-select{min-height:34px}
.k12-area{width:100%;min-height:80px;resize:vertical;line-height:1.6}
.k12-btn{border:1px solid var(--sys-color-primary);background:var(--sys-color-primary);color:#fff;border-radius:8px;padding:7px 12px;font-size:13px;cursor:pointer}
.k12-btn.ghost{background:transparent;color:var(--sys-color-text-primary);border-color:var(--sys-color-border-main)}
.k12-btn.danger{background:transparent;color:var(--sys-color-error);border-color:var(--sys-color-error)}
.k12-btn:disabled{opacity:.55;cursor:not-allowed}
.k12-tag{display:inline-block;font-size:12px;border:1px solid var(--sys-color-border-main);border-radius:999px;padding:2px 10px;margin:2px 4px 2px 0;color:var(--sys-color-text-secondary)}
.k12-tag.blue{color:var(--sys-color-primary);border-color:var(--sys-color-primary)}
.k12-tag.red{color:var(--sys-color-error);border-color:var(--sys-color-error)}
.k12-tag.green{color:#1b8f3e;border-color:#1b8f3e}
.k12-meta{font-size:12px;color:var(--sys-color-text-secondary);line-height:1.7;white-space:pre-wrap;word-break:break-word}
.k12-field{margin:8px 0}
.k12-field label{display:block;font-size:12px;font-weight:700;margin-bottom:4px}
.k12-field label i{font-style:normal;color:var(--sys-color-error);margin-left:4px}
.k12-list{max-height:520px;overflow:auto}
.k12-item{border:1px solid var(--sys-color-border-subtle);border-radius:10px;padding:10px;margin-bottom:8px;cursor:pointer}
.k12-item.sel{border-color:var(--sys-color-primary);box-shadow:0 0 0 2px var(--sys-color-focus-ring)}
.k12-pre{white-space:pre-wrap;word-break:break-word;font-size:13px;line-height:1.7;background:var(--sys-color-bg-subtle);border:1px solid var(--sys-color-border-subtle);border-radius:8px;padding:10px;max-height:300px;overflow:auto}
.k12-stat{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}
.k12-stat .k12-card{min-width:130px;flex:1;text-align:center}
.k12-num{font-size:22px;font-weight:800}
.k12-shell{display:grid;grid-template-columns:210px minmax(0,1fr);gap:16px;align-items:start}
.k12-sidebar{background:var(--sys-color-bg-surface);border:1px solid var(--sys-color-border-main);border-radius:12px;padding:10px;position:sticky;top:16px}
.k12-nav-title{font-size:12px;color:var(--sys-color-text-secondary);padding:8px 10px 6px}
.k12-nav{display:flex;flex-direction:column;gap:4px}
.k12-nav-btn{border:0;background:transparent;color:var(--sys-color-text-primary);border-radius:8px;padding:10px;text-align:left;cursor:pointer;font-size:13px}
.k12-nav-btn:hover{background:var(--sys-color-bg-subtle)}
.k12-nav-btn.on{background:var(--sys-color-primary);color:#fff;font-weight:700}
.k12-nav-btn.disabled{color:var(--sys-color-text-secondary);cursor:default}
.k12-role-badge{margin:14px 8px 4px;padding:6px 8px;border-radius:6px;background:var(--sys-color-bg-subtle);color:var(--sys-color-text-secondary);font-size:12px}
.k12-main{min-width:0}
.k12-hero{background:linear-gradient(135deg,var(--sys-color-primary),#4f7cff);color:#fff;border-radius:14px;padding:20px;margin-bottom:12px}
.k12-hero h2{margin:0 0 6px;font-size:22px}
.k12-hero p{margin:0;opacity:.88;font-size:13px;line-height:1.7}
.k12-overview{display:grid;grid-template-columns:repeat(4,minmax(120px,1fr));gap:10px;margin:12px 0}
.k12-overview .k12-card{text-align:left}
.k12-overview .k12-meta{margin-bottom:4px}
.k12-section-title{font-size:15px;font-weight:800;margin:18px 0 8px}
.k12-module-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.k12-module{cursor:pointer;transition:transform .15s,border-color .15s}
.k12-module:hover{transform:translateY(-2px);border-color:var(--sys-color-primary)}
.k12-module strong{display:block;margin-bottom:5px}
@media (max-width:760px){.k12-shell{display:block}.k12-sidebar{position:static;margin-bottom:12px}.k12-nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.k12-overview{grid-template-columns:repeat(2,minmax(0,1fr))}.k12-module-grid{grid-template-columns:1fr}}
:root[data-theme='dark'] .k12-input,:root[data-theme='dark'] .k12-select,:root[data-theme='dark'] .k12-area{background:var(--sys-color-bg-subtle)}
`

const API = '/elvespuck/api/plugins/k12-ai-lesson-prep'
const REVIEW_LABEL = { draft: '草稿', submitted: '待审核', approved: '已通过', rejected: '已驳回' }

export default {
  name: 'K12AiLessonPrep',
  inject: ['pluginApi', 'vueH'],
  data() {
    return {
      tab: 'home',
      actor: '张老师',
      role: '任课教师',
      loading: false,
      templates: [],
      // teacher AI
      aiForm: { stage: '初中', subject: '语文', grade: '七年级', edition: '深圳版', unit: '', topic: '' },
      aiResult: null,
      aiEdits: {},
      aiTitle: '',
      saveTemplateId: 'tpl-class-hour',
      aiModels: [],
      aiDefaultModel: '',
      aiSelectedModel: '',
      aiTestResult: null,
      // teacher docs
      myDocs: [],
      docQuery: '',
      docFilter: 'all',
      selectedDocId: '',
      selectedDoc: null,
      editContent: {},
      versions: [],
      traces: [],
      preCheck: null,
      polishMode: '润色',
      polishResult: '',
      // audit
      auditStats: null,
      queue: [],
      queueFilter: 'submitted',
      queueQuery: '',
      auditDocId: '',
      auditDoc: null,
      auditVersions: [],
      auditTraces: [],
      auditPreCheck: null,
      auditComment: ''
    }
  },
  async mounted() {
    const s = document.createElement('style')
    s.id = 'k12-ai-lesson-prep-css'
    s.textContent = CSS
    document.head.appendChild(s)
    try {
      const a = await this.pluginApi.storage.get('actor')
      if (a) this.actor = a
      const r = await this.pluginApi.storage.get('role')
      if (r === '教导教研' || r === '任课教师') this.role = r
      this.tab = 'home'
      try { await this.pluginApi.storage.set('tab', this.tab) } catch {}
    } catch {}
    this.pluginApi.eventBus.emit('plugin:k12-ai-lesson-prep:ready', { at: new Date().toISOString() })
    await this.refreshAll()
  },
  beforeUnmount() {
    document.getElementById('k12-ai-lesson-prep-css')?.remove()
    this.pluginApi.eventBus.clearNamespace('plugin:k12-ai-lesson-prep')
  },
  methods: {
    async api(method, url, body, query) {
      const q = query ? '?' + new URLSearchParams(query).toString() : ''
      const res = await this.pluginApi.http[method].call(this.pluginApi.http, url + q, body)
      if (!res?.ok) throw new Error(res?.error || '请求失败')
      return res.data
    },
    withActor(b) { return { ...(b || {}), actor: this.actor } },
    async refreshAll() {
      this.loading = true
      try {
        const [templates, myDocs, auditStats, queue, aiCfg] = await Promise.all([
          this.api('get', `${API}/templates`).catch(() => []),
          this.api('get', `${API}/docs`, null, { owner: this.actor }).catch(() => []),
          this.api('get', `${API}/stats/audit`).catch(() => null),
          this.api('get', `${API}/audit/queue`, null, { status: this.queueFilter }).catch(() => []),
          this.api('get', `${API}/ai/models`).catch(() => null)
        ])
        this.templates = templates || []
        this.myDocs = myDocs || []
        this.auditStats = auditStats
        this.queue = queue || []
        if (aiCfg) {
          this.aiModels = aiCfg.presets || []
          this.aiDefaultModel = aiCfg.defaultModel || ''
          if (!this.aiSelectedModel) {
            try {
              const saved = await this.pluginApi.storage.get('aiModel')
              this.aiSelectedModel = typeof saved === 'string' ? saved : ''
            } catch { this.aiSelectedModel = '' }
          }
        }
        if (this.selectedDocId) await this.openDoc(this.selectedDocId, true)
        if (this.auditDocId) await this.openAudit(this.auditDocId, true)
      } catch (e) { this.pluginApi.showToast(e.message, 'error') } finally { this.loading = false }
    },
    async switchTab(t) {
      const allowed = this.role === '教导教研' ? ['home', 'audit', 'stats'] : ['home', 'ai', 'docs', 'resources', 'collab']
      if (!allowed.includes(t)) {
        this.pluginApi.showToast('当前身份暂无该模块权限', 'warning')
        return
      }
      this.tab = t
      try { await this.pluginApi.storage.set('tab', t) } catch {}
      await this.refreshAll()
    },
    async onRoleChange(v) {
      this.role = v
      try { await this.pluginApi.storage.set('role', v) } catch {}
      this.tab = 'home'
      try { await this.pluginApi.storage.set('tab', this.tab) } catch {}
      this.pluginApi.showToast(v === '教导教研' ? '已切换为教导教研审核页' : '已切换为老师备课页', 'info')
      await this.refreshAll()
    },
    async saveActor() {
      try {
        await this.pluginApi.storage.set('actor', this.actor)
        await this.pluginApi.storage.set('role', this.role)
      } catch {}
      this.pluginApi.showToast('已记住身份', 'success')
      await this.refreshAll()
    },
    tplOf(doc) {
      return this.templates.find(t => t.id === (doc?.templateId || this.saveTemplateId)) || this.templates[0] || null
    },
    fieldLabel(key, fallback) {
      for (const t of this.templates) {
        const f = (t.fields || []).find(x => x.key === key)
        if (f) return f.label
      }
      return fallback || key
    },
    // ---------- 老师：AI ----------
    aiEffectiveModel() {
      // 本次选择优先，空则用后端默认，仍空则跟随系统默认
      return this.aiSelectedModel || this.aiDefaultModel || ''
    },
    async testAiModel() {
      this.loading = true
      this.aiTestResult = null
      try {
        const data = await this.api('post', `${API}/ai/test`, this.withActor({ model: this.aiEffectiveModel() }))
        this.aiTestResult = data
        const ok = (data.steps || []).some(s => s.ok)
        this.pluginApi.showToast(ok ? '模型连通成功' : '所有模型通道均未连通，请查看诊断', ok ? 'success' : 'warning')
      } catch (e) {
        this.aiTestResult = { steps: [{ channel: 'request', ok: false, error: e.message }] }
        this.pluginApi.showToast(e.message, 'error')
      } finally { this.loading = false }
    },
    async onAiModelChange(v) {
      this.aiSelectedModel = v
      try { await this.pluginApi.storage.set('aiModel', v) } catch {}
      // 选择即保存为全校默认，不再需要单独保存按钮
      try {
        const data = await this.api('put', `${API}/ai/models`, this.withActor({ defaultModel: v || '' }))
        this.aiModels = data.presets || []
        this.aiDefaultModel = data.defaultModel || ''
      } catch (e) { this.pluginApi.showToast(e.message, 'error') }
    },
    async aiDesign() {
      if (!this.aiForm.topic && !this.aiForm.unit) { this.pluginApi.showToast('请填写课题或单元', 'warning'); return }
      this.loading = true
      try {
        const data = await this.api('post', `${API}/ai/design`, this.withActor({ ...this.aiForm, model: this.aiEffectiveModel() }))
        this.aiResult = data
        this.aiTitle = data?.structured?.title || `${this.aiForm.topic || this.aiForm.unit}教学设计`
        const edits = {}
        for (const sec of data?.structured?.sections || []) edits[sec.key] = sec.text
        this.aiEdits = edits
        this.polishResult = ''
        this.pluginApi.eventBus.emit('plugin:k12-ai-lesson-prep:doc-updated', { kind: 'ai-design' })
      } catch (e) { this.pluginApi.showToast(e.message, 'error') } finally { this.loading = false }
    },
    async aiPolishSelected() {
      const keys = Object.keys(this.aiEdits)
      if (!keys.length) { this.pluginApi.showToast('请先生成AI参考稿', 'warning'); return }
      const joined = keys.map(k => `【${this.fieldLabel(k, k)}】\n${this.aiEdits[k]}`).join('\n\n')
      this.loading = true
      try {
        const data = await this.api('post', `${API}/ai/polish`, this.withActor({ text: joined, mode: this.polishMode, model: this.aiEffectiveModel() }))
        this.polishResult = data.text
      } catch (e) { this.pluginApi.showToast(e.message, 'error') } finally { this.loading = false }
    },
    async saveAiAsDraft() {
      if (!this.aiTitle.trim()) { this.pluginApi.showToast('请填写教案标题', 'warning'); return }
      if (!Object.keys(this.aiEdits).length) { this.pluginApi.showToast('暂无可保存的内容', 'warning'); return }
      this.loading = true
      try {
        const doc = await this.api('post', `${API}/docs`, this.withActor({
          title: this.aiTitle, kind: '课时教案',
          stage: this.aiForm.stage, subject: this.aiForm.subject, grade: this.aiForm.grade,
          edition: this.aiForm.edition, unit: this.aiForm.unit,
          templateId: this.saveTemplateId, content: { ...this.aiEdits }, aiDraft: true
        }))
        this.myDocs.unshift(doc)
        await this.openDoc(doc.id)
        this.pluginApi.showToast('AI参考稿已存为草稿，请逐节人工确认后再提交', 'success')
      } catch (e) { this.pluginApi.showToast(e.message, 'error') } finally { this.loading = false }
    },
    // ---------- 老师：文档 ----------
    myDocsByStatus(status) {
      return (this.myDocs || []).filter(d => {
        const s = d.review?.status || 'draft'
        if (status === 'draft') return s === 'draft'
        if (status === 'submitted') return s === 'submitted'
        if (status === 'approved') return s === 'approved' || d.status === '定稿'
        if (status === 'rejected') return s === 'rejected'
        return true
      })
    },
    filteredMyDocs() {
      const kw = this.docQuery.trim().toLowerCase()
      let list = this.myDocsByStatus(this.docFilter)
      if (!kw) return list
      return list.filter(d => `${d.title}${d.subject}${d.grade}${d.status}${REVIEW_LABEL[d.review?.status] || ''}`.toLowerCase().includes(kw))
    },
    async openDoc(id, silent) {
      try {
        const doc = await this.api('get', `${API}/docs/${id}`)
        this.selectedDocId = id
        this.selectedDoc = doc
        this.editContent = { ...(doc.content || {}) }
        this.preCheck = null
        const [versions, traces] = await Promise.all([
          this.api('get', `${API}/docs/${id}/versions`).catch(() => []),
          this.api('get', `${API}/logs`, null, { targetId: id }).catch(() => [])
        ])
        this.versions = versions || []
        this.traces = traces || []
      } catch (e) { if (!silent) this.pluginApi.showToast(e.message, 'error') }
    },
    editable() {
      if (!this.selectedDoc) return false
      return this.selectedDoc.review?.status !== 'submitted' && this.selectedDoc.status !== '定稿'
    },
    async saveEdit() {
      if (!this.selectedDoc || !this.editable()) return
      this.loading = true
      try {
        const updated = await this.api('put', `${API}/docs/${this.selectedDoc.id}`, this.withActor({ content: { ...this.editContent }, note: '教师人工确认修改' }))
        this.selectedDoc = updated
        const i = this.myDocs.findIndex(d => d.id === updated.id)
        if (i >= 0) this.myDocs.splice(i, 1, updated)
        this.versions = await this.api('get', `${API}/docs/${updated.id}/versions`).catch(() => [])
        this.pluginApi.showToast('已保存，版本自动+1并留痕', 'success')
      } catch (e) { this.pluginApi.showToast(e.message, 'error') } finally { this.loading = false }
    },
    async runPreCheck() {
      if (!this.selectedDoc) return
      this.loading = true
      try {
        this.preCheck = await this.api('post', `${API}/ai/review`, this.withActor({ templateId: this.selectedDoc.templateId, content: this.editContent, model: this.aiEffectiveModel() }))
      } catch (e) { this.pluginApi.showToast(e.message, 'error') } finally { this.loading = false }
    },
    async submitReview() {
      if (!this.selectedDoc) return
      this.loading = true
      try {
        await this.api('put', `${API}/docs/${this.selectedDoc.id}`, this.withActor({ content: { ...this.editContent }, note: '提交前最后确认' })).catch(() => null)
        const updated = await this.api('post', `${API}/docs/${this.selectedDoc.id}/submit-review`, this.withActor({}))
        this.selectedDoc = updated
        const i = this.myDocs.findIndex(d => d.id === updated.id)
        if (i >= 0) this.myDocs.splice(i, 1, updated)
        this.pluginApi.showToast('已提交教导审核，审核期间锁定编辑', 'success')
      } catch (e) { this.pluginApi.showToast(e.message, 'error') } finally { this.loading = false }
    },
    async withdraw() {
      if (!this.selectedDoc) return
      try {
        const updated = await this.api('post', `${API}/docs/${this.selectedDoc.id}/withdraw`, this.withActor({}))
        this.selectedDoc = updated
        const i = this.myDocs.findIndex(d => d.id === updated.id)
        if (i >= 0) this.myDocs.splice(i, 1, updated)
        this.pluginApi.showToast('已撤回，可继续修改', 'success')
      } catch (e) { this.pluginApi.showToast(e.message, 'error') }
    },
    // ---------- 教导：审核 ----------
    filteredQueue() {
      const kw = this.queueQuery.trim().toLowerCase()
      if (!kw) return this.queue
      return this.queue.filter(d => `${d.title}${d.owner}${d.subject}${d.grade}`.toLowerCase().includes(kw))
    },
    async reloadQueue() {
      this.loading = true
      try {
        this.queue = await this.api('get', `${API}/audit/queue`, null, { status: this.queueFilter }) || []
        this.auditStats = await this.api('get', `${API}/stats/audit`).catch(() => this.auditStats)
      } catch (e) { this.pluginApi.showToast(e.message, 'error') } finally { this.loading = false }
    },
    async openAudit(id, silent) {
      try {
        const doc = await this.api('get', `${API}/docs/${id}`)
        this.auditDocId = id
        this.auditDoc = doc
        this.auditComment = ''
        this.auditPreCheck = null
        const [versions, traces, pre] = await Promise.all([
          this.api('get', `${API}/docs/${id}/versions`).catch(() => []),
          this.api('get', `${API}/logs`, null, { targetId: id }).catch(() => []),
          this.api('post', `${API}/ai/review`, this.withActor({ templateId: doc.templateId, content: doc.content, model: this.aiEffectiveModel() })).catch(() => null)
        ])
        this.auditVersions = versions || []
        this.auditTraces = traces || []
        this.auditPreCheck = pre
      } catch (e) { if (!silent) this.pluginApi.showToast(e.message, 'error') }
    },
    async audit(decision) {
      if (!this.auditDoc) return
      if (decision === 'reject' && !this.auditComment.trim()) { this.pluginApi.showToast('驳回必须填写修改意见', 'warning'); return }
      this.loading = true
      try {
        const updated = await this.api('post', `${API}/docs/${this.auditDoc.id}/audit`, this.withActor({ decision, comment: this.auditComment }))
        this.auditDoc = updated
        this.auditComment = ''
        await this.reloadQueue()
        this.pluginApi.showToast(decision === 'approve' ? '已通过并定稿锁定' : '已驳回，退回教师修改', 'success')
      } catch (e) { this.pluginApi.showToast(e.message, 'error') } finally { this.loading = false }
    }
  },
  render() {
    const h = this.vueH
    const el = (tag, props, children) => h(tag, props, children)
    const btn = (label, onClick, cls, disabled) => el('button', { class: 'k12-btn' + (cls ? ' ' + cls : ''), disabled: !!disabled, onClick }, label)
    const input = (val, onInput, placeholder) => el('input', { class: 'k12-input', value: val, placeholder: placeholder || '', style: 'flex:1;min-width:130px', onInput: e => onInput(e.target.value) })
    const select = (val, onChange, options) => el('select', { class: 'k12-select', value: val, onChange: e => onChange(e.target.value) }, options.map(o => el('option', { value: o }, o)))
    const area = (val, onInput, placeholder, rows) => el('textarea', { class: 'k12-area', value: val, placeholder: placeholder || '', rows: rows || 4, onInput: e => onInput(e.target.value) })
    const tag = (t, cls) => el('span', { class: 'k12-tag' + (cls ? ' ' + cls : '') }, t)

    const navItem = (id, label) => el('button', { class: 'k12-nav-btn' + (this.tab === id ? ' on' : ''), onClick: () => this.switchTab(id) }, label)
    const isAuditRole = this.role === '教导教研'
    const roleTitle = isAuditRole ? '教研管理工作台' : '教师备课工作台'
    const header = el('div', { class: 'k12-top' }, [
      el('div', { style: 'flex:1;min-width:220px' }, [
        el('div', { class: 'k12-title' }, 'AI备课 · 教导审核'),
        el('div', { class: 'k12-sub' }, '教师AI辅助备课 → 人工确认 → 提交审核 → 教导审批，全程留痕 ｜ 无学生端 ｜ AI仅辅助不自动定稿 ｜ 深圳版·新课标')
      ]),
      input(this.actor, v => (this.actor = v), '姓名：如 张老师 / 教导主任'),
      select(this.role, v => this.onRoleChange(v), ['任课教师', '教导教研']),
      btn('记住身份', () => this.saveActor(), 'ghost'),
      btn(this.loading ? '加载中…' : '刷新', () => this.refreshAll(), 'ghost', this.loading)
    ])

    const steps = isAuditRole
      ? el('div', { class: 'k12-steps' }, [
        el('span', { class: 'k12-step on' }, '教导教研审核'),
        el('span', {}, '→'),
        el('span', { class: 'k12-step on' }, '查阅全文与AI初审参考'),
        el('span', {}, '→'),
        el('span', { class: 'k12-step on' }, '通过定稿 / 驳回写意见留痕')
      ])
      : el('div', { class: 'k12-steps' }, [
        el('span', { class: 'k12-step on' }, '1 老师AI生成参考稿'),
        el('span', {}, '→'),
        el('span', { class: 'k12-step on' }, '2 人工确认逐节修改'),
        el('span', {}, '→'),
        el('span', { class: 'k12-step on' }, '3 提交教导审核')
      ])

    const menu = isAuditRole ? [
      ['home', '首页 / 工作台'],
      ['audit', `教研审核${this.auditStats?.submitted ? `（${this.auditStats.submitted}）` : ''}`],
      ['stats', '数据台账']
    ] : [
      ['home', '首页 / 工作台'],
      ['ai', 'AI 智能备课'],
      ['docs', '我的备课'],
      ['resources', '校本资源库'],
      ['collab', '集体备课']
    ]
    if (!menu.some(([id]) => id === this.tab)) this.tab = 'home'
    const sidebar = el('aside', { class: 'k12-sidebar' }, [
      el('div', { class: 'k12-nav-title' }, roleTitle),
      el('div', { class: 'k12-nav' }, menu.map(([id, label]) => navItem(id, label))),
      el('div', { class: 'k12-role-badge' }, isAuditRole ? '教导教研 · 只看审核与台账' : '任课教师 · 只看备课与资源')
    ])

    let body = null

    if (this.tab === 'home') {
      const pending = this.auditStats?.submitted || 0
      const overview = isAuditRole
        ? [
          ['待审核', pending],
          ['已通过', this.auditStats?.approved || 0],
          ['已驳回', this.auditStats?.rejected || 0],
          ['累计提交', this.auditStats?.total || 0]
        ]
        : [
          ['我的备课', this.myDocs.length],
          ['草稿', this.myDocs.filter(d => d.review?.status === 'draft' || !d.review?.status).length],
          ['待审核', this.myDocs.filter(d => d.review?.status === 'submitted').length],
          ['已通过', this.myDocs.filter(d => d.review?.status === 'approved').length]
        ]
      const quick = isAuditRole
        ? [['audit', '教研审核', '查看待审教案、AI初审参考与审核留痕'], ['stats', '数据台账', '查看完成率、参与率与迎检导出']]
        : [['ai', 'AI 智能备课', '根据课题快速生成教学设计参考稿'], ['docs', '我的备课', '人工确认、版本管理、提交审核'], ['resources', '校本资源库', '查找和沉淀学校优质教学资源'], ['collab', '集体备课', '参与备课任务与协同讨论']]
      body = el('div', {}, [
        el('div', { class: 'k12-hero' }, [el('h2', {}, isAuditRole ? '教研管理工作台' : `欢迎回来，${this.actor || '老师'}`), el('p', {}, isAuditRole ? '集中处理待审核教案，查看学校备课过程与质量数据。' : '从 AI 智能备课开始，把重复工作交给 AI，把最终判断留给教师。')]),
        el('div', { class: 'k12-overview' }, overview.map(([label, value]) => el('div', { class: 'k12-card' }, [el('div', { class: 'k12-meta' }, label), el('div', { class: 'k12-num' }, String(value))]))),
        el('div', { class: 'k12-section-title' }, '常用功能'),
        el('div', { class: 'k12-module-grid' }, quick.map(([id, title, desc]) => el('div', { class: 'k12-card k12-module', onClick: () => this.switchTab(id) }, [el('strong', {}, title), el('div', { class: 'k12-meta' }, desc)])))
      ])
    } else if (!isAuditRole && this.tab === 'ai') {
      const aiCard = el('div', { class: 'k12-card' }, [
        el('h4', {}, 'AI 智能备课：只负责生成参考稿'),
        el('div', { class: 'k12-row' }, [
          el('span', { class: 'k12-meta' }, 'AI模型'),
          el('select', { class: 'k12-select', value: this.aiSelectedModel, style: 'flex:1;min-width:180px', onChange: e => this.onAiModelChange(e.target.value) },
            (this.aiModels || []).map(m => el('option', { value: m.id }, `${m.label}${m.id ? `（${m.id}）` : ''}`))
          ),
          btn('测试模型', () => this.testAiModel(), 'ghost', this.loading)
        ]),
        this.aiTestResult ? el('div', { class: 'k12-meta' }, (this.aiTestResult.steps || []).map(s => `${s.ok ? '✓' : '✗'} ${s.channel}${s.error ? `：${s.error}` : ''}`).join(' ｜ ')) : null,
        el('div', { class: 'k12-row' }, [
          select(this.aiForm.stage, v => (this.aiForm.stage = v), ['小学', '初中', '高中']),
          select(this.aiForm.subject, v => (this.aiForm.subject = v), ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '科学', '信息科技', '音乐', '美术', '体育']),
          select(this.aiForm.grade, v => (this.aiForm.grade = v), ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高一', '高二', '高三'])
        ]),
        el('div', { class: 'k12-row' }, [
          input(this.aiForm.edition, v => (this.aiForm.edition = v), '教材版本'),
          input(this.aiForm.unit, v => (this.aiForm.unit = v), '单元（必填其一）'),
          input(this.aiForm.topic, v => (this.aiForm.topic = v), '课题（必填其一）')
        ]),
        el('div', { class: 'k12-row' }, [
          btn('AI生成参考稿', () => this.aiDesign(), '', this.loading),
          this.aiResult ? select(this.saveTemplateId, v => (this.saveTemplateId = v), this.templates.map(t => t.id)) : null
        ]),
        this.aiResult ? el('div', { class: 'k12-meta' }, `真模型来源：${this.aiResult.source === 'direct-deepseek' ? 'DeepSeek直连真输出' : this.aiResult.source === 'direct-gemini' ? 'Gemini Flash直连真输出' : this.aiResult.source === 'gateway-selected' ? '宿主指定模型网关真输出' : this.aiResult.source === 'gateway-default' ? '宿主默认模型真输出' : this.aiResult.source === 'direct-deepseek-fallback' ? 'DeepSeek备用直连真输出' : this.aiResult.source === 'direct-gemini-fallback' ? 'Gemini备用直连真输出' : '本地模板兜底'} ｜ 模型：${(this.aiResult.engine && (this.aiResult.engine.modelId || this.aiResult.engine.providerId)) || this.aiResult.modelUsed || ''}${this.aiResult.engineError ? `（${this.aiResult.engineError}）` : ''} ｜ 模板：${this.templates.find(t => t.id === this.saveTemplateId)?.name || ''}`) : null,
        this.aiResult?.diag ? el('div', { class: 'k12-meta' }, `诊断：读 ${this.aiResult.diag.secretsPath || '(未知路径)'} ${this.aiResult.diag.secretsExists ? '存在' : '不存在'} ｜ Key ${this.aiResult.diag.deepseekKeyConfigured ? '已配' : '未配'} ｜ 想看完整路径点右上刷新后调健康检查`) : null,
        this.aiResult ? el('div', {}, [
          el('div', { class: 'k12-row' }, [input(this.aiTitle, v => (this.aiTitle = v), '教案标题（人工确认）')]),
          ...(this.aiResult.structured?.sections || []).map(sec =>
            el('div', { key: sec.key, class: 'k12-field' }, [
              el('label', {}, `${sec.label}（可改）`),
              area(this.aiEdits[sec.key] || '', v => (this.aiEdits[sec.key] = v), sec.label, 4)
            ])
          ),
          this.aiResult.text ? el('div', { class: 'k12-pre' }, `模型全文参考：\n${this.aiResult.text}`) : null,
          el('div', { class: 'k12-meta' }, this.aiResult.structured?.notice || 'AI结果仅为参考，必须人工确认。'),
          el('div', { class: 'k12-row' }, [
            select(this.polishMode, v => (this.polishMode = v), ['润色', '精简', '扩写', '专业化', '分层建议']),
            btn('AI优化全文', () => this.aiPolishSelected(), 'ghost', this.loading),
            btn('存为草稿，去“我的备课”确认', () => this.saveAiAsDraft(), '', this.loading)
          ]),
          this.polishResult ? el('div', { class: 'k12-pre' }, this.polishResult) : null
        ]) : el('div', { class: 'k12-meta' }, '输入单元或课题后点击生成。这里只生成参考稿，正式确认和提交请去“我的备课”。')
      ])

      body = el('div', { class: 'k12-flex' }, [aiCard])
    } else if (!isAuditRole && this.tab === 'docs') {
      const draftCount = this.myDocsByStatus('draft').length
      const approvedCount = this.myDocsByStatus('approved').length
      const rejectedCount = this.myDocsByStatus('rejected').length
      const docTabs = [
        ['draft', `待提交（${draftCount}）`],
        ['approved', `已通过（${approvedCount}）`],
        ['rejected', `被驳回（${rejectedCount}）`]
      ]
      const listCard = el('div', { class: 'k12-card' }, [
        el('h4', {}, `我的备课（${this.myDocs.length}）`),
        el('div', { class: 'k12-meta' }, '这里是教师的正式备课档案：人工确认、版本留痕、提交审核都在这里完成。'),
        el('div', { class: 'k12-tabs' }, docTabs.map(([key, label]) =>
          el('button', { key, class: 'k12-tab' + (this.docFilter === key ? ' on' : ''), onClick: () => { this.docFilter = key } }, label)
        )),
        el('div', { class: 'k12-row' }, [input(this.docQuery, v => (this.docQuery = v), '搜索标题/状态…')]),
        el('div', { class: 'k12-meta' }, this.docFilter === 'draft' ? '待提交：在此人工确认后提交教导审核。' : this.docFilter === 'approved' ? '已通过：教导已定稿，只能查看不可再改。' : '被驳回：按教导意见改完后可重新提交。'),
        el('div', { class: 'k12-list' }, (() => {
          const list = this.filteredMyDocs().slice(0, 50)
          if (!list.length) return [el('div', { class: 'k12-meta' }, '该状态下暂无备课。去“AI 智能备课”生成后，会先进入待提交。')]
          return list.map(d =>
            el('div', { key: d.id, class: 'k12-item' + (d.id === this.selectedDocId ? ' sel' : ''), onClick: () => this.openDoc(d.id) }, [
              el('div', { style: 'font-weight:700;font-size:13px' }, d.title),
              el('div', {}, [tag(d.status), tag(REVIEW_LABEL[d.review?.status] || d.review?.status || '草稿', d.review?.status === 'submitted' ? 'blue' : d.review?.status === 'approved' ? 'green' : d.review?.status === 'rejected' ? 'red' : ''), tag(`v${d.version}`)]),
              el('div', { class: 'k12-meta' }, `${d.subject || ''} ${d.grade || ''} ${d.unit || ''} ｜ ${d.updatedAt ? d.updatedAt.slice(0, 16).replace('T', ' ') : ''}${d.review?.comment ? `\n教导意见：${d.review.comment}` : ''}`)
            ])
          )
        })())
      ])

      const detailCard = el('div', { class: 'k12-card' }, !this.selectedDoc ? el('div', { class: 'k12-meta' }, '请选择一篇备课，人工确认内容后提交审核。') : [
        el('h4', {}, `人工确认 · ${this.selectedDoc.title}`),
        el('div', {}, [tag(this.selectedDoc.status), tag(REVIEW_LABEL[this.selectedDoc.review?.status] || '', this.selectedDoc.review?.status === 'submitted' ? 'blue' : ''), tag(`v${this.selectedDoc.version}`), this.selectedDoc.aiDraft ? tag('AI参考稿', 'blue') : null]),
        this.selectedDoc.review?.status === 'submitted'
          ? el('div', { class: 'k12-meta' }, '已提交审核，锁定编辑。如需修改请先撤回。')
          : this.selectedDoc.status === '定稿'
            ? el('div', { class: 'k12-meta' }, '教导已通过并定稿锁定，不可再编辑。')
            : el('div', { class: 'k12-meta' }, '请逐节检查AI参考内容，改成你认可的表述后再提交。必填项缺失无法提交。'),
        ...(this.tplOf(this.selectedDoc)?.fields || Object.keys(this.editContent).map(k => ({ key: k, label: this.fieldLabel(k, k), required: false }))).map(f =>
          el('div', { key: f.key, class: 'k12-field' }, [
            el('label', {}, [f.label, f.required ? el('i', {}, '*必填') : null]),
            this.editable()
              ? area(this.editContent[f.key] || '', v => (this.editContent[f.key] = v), f.label, 4)
              : el('div', { class: 'k12-pre' }, this.selectedDoc.content?.[f.key] || '（空）')
          ])
        ),
        el('div', { class: 'k12-row' }, [
          this.editable() ? btn('保存修改', () => this.saveEdit(), 'ghost', this.loading) : null,
          this.editable() ? btn('AI初审自查', () => this.runPreCheck(), 'ghost', this.loading) : null,
          this.editable() && this.selectedDoc.review?.status !== 'rejected' ? btn('第三步：提交教导审核', () => this.submitReview(), '', this.loading) : null,
          this.editable() && this.selectedDoc.review?.status === 'rejected' ? btn('按意见改完，重新提交', () => this.submitReview(), '', this.loading) : null,
          this.selectedDoc.review?.status === 'submitted' ? btn('撤回', () => this.withdraw(), 'danger') : null
        ]),
        this.preCheck ? el('div', { class: 'k12-pre' }, [`自查：${(this.preCheck.missing || []).map(m => m.label).join('、') || '必填齐全'}\n\n`, this.preCheck.advice || '', this.preCheck.diag ? `\n\n──诊断──\n读 ${this.preCheck.diag.secretsPath} ${this.preCheck.diag.secretsExists ? '存在' : '不存在'} ｜ Key ${this.preCheck.diag.deepseekKeyConfigured ? '已配' : '未配'}` : '']) : null,
        this.selectedDoc.review?.comment ? el('div', { class: 'k12-pre' }, `教导意见：${this.selectedDoc.review.comment}\n审核人：${this.selectedDoc.review.reviewer || ''} ｜ ${this.selectedDoc.review.at || ''}`) : null,
        el('div', { class: 'k12-meta' }, `版本留痕（${this.versions.length}）：` + this.versions.map(v => `v${v.version}${v.label} ${v.by}`).join(' ｜ ')),
        el('div', { class: 'k12-meta' }, `操作留痕：` + this.traces.slice(0, 5).map(t => `${t.action}@${(t.at || '').slice(5, 16)}`).join(' ｜ '))
      ])

      body = el('div', { class: 'k12-flex' }, [listCard, detailCard])
    } else if (!isAuditRole && (this.tab === 'resources' || this.tab === 'collab')) {
      const info = this.tab === 'resources'
        ? ['校本资源库', '按学段 / 学科 / 年级 / 教材 / 单元查找学校沉淀的优质备课资源，一键复用为个人草稿。']
        : ['集体备课', '查看我参与的备课任务、协同讨论与版本留痕，按任务进入文档继续备课。']
      body = el('div', { class: 'k12-card' }, [
        el('h4', {}, info[0]),
        el('div', { class: 'k12-meta' }, info[1]),
        el('div', { class: 'k12-row' }, [input(this.tab === 'resources' ? this.docQuery : this.queueQuery, v => { if (this.tab === 'resources') this.docQuery = v; else this.queueQuery = v }, this.tab === 'resources' ? '搜索资源标题 / 知识点…' : '搜索任务 / 参与人…')]),
        el('div', { class: 'k12-pre', style: 'margin-top:12px' }, '该模块已纳入教师工作台，后续会在独立页面展开资源分类、任务看板与协同编辑，避免与 AI 生成混在同一屏。')
      ])
    } else if (isAuditRole && this.tab === 'stats') {
      body = el('div', {}, [
        this.auditStats ? el('div', { class: 'k12-stat' }, [
          el('div', { class: 'k12-card' }, [el('div', { class: 'k12-meta' }, '累计提交'), el('div', { class: 'k12-num' }, String(this.auditStats.total))]),
          el('div', { class: 'k12-card' }, [el('div', { class: 'k12-meta' }, '待审核'), el('div', { class: 'k12-num' }, String(this.auditStats.submitted))]),
          el('div', { class: 'k12-card' }, [el('div', { class: 'k12-meta' }, '已通过'), el('div', { class: 'k12-num' }, String(this.auditStats.approved))]),
          el('div', { class: 'k12-card' }, [el('div', { class: 'k12-meta' }, `通过率 ${this.auditStats.approveRate}%`), el('div', { class: 'k12-num' }, String(this.auditStats.rejected))])
        ]) : el('div', { class: 'k12-meta' }, '暂无统计数据'),
        el('div', { class: 'k12-card' }, [
          el('h4', {}, '迎检台账导出'),
          el('div', { class: 'k12-meta' }, '备课任务台账、完成台账、研讨记录台账与校本资源清单将在此一键导出为标准化文档，可直接上交教育局。'),
          el('div', { class: 'k12-row' }, [btn('导出备课台账（Excel）', () => this.pluginApi.showToast('台账导出将在独立报表模块提供', 'info'), 'ghost'), btn('导出迎检材料包', () => this.pluginApi.showToast('迎检材料包将在独立报表模块提供', 'info'), 'ghost')])
        ])
      ])
    } else if (isAuditRole && this.tab === 'audit') {
      const statsBar = this.auditStats ? el('div', { class: 'k12-stat' }, [
        el('div', { class: 'k12-card' }, [el('div', { class: 'k12-meta' }, '待审核'), el('div', { class: 'k12-num' }, String(this.auditStats.submitted))]),
        el('div', { class: 'k12-card' }, [el('div', { class: 'k12-meta' }, '已通过'), el('div', { class: 'k12-num' }, String(this.auditStats.approved))]),
        el('div', { class: 'k12-card' }, [el('div', { class: 'k12-meta' }, '已驳回'), el('div', { class: 'k12-num' }, String(this.auditStats.rejected))]),
        el('div', { class: 'k12-card' }, [el('div', { class: 'k12-meta' }, `通过率 ${this.auditStats.approveRate}%`), el('div', { class: 'k12-num' }, String(this.auditStats.total))])
      ]) : null

      const queueCard = el('div', { class: 'k12-card' }, [
        el('h4', {}, '审核队列'),
        el('div', { class: 'k12-row' }, [
          select(this.queueFilter, v => { this.queueFilter = v; this.reloadQueue() }, ['submitted', 'approved', 'rejected', 'all']),
          btn('刷新', () => this.reloadQueue(), 'ghost', this.loading)
        ]),
        el('div', { class: 'k12-row' }, [input(this.queueQuery, v => (this.queueQuery = v), '搜索标题/教师…')]),
        el('div', { class: 'k12-list' }, this.filteredQueue().map(d =>
          el('div', { key: d.id, class: 'k12-item' + (d.id === this.auditDocId ? ' sel' : ''), onClick: () => this.openAudit(d.id) }, [
            el('div', { style: 'font-weight:700;font-size:13px' }, d.title),
            el('div', {}, [tag(REVIEW_LABEL[d.review?.status] || '', d.review?.status === 'submitted' ? 'blue' : d.review?.status === 'approved' ? 'green' : 'red'), tag(`${d.owner || ''}`), tag(`v${d.version}`)]),
            el('div', { class: 'k12-meta' }, `${d.subject || ''} ${d.grade || ''} ${d.unit || ''} ｜ 提交：${(d.review?.at || d.updatedAt || '').slice(0, 16).replace('T', ' ')}`)
          ])
        ))
      ])

      const auditCard = el('div', { class: 'k12-card' }, !this.auditDoc ? el('div', { class: 'k12-meta' }, '从左侧选择一篇待审核教案。AI初审仅供参考，最终以人工结论为准。') : [
        el('h4', {}, `审核 · ${this.auditDoc.title}`),
        el('div', {}, [tag(this.auditDoc.status), tag(REVIEW_LABEL[this.auditDoc.review?.status] || ''), tag(`${this.auditDoc.owner || ''} ｜ v${this.auditDoc.version}`), this.auditDoc.aiDraft ? tag('AI辅助生成', 'blue') : null]),
        el('div', { class: 'k12-meta' }, `${this.auditDoc.stage || ''}${this.auditDoc.subject || ''} ${this.auditDoc.grade || ''} ｜ ${this.auditDoc.edition || ''} ｜ ${this.auditDoc.unit || ''} ｜ 模板：${this.templates.find(t => t.id === this.auditDoc.templateId)?.name || ''}`),
        ...(Object.entries(this.auditDoc.content || {})).map(([k, v]) =>
          el('div', { key: k, class: 'k12-field' }, [el('label', {}, this.fieldLabel(k, k)), el('div', { class: 'k12-pre' }, String(v || '（空）'))])
        ),
        this.auditPreCheck ? el('div', { class: 'k12-pre' }, [`AI初审（仅参考）：缺项 ${((this.auditPreCheck.missing || []).map(m => m.label).join('、')) || '无'}\n\n`, this.auditPreCheck.advice || '', '\n\n', this.auditPreCheck.notice || '', this.auditPreCheck.diag ? `\n──诊断──\n读 ${this.auditPreCheck.diag.secretsPath} ${this.auditPreCheck.diag.secretsExists ? '存在' : '不存在'} ｜ Key ${this.auditPreCheck.diag.deepseekKeyConfigured ? '已配' : '未配'}` : '']) : null,
        el('div', { class: 'k12-field' }, [
          el('label', {}, '审核意见（驳回必填，将原样退给老师）'),
          area(this.auditComment, v => (this.auditComment = v), '如：学情分析过于笼统，请补充本班分层情况后重交…', 3)
        ]),
        el('div', { class: 'k12-row' }, [
          this.auditDoc.review?.status === 'submitted' ? btn('通过并定稿锁定', () => this.audit('approve'), '', this.loading) : null,
          this.auditDoc.review?.status === 'submitted' ? btn('驳回重改', () => this.audit('reject'), 'danger', this.loading) : el('div', { class: 'k12-meta' }, '该文档当前不在待审核状态，结论已留痕，不可重复审核。')
        ]),
        el('div', { class: 'k12-meta' }, `审核历史：` + ((this.auditDoc.review?.history || []).map(x => `${x.action}@${(x.at || '').slice(5, 16)} by${x.by}`).join(' ｜ ') || '无')),
        el('div', { class: 'k12-meta' }, `版本留痕（${this.auditVersions.length}）：` + this.auditVersions.map(v => `v${v.version}${v.label} ${v.by}`).join(' ｜ '))
      ])

      body = el('div', {}, [statsBar, el('div', { class: 'k12-flex' }, [queueCard, auditCard])])
    } else {
      body = el('div', { class: 'k12-card' }, el('div', { class: 'k12-meta' }, '当前身份暂无该模块权限，已自动返回工作台。'))
    }

    return el('div', { class: 'k12-wrap' }, [
      header,
      el('div', { class: 'k12-shell' }, [sidebar, el('main', { class: 'k12-main' }, [steps, body])]),
      el('div', { class: 'k12-meta', style: 'margin-top:12px' }, 'AI结果仅为备课参考，必须人工确认后提交；审核意见、版本和操作全程留痕。')
    ])
  }
}
