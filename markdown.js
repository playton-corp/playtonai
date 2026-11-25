'use strict';
// Construct DOM nodes instead of interpreting model-generated HTML.
function renderMarkdown(root, source) {
  const node=(tag,text)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;return e;};
  function inline(target, str, depth=0){
    if(depth>8){target.append(document.createTextNode(str));return;}
    const re=/(`[^`\n]+`|\*\*[^\n]+?\*\*|__[^\n]+?__|~~[^\n]+?~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\))/g;
    let pos=0;for(const m of str.matchAll(re)){target.append(document.createTextNode(str.slice(pos,m.index)));const v=m[0];let el;
      if(v.startsWith('`'))el=node('code',v.slice(1,-1));
      else if(v.startsWith('[')){const split=v.lastIndexOf('](');el=node('a',v.slice(1,split));el.href=v.slice(split+2,-1);el.target='_blank';el.rel='noopener noreferrer';}
      else{const n=v.startsWith('**')||v.startsWith('__')||v.startsWith('~~')?2:1;el=node(v.startsWith('~~')?'del':n===2?'strong':'em');inline(el,v.slice(n,-n),depth+1);}
      target.append(el);pos=m.index+v.length;
    }target.append(document.createTextNode(str.slice(pos)));
  }
  root.replaceChildren();
  const lines=String(source).replace(/\r\n/g,'\n').split('\n');
  const cells=s=>s.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
  const block=s=>/^\s*(```|#{1,6}\s|[-*+]\s|\d+\.\s|>|---+$)/.test(s);
  for(let i=0;i<lines.length;){
    const line=lines[i];if(!line.trim()){i++;continue;}
    if(/^\s*```/.test(line)){const lang=line.trim().slice(3).trim(),content=[];i++;while(i<lines.length&&!/^\s*```/.test(lines[i]))content.push(lines[i++]);if(i<lines.length)i++;const pre=node('pre'),code=node('code',content.join('\n'));if(lang)pre.dataset.language=lang;pre.append(code);root.append(pre);continue;}
    const head=line.match(/^\s*(#{1,6})\s+(.+)$/);if(head){const h=node('h'+head[1].length);inline(h,head[2]);root.append(h);i++;continue;}
    if(/^\s*(?:---+|\*\*\*+)\s*$/.test(line)){root.append(node('hr'));i++;continue;}
    if(line.includes('|')&&i+1<lines.length&&/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i+1])){const box=node('div'),table=node('table'),thead=node('thead'),tr=node('tr');box.className='table-scroll';for(const v of cells(line)){const th=node('th');inline(th,v);tr.append(th);}thead.append(tr);table.append(thead);const tbody=node('tbody');i+=2;while(i<lines.length&&lines[i].includes('|')&&lines[i].trim()){const row=node('tr');for(const v of cells(lines[i++])){const td=node('td');inline(td,v);row.append(td);}tbody.append(row);}table.append(tbody);box.append(table);root.append(box);continue;}
    const item=line.match(/^\s*([-*+]|\d+\.)\s+(.+)$/);if(item){const ordered=/\d/.test(item[1]),list=node(ordered?'ol':'ul');while(i<lines.length){const next=lines[i].match(/^\s*([-*+]|\d+\.)\s+(.+)$/);if(!next||/\d/.test(next[1])!==ordered)break;const li=node('li');inline(li,next[2]);list.append(li);i++;}root.append(list);continue;}
    if(/^\s*>/.test(line)){const b=node('blockquote');while(i<lines.length&&/^\s*>/.test(lines[i])){const p=node('p');inline(p,lines[i++].replace(/^\s*>\s?/,''));b.append(p);}root.append(b);continue;}
    const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!block(lines[i])&&!(lines[i].includes('|')&&lines[i+1]?.includes('---')))paragraph.push(lines[i++]);const p=node('p');paragraph.forEach((v,j)=>{if(j)p.append(node('br'));inline(p,v);});root.append(p);
  }
}
