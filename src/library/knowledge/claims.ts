import { createHash } from 'node:crypto';
import type { Claim, Conflict, DocumentKind, EvidenceRef } from '../../shared/types.js';

const months: Record<string, number> = { jan:1, feb:2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9, oct:10, nov:11, dec:12 };
function validDate(year:number,month:number,day:number):string|null { const d=new Date(Date.UTC(year,month-1,day)); return d.getUTCFullYear()===year && d.getUTCMonth()===month-1 && d.getUTCDate()===day ? String(year)+'-'+String(month).padStart(2,'0')+'-'+String(day).padStart(2,'0') : null; }
export function parseDate(value: string, year?: number): string | null {
  const iso = value.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) return validDate(Number(iso[1]),Number(iso[2]),Number(iso[3]));
  const m = value.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(20\d{2}))?/i);
  if (!m) return null;
  const month = months[m[1].slice(0,3).toLowerCase()];
  const day = Number(m[2]);
  if (day < 1 || day > 31) return null;
  if(!m[3] && !year)return null;
  return validDate(Number(m[3] || year),month,day);
}
export function extractClaims(text: string, context: { ref: EvidenceRef; title: string; kind: DocumentKind; publishedAt: string | null }): Claim[] {
  const result: Claim[] = [];
  const year = context.publishedAt ? new Date(context.publishedAt).getUTCFullYear() : undefined;
  const sentences = text.split(/\n+|(?<=[.!?])\s+/).filter(Boolean);
  for (const sentence of sentences) {
    if (!/\b(due|deadline|submit|submission|moved|extended)\b/i.test(sentence)) continue;
    const subject = sentence.match(/\b(final\s+project|course\s+project|project\s+\d+|assignment\s+\d+|homework\s+\d+|hw\s*\d+|midterm|final\s+exam)\b/i)?.[1]
      || context.title.match(/\b(final\s+project|course\s+project|project\s+\d+|assignment\s+\d+|homework\s+\d+|hw\s*\d+)\b/i)?.[1];
    if (!subject) continue;
    const found = [...sentence.matchAll(/\b(?:20\d{2}-\d{2}-\d{2}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+20\d{2})?)\b/gi)].map(m => parseDate(m[0], year)).filter((d): d is string => !!d);
    if (!found.length) continue;
    const explicit = /\b(moved|extended|changed|rescheduled|supersedes|replaces)\b/i.test(sentence) && found.length >= 2;
    const key = subject.toLowerCase().replace(/\s+/g,' ').trim();
    const value = found[found.length - 1];
    result.push({ id: createHash('sha256').update(`${context.ref.versionId}:${key}:${value}:${sentence}`).digest('hex').slice(0,24), subject: subject.replace(/\b\w/g, c => c.toUpperCase()), subjectKey: key, type:'deadline', value, excerpt: sentence.trim(), isExplicitUpdate: explicit, oldValue: explicit ? found[0] : null, ref: context.ref, sourceTitle: context.title, kind: context.kind, publishedAt: context.publishedAt });
  }
  return result;
}
export function assessConflicts(claims: Claim[]): Conflict[] {
  const grouped = new Map<string, Claim[]>();
  for (const claim of claims) { const arr = grouped.get(claim.subjectKey) || []; arr.push(claim); grouped.set(claim.subjectKey, arr); }
  const conflicts: Conflict[] = [];
  for (const [key, group] of grouped) {
    const values = new Set(group.map(c => c.value));
    if (values.size < 2) continue;
    const updates = group.filter(c => c.kind === 'announcement' && c.isExplicitUpdate && c.oldValue && group.some(old => old.value === c.oldValue));
    // Publication evidence and an explicit old->new statement are required; capture recency never selects a winner.
    const supported = updates.filter(c => !!c.publishedAt && group.filter(o => o.value === c.oldValue).every(o => !o.publishedAt || c.publishedAt! >= o.publishedAt));
    const candidates = supported.filter(c => [...values].every(v => v === c.value || v === c.oldValue));
    const winnerValues = new Set(candidates.map(c => c.value));
    const winner = winnerValues.size === 1 ? candidates.sort((a,b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))[0] : null;
    const id = createHash('sha256').update(`${key}:${[...values].sort().join('|')}`).digest('hex').slice(0,24);
    conflicts.push({ id, subject:group[0].subject, status: winner ? 'resolved_update' : 'unresolved', explanation: winner ? `The saved announcement explicitly changes this ${winner.subject.toLowerCase()} deadline from ${winner.oldValue} to ${winner.value}. Its publication evidence supports that update. Both originals and other syllabus facts remain available.` : 'Saved sources disagree on this deadline, and the saved evidence does not establish a supported supersession. Review both sources; capture time alone is not authority.', applicable: winner ? group.filter(c => c.value === winner.value) : [], competing: winner ? group.filter(c => c.value !== winner.value) : group });
  }
  return conflicts;
}
export function normalizeSourceUrl(input: string): string {
  const u = new URL(input);
  if (!['http:','https:'].includes(u.protocol)) throw new Error('Only http or https source URLs are accepted.');
  u.username = ''; u.password = '';
  const scrub = (params: URLSearchParams) => {
    const normalized = (key:string) => key.replace(/[-_.\s]/g, '').toLowerCase();
    const keys = [...params.keys()];
    const signed = keys.some(key => /^(xamz|xgoog|awsaccesskeyid$|googleaccessid$|accesskeyid$|sig$|signature$|keypairid$)/.test(normalized(key)));
    for (const key of keys) {
      const name = normalized(key);
      if (/^utm|token|auth|signature|secret|credential|session|password|apikey|jwt|nonce|ticket|saml/.test(name) || /^(xamz|xgoog|awsaccesskeyid$|googleaccessid$|accesskeyid$|sig$|code$|state$|keypairid$)/.test(name) || (signed && /^(expires|policy)$/.test(name))) params.delete(key);
    }
    params.sort();
  };
  // Hash routers identify distinct sources; ordinary section/auth fragments do not.
  if (/^#!?\//.test(u.hash)) {
    const route = u.hash.slice(1).split('#',1)[0], split = route.indexOf('?');
    if (split >= 0) { const params = new URLSearchParams(route.slice(split + 1)); scrub(params); u.hash = route.slice(0, split) + (params.size ? '?' + params.toString() : ''); }
  } else u.hash = '';
  scrub(u.searchParams);
  u.searchParams.sort();
  return u.toString();
}
export function cosine(a: number[], b: number[]): number { if(a.length!==b.length || !a.length) return 0; let n=0,aa=0,bb=0; for(let i=0;i<a.length;i++){n+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];} return aa&&bb?n/Math.sqrt(aa*bb):0; }
