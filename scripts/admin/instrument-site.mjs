// One-time integration helper: instrument text leaves without changing public markup.
import ts from 'ts-ast';
import fs from 'node:fs';
const files=[
 'src/app/(site)/page.tsx','src/app/(site)/hizmetler/page.tsx','src/app/(site)/hakkimizda/page.tsx','src/app/(site)/iletisim/page.tsx',
 'src/components/shared.tsx','src/components/header.tsx','src/components/garden-network.tsx','src/components/garden-process.tsx','src/components/faq.tsx','src/components/blog-grid.tsx',
 'src/app/(site)/blog/[slug]/page.tsx',
];
for(const file of files){
 let source=fs.readFileSync(file,'utf8');
 if(source.includes('CmsText')) continue;
 const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const changes=[];
 function walk(node){
  if(ts.isJsxText(node) && node.text.trim()) changes.push({start:node.pos,end:node.end,text:`<CmsText>${node.text}</CmsText>`});
  if(ts.isJsxExpression(node) && ts.isJsxElement(node.parent) && node.expression){
   const exp=node.expression.getText(ast);
   if(/^(service\.(title|shortTitle|description)|detail|item\.(label|question|answer)|business\.(phone|owner|location|region|name|instagramHandle)|step\.(title|caption)|post\.(title|intro)|section\.title|paragraph|source\.title|title|accent)$/.test(exp)){
    changes.push({start:node.getStart(ast),end:node.end,text:`<CmsText>{${exp}}</CmsText>`});
   }
  }
  ts.forEachChild(node,walk);
 }
 walk(ast);
 for(const edit of changes.sort((a,b)=>b.start-a.start)) source=source.slice(0,edit.start)+edit.text+source.slice(edit.end);
 source=source.replace('import Image from "next/image";', '').replace('import Link from "next/link";','');
 source=source.replace(/<Image\b/g,'<CmsImage').replace(/<Link\b/g,'<CmsLink').replace(/<\/Link>/g,'</CmsLink>').replace(/<a\b/g,'<CmsAnchor').replace(/<\/a>/g,'</CmsAnchor>');
 const imp='import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";\n';
 source=source.includes('"use client";')?source.replace('"use client";','"use client";\n'+imp):imp+source;
 fs.writeFileSync(file,source);
}
