import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { getDataDir, projectRoot, DEFAULT_PORT } from '../../shared/config.js';
import { WritableLibrary, safeMessage } from '../evidence/write.js';
import { LibraryError } from '../evidence/read.js';
import { loadDemoLibrary } from '../evidence/demo.js';
import { getCapabilities } from '../gateways/local.js';

const sourceTypes=z.enum(['canvas','gradescope','edstem','web','file','notes']);
const kinds=z.enum(['syllabus','announcement','lecture','assignment','paper','notes']);
const importSchema=z.object({courseId:z.string().min(1).max(100),title:z.string().trim().min(1).max(240),sourceUrl:z.string().max(2000).optional(),sourceType:sourceTypes.optional(),kind:kinds.optional(),folder:z.string().max(120).optional(),tags:z.array(z.string().max(40)).max(15).optional(),publishedAt:z.string().max(80).optional(),content:z.string().max(2_000_000).optional(),format:z.enum(['text','html']).optional(),documentId:z.string().max(100).optional()});
const asyncRoute=(fn:(req:Request,res:Response)=>Promise<unknown>)=>(req:Request,res:Response,next:NextFunction)=>{Promise.resolve(fn(req,res)).catch(next);};
function requireString(value:unknown,label:string):string{if(typeof value!=='string'||!value||value.length>200)throw new LibraryError('invalid_input',`${label} is required.`);return value;}
function published(value?:string){if(!value)return undefined;const d=new Date(/^\d{4}-\d{2}-\d{2}$/.test(value)?`${value}T12:00:00Z`:value);if(Number.isNaN(d.getTime()))throw new LibraryError('invalid_input','Choose a valid publication date.');return d.toISOString();}
function tokenMatches(actual:unknown,expected:string){if(typeof actual!=='string'||actual.length>128)return false;const a=Buffer.from(actual);const b=Buffer.from(expected);return a.length===b.length && timingSafeEqual(a,b);}

export async function createApp(options:{dataDir?:string;seed?:boolean;port?:number;token?:string}={}) {
  const port=options.port || DEFAULT_PORT;
  const library=new WritableLibrary(options.dataDir || getDataDir());
  if(options.seed!==false && library.reader.listCourses().length===0)await loadDemoLibrary(library);
  const token=options.token || randomBytes(24).toString('hex');
  const app=express();
  app.disable('x-powered-by');
  app.locals.library=library;
  app.locals.pairingToken=token;
  app.use((req,res,next)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    let host='';try{host=new URL(`http://${req.headers.host || ''}`).hostname;}catch{}
    if(!['127.0.0.1','localhost','[::1]'].includes(host))return res.status(403).json({error:'Local host header required.',code:'origin_denied'});
    const origin=req.get('origin');
    const extension=!!origin && /^chrome-extension:\/\/[a-p]{32}$/.test(origin);
    const localOrigin=origin===`http://127.0.0.1:${port}` || origin===`http://localhost:${port}`;
    if(origin && !extension && !localOrigin)return res.status(403).json({error:'This origin is not allowed.',code:'origin_denied'});
    if(req.get('sec-fetch-site')==='cross-site'&&!extension)return res.status(403).json({error:'Cross-site access is not allowed.',code:'origin_denied'});
    if(extension){res.setHeader('Access-Control-Allow-Origin',origin!);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type, X-Course-Copilot-Token');res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,OPTIONS');}
    if(req.method==='OPTIONS')return res.status(204).end();
    if((extension || !['GET','HEAD'].includes(req.method)) && !tokenMatches(req.get('X-Course-Copilot-Token'),token))return res.status(403).json({error:'Pair this client with the local app first.',code:'unpaired_client'});
    if(req.path==='/api/bootstrap'&&extension)return res.status(403).json({error:'Open the local app to obtain a pairing code.',code:'origin_denied'});
    next();
  });
  app.use(express.json({limit:'3mb'}));
  const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:25*1024*1024,files:1,fields:15}});
  app.get('/api/health',(_req,res)=>res.json({ok:true,version:'0.1.0',storage:'sqlite',mode:'local'}));
  app.get('/api/bootstrap',asyncRoute(async(_req,res)=>{
    const node=resolve(projectRoot(),'node_modules/node/bin/node');
    res.json({courses:library.reader.listCourses(),capabilities:await getCapabilities(),pairingToken:token,mcpCommand:`codex mcp add course-copilot -- ${JSON.stringify(existsSync(node)?node:'node')} ${JSON.stringify(resolve(projectRoot(),'dist/mcp/index.js'))}`,extensionPath:resolve(projectRoot(),'dist/extension')});
  }));
  app.get('/api/capabilities',asyncRoute(async(_req,res)=>res.json(await getCapabilities())));
  app.get('/api/courses',(_req,res)=>res.json(library.reader.listCourses()));
  app.post('/api/courses',(req,res,next)=>{try{const data=z.object({name:z.string().trim().min(1).max(160),code:z.string().trim().min(1).max(40),color:z.string().regex(/^#[a-f\d]{6}$/i).optional()}).parse(req.body);res.status(201).json(library.createCourse(data));}catch(e){next(e);}});
  app.get('/api/search',asyncRoute(async(req,res)=>{
    const limit=req.query.limit?Math.min(100,Math.max(1,Number(req.query.limit))):100;
    res.json(await library.reader.search({courseId:requireString(req.query.courseId,'Course'),query:typeof req.query.q==='string'?req.query.q.slice(0,500):'',sourceType:typeof req.query.sourceType==='string'?req.query.sourceType:undefined,folder:typeof req.query.folder==='string'?req.query.folder:undefined,from:typeof req.query.from==='string'?req.query.from:undefined,to:typeof req.query.to==='string'?req.query.to:undefined,versionId:typeof req.query.versionId==='string'?req.query.versionId:undefined,view:req.query.view==='issues'?'issues':req.query.view==='updates'?'updates':'all',limit}));
  }));
  app.get('/api/documents/:id',(req,res,next)=>{try{res.json(library.reader.getDocument(requireString(req.query.courseId,'Course'),req.params.id,typeof req.query.versionId==='string'?req.query.versionId:undefined,typeof req.query.extractionRevisionId==='string'?req.query.extractionRevisionId:undefined));}catch(e){next(e);}});
  app.get('/api/documents/:id/original',(req,res,next)=>{try{const original=library.reader.readOriginal(requireString(req.query.courseId,'Course'),req.params.id,requireString(req.query.versionId,'Saved version'));res.setHeader('Content-Type','application/octet-stream');res.attachment(original.name);res.setHeader('Content-Length',String(original.bytes.length));res.send(original.bytes);}catch(e){next(e);}});
  app.get('/api/conflicts',(req,res,next)=>{try{res.json(library.reader.getConflicts(requireString(req.query.courseId,'Course'),typeof req.query.documentId==='string'?req.query.documentId:undefined));}catch(e){next(e);}});
  app.post(['/api/import','/api/capture'],asyncRoute(async(req,res)=>{const input=importSchema.parse(req.body);input.publishedAt=published(input.publishedAt);res.status(201).json(await library.importText(input));}));
  app.post(['/api/import-file','/api/upload'],upload.single('file'),asyncRoute(async(req,res)=>{
    if(!req.file)throw new LibraryError('invalid_input','Choose a file to import.');
    const input=importSchema.parse({...req.body,title:req.body.title || req.file.originalname,tags:undefined});input.publishedAt=published(input.publishedAt);
    const mime=req.file.mimetype==='application/octet-stream' && /\.pdf$/i.test(req.file.originalname)?'application/pdf':req.file.mimetype;
    res.status(201).json(await library.importBytes(input,req.file.buffer,mime,req.file.originalname));
  }));
  app.patch('/api/documents/:id',(req,res,next)=>{try{const data=z.object({courseId:z.string().min(1),title:z.string().trim().min(1).max(240).optional(),folder:z.string().max(120).optional(),tags:z.array(z.string().max(40)).max(15).optional(),kind:kinds.optional()}).parse(req.body);res.json(library.editMetadata(data.courseId,req.params.id,data));}catch(e){next(e);}});
  app.post('/api/documents/:id/process',asyncRoute(async(req,res)=>res.json(await library.processLocally(requireString(req.body.courseId,'Course'),req.params.id))));
  app.post('/api/documents/:id/capture-report',(req,res,next)=>{try{const data=z.object({courseId:z.string().min(1),limitations:z.array(z.string().max(500)).max(40),versionId:z.string().max(100).optional()}).parse(req.body);res.json(library.addCaptureLimitations(data.courseId,req.params.id,data.limitations,data.versionId));}catch(e){next(e);}});
  app.post('/api/demo/load',asyncRoute(async(_req,res)=>res.json(await loadDemoLibrary(library))));
  const ui=resolve(projectRoot(),'dist/ui');
  app.use(express.static(ui,{index:'index.html',etag:false,setHeaders:(res,path)=>{if(path.endsWith('.html'))res.setHeader('Cache-Control','no-store');}}));
  app.get('*',(_req,res)=>{if(existsSync(resolve(ui,'index.html')))res.sendFile(resolve(ui,'index.html'));else res.status(503).send('Run npm run build or npm run dev to prepare the interface.');});
  app.use((error:any,_req:Request,res:Response,_next:NextFunction)=>{
    if(error instanceof z.ZodError)return res.status(400).json({error:error.issues[0]?.message || 'Invalid input.',code:'invalid_input'});
    if(error instanceof multer.MulterError)return res.status(413).json({error:'The file could not be uploaded. Use one file under 25 MB.',code:'invalid_input'});
    const status=error instanceof LibraryError?error.status:typeof error.status==='number'?error.status:500;
    res.status(status).json({error:status===500?'The operation failed. Your saved originals remain available.':safeMessage(error),code:error instanceof LibraryError?error.code:'operation_failed'});
  });
  return app;
}
export async function startServer(){
  const port=Number(process.env.PORT || DEFAULT_PORT);
  const app=await createApp({port});
  const server=app.listen(port,'127.0.0.1',()=>console.log(`Course Copilot local: http://127.0.0.1:${port}`));
  server.on('error',(e)=>{console.error(`Could not start the local app: ${safeMessage(e)}`);app.locals.library.close();process.exitCode=1;});
  const stop=()=>server.close(()=>{app.locals.library.close();process.exit(0);});
  process.once('SIGINT',stop);process.once('SIGTERM',stop);
  return server;
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href)await startServer();
