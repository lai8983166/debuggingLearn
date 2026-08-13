import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🔑',
      message: '点击"登录"，然后刷新页面——登录态消失了。明明点了"记住我"，怎么没记住？',
    },
    {
      emoji: '📦',
      message: '打开 Application 面板 → 左侧 Storage → Local Storage → 当前域名。看里面存了哪些 key。',
    },
    {
      emoji: '🔍',
      message: '应该能看到一个拼错的 key（app.session.tokn），而读取时找的是 app.session.token。',
    },
  ],
  steps: [
    {
      title: '登录',
      body: '在输入框随便填用户名，点"登录"。然后按 F5 刷新页面——发现登录态丢了。',
      highlightSelector: '.session__state--out input, .session__state--in',
    },
    {
      title: '打开 Application 面板',
      body: 'DevTools 切到 Application 面板。左侧展开 Storage → Local Storage → 点击当前域名。',
      devToolsScreenshot: 'application-panel',
    },
    {
      title: '看 key 列表',
      body: '右侧会列出所有 localStorage 条目。注意看有没有看起来"拼错"的 key。',
      devToolsScreenshot: 'application-localstorage',
    },
    {
      title: '双击编辑（可选）',
      body: '你可以双击 key 名编辑它（实验性质）。或双击 value 看存储的内容。',
    },
    {
      title: '注意其他存储',
      body: 'Application 面板左侧还有 Cookies / IndexedDB / Session Storage 等。token 类数据可能存在任一处。',
    },
  ],
  hints: [
    { text: '"记住我"用 localStorage 存 token。' },
    { text: 'Application 面板看 Local Storage。' },
    { text: '存的 key 是 app.session.tokn（少了 e），但读的是 app.session.token。' },
  ],
  validate: () => {
    // Active validation: detect the misspelled key still present.
    const wrongKey = localStorage.getItem('app.session.tokn');
    const rightKey = localStorage.getItem('app.session.token');
    if (rightKey) {
      return { passed: true, feedback: '' };
    }
    if (wrongKey) {
      return {
        passed: false,
        feedback:
          '看 localStorage：有个 key 是 app.session.tokn，但代码读的是 app.session.token。把错的 key 改对（或删了重登），再点检查答案。',
      };
    }
    return {
      passed: false,
      feedback: '还没登录过吧？先点"登录"，再回到 Application 面板看 localStorage。',
    };
  },
  reflection: {
    prompt: '刷新后登录态丢失的根因是？',
    options: [
      '写入用 app.session.tokn（拼写错误），读取用 app.session.token',
      'localStorage 在刷新后被浏览器清空',
      'token 过期了',
      'React 状态没和 localStorage 同步',
    ],
    correctIndex: 0,
    explanation:
      'localStorage 不会自动清空。读写 key 名必须严格一致；拼错（漏一个字母）就会读到 null。',
  },
};
