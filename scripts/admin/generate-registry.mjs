import fs from 'node:fs';
import ts from 'ts-ast';
const load = async file => import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const {business,services,gardenSteps,navigation}=await load('src/lib/content.ts');
const {blogPosts}=await load('src/lib/blog.ts');
const {textKey,normalizeText}=await load('src/lib/cms-shared.ts');
function parsed(file){return ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX)}
function literalText(file){
 const ast=parsed(file), found=[];
 function walk(node){
  if(ts.isJsxText(node)&&node.text.trim())found.push(normalizeText(node.text));
  if(ts.isJsxAttribute(node)&&['title','accent'].includes(node.name.getText(ast))&&node.initializer&&ts.isStringLiteral(node.initializer)&&node.parent.parent.tagName?.getText(ast)==='PageHeading')found.push(node.initializer.text);
  ts.forEachChild(node,walk);
 } walk(ast);return found;
}
const faqAst=parsed('src/components/faq.tsx');let questions=[];
function findQuestions(node){if(ts.isVariableDeclaration(node)&&node.name.getText(faqAst)==='questions')questions=Function('return '+node.initializer.getText(faqAst))();ts.forEachChild(node,findQuestions)}findQuestions(faqAst);
const documents=[],texts={},images=new Map();
function doc(path,title,group,fields,slots=[]){
 const unique=[...new Set(fields.map(normalizeText).filter(Boolean))];
 documents.push({id:path,path:path==='shared'?'/':path,title,group,fields:unique.map(text=>{const id=textKey(text);texts[id]=text;return{id,label:text.length>70?text.slice(0,67)+'…':text,text}}),images:[...new Set(slots.map(s=>s.src))]});
 for(const slot of slots){const existing=images.get(slot.src);images.set(slot.src,existing?{...existing,pages:[...new Set([...existing.pages,path])]}:{...slot,pages:[path]})}
}
const fileText=(...files)=>files.flatMap(literalText);
const contact=[business.name,business.owner,business.phone,business.location,business.region,business.instagramHandle];
const serviceText=services.flatMap(s=>[s.title,s.shortTitle,s.description,...s.details]);
const serviceImages=services.map(s=>({src:s.image,alt:s.alt}));
doc('/','Ana sayfa','Sayfalar',[
 ...fileText('src/app/(site)/page.tsx','src/components/garden-network.tsx'),
 ...services.map(s=>s.title),...gardenSteps.flatMap(s=>[s.title,s.caption]),...questions.flatMap(q=>[q.question,q.answer])
],[{src:'/images/hero.webp',alt:'Bahçe ve pergola'},...serviceImages,...gardenSteps.map(s=>({src:s.image,alt:s.caption}))]);
doc('/hizmetler/','Hizmetlerimiz','Sayfalar',[...fileText('src/app/(site)/hizmetler/page.tsx'),...serviceText],serviceImages);
doc('/hakkimizda/','Hakkımızda','Sayfalar',[...fileText('src/app/(site)/hakkimizda/page.tsx'),business.phone],[{src:'/images/lawn.webp',alt:'Ağaçlar ve çiçek tarhları arasındaki yeşil çim alan'}]);
doc('/iletisim/','İletişim','Sayfalar',[...fileText('src/app/(site)/iletisim/page.tsx'),...contact]);
doc('/blog/','Blog','Sayfalar',fileText('src/app/(site)/blog/page.tsx'));
doc('shared','Üst menü ve alt bilgi','Ortak alanlar',[
 ...fileText('src/components/header.tsx','src/components/shared.tsx'),...navigation.map(n=>n.label),...services.map(s=>s.title),...contact
],[{src:'/images/logo.webp',alt:'Gültekin Peyzaj logosu'}]);
for(const p of blogPosts)doc(`/blog/${p.slug}/`,p.title,'Yazılar',[p.title,p.intro,...p.sections.flatMap(s=>[s.title,...s.paragraphs]),...p.sources.map(s=>s.title),'Kaynaklar','Blog','Diğer yazılar'],[{src:p.image,alt:p.alt}]);
fs.writeFileSync('src/lib/admin/cms-registry.json',JSON.stringify({documents,texts,images:[...images.values()]},null,2)+'\n');
console.log(`Registered ${documents.length} documents, ${Object.keys(texts).length} text fragments and ${images.size} image sources.`);
