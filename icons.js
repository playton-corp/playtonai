/* Shared, dependency-free line icons for all PlaytonAI providers. */
(() => {
  'use strict';
  const paths = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    attach: '<path d="m21.4 11.6-9.5 9.5a6 6 0 0 1-8.5-8.5L14 2a4 4 0 0 1 5.7 5.7L9.1 18.3a2 2 0 0 1-2.8-2.8l9.9-9.9"/>',
    send: '<path d="M12 19V5m-6 6 6-6 6 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3m4 0-1 15H6L5 6m5 4v7m4-7v7"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.5-4A8.5 8.5 0 1 1 21 11.5Z"/><path d="M9 10h7m-7 4h5"/>',
    limits: '<path d="M4 19h16M7 15v-4m5 4V5m5 10V8"/>',
    sparkle: '<path d="M12 2c0 6-4 10-10 10 6 0 10 4 10 10 0-6 4-10 10-10-6 0-10-4-10-10Z"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 8a7 7 0 0 1 12-2l2 3M4 15l2 3a7 7 0 0 0 12-2"/>',
  };
  const make = name => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.classList.add('ui-icon');
    svg.innerHTML = paths[name];
    return svg;
  };
  const css = document.createElement('style');
  css.textContent = `
    .ui-icon { width: 20px; height: 20px; flex: 0 0 auto; vertical-align: middle; pointer-events: none; }
    .icon-label { display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
    .new.icon-label { justify-content: flex-start; }
    .icon-only { align-items: center; justify-content: center; }
    #attach .ui-icon, #send .ui-icon { width: 23px; height: 23px; }
    .history-item .icon-only .ui-icon, .attachment .icon-only .ui-icon, .copy .ui-icon { width: 16px; height: 16px; }
    .logo .ui-icon { width: 60%; height: 60%; }
    #models.icon-label { display: inline-flex; min-width: 0; }
    #models .model-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
    #models .ui-icon { width: 16px; height: 16px; }
    .author:before { content: none !important; }
    .author > .ui-icon { background: linear-gradient(145deg,#b4e1ff,#aca0ff); color: #10233f; width: 30px; height: 30px; padding: 6px; border-radius: 10px; }
  `;
  document.head.append(css);
  function put(node, name, label = '', aria = '') {
    if (!node || node.querySelector(':scope > .ui-icon')) return;
    node.classList.add(label ? 'icon-label' : 'icon-only');
    if (aria) node.setAttribute('aria-label', aria);
    node.replaceChildren(make(name));
    if (label) node.append(document.createTextNode(label));
  }
  function update() {
    const byId = id => document.getElementById(id);
    for (const [id,name,label,aria] of [
      ['menu','menu','','Меню'], ['attach','attach','','Прикрепить файлы'],
      ['send','send','','Отправить'], ['close','close','','Закрыть'],
      ['closeConnect','close','','Закрыть'], ['newChat','plus','Новый чат'],
      ['navChat','chat','Чат'], ['navLimits','limits','Лимиты'],
      ['stop','stop','Стоп'], ['refresh','refresh','Обновить с сервера'],
    ]) put(byId(id),name,label,aria);
    for (const n of document.querySelectorAll('.history-item > button:last-child')) put(n,'trash','','Удалить диалог');
    for (const n of document.querySelectorAll('.attachment > button')) put(n,'close','','Убрать вложение');
    for (const n of document.querySelectorAll('.logo')) put(n,'sparkle');
    for (const n of document.querySelectorAll('.author')) if (!n.querySelector(':scope > .ui-icon')) n.prepend(make('sparkle'));
    for (const n of document.querySelectorAll('.copy')) put(n,'copy',n.textContent);
    for (const n of document.querySelectorAll('.file-tag')) if (n.textContent.startsWith('📎')) put(n,'attach',n.textContent.replace(/^📎\s*/,''));
    for (const n of document.querySelectorAll('.switch-provider')) if (n.textContent.startsWith('★')) put(n,'sparkle',n.textContent.replace(/^★\s*/,''));
    const model = byId('models');
    if (model && !model.querySelector(':scope > .ui-icon')) {
      const label = document.createElement('span');
      label.className = 'model-label';
      label.textContent = model.textContent.replace(/\s*[▾▼]$/, '');
      model.classList.add('icon-label');
      model.replaceChildren(label,make('chevron'));
    }
  }
  update();
  new MutationObserver(update).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
