export type Outcome = 'complete' | 'partial' | 'failed' | 'unsupported';
export type SourceType = 'canvas' | 'gradescope' | 'edstem' | 'web' | 'file' | 'notes';
export type DocumentKind = 'syllabus' | 'announcement' | 'lecture' | 'assignment' | 'paper' | 'notes';
export interface Course { id: string; code: string; name: string; color: string; documentCount: number; }
export interface EvidenceRef { courseId: string; documentId: string; sourceId: string; versionId: string; extractionRevisionId: string; passageId?: string; }
export interface Passage { id: string; text: string; location: string; ref: EvidenceRef; }
export interface SourceCitation { ref: EvidenceRef; sourceUrl: string | null; capturedAt: string; publishedAt: string | null; location: string; }
export interface Material { id: string; sourceId: string; courseId: string; title: string; sourceUrl: string | null; sourceType: SourceType; kind: DocumentKind; folder: string; tags: string[]; capturedAt: string; lastObservedAt: string; publishedAt: string | null; versionId: string; extractionRevisionId: string; versionCount: number; outcome: Outcome; limitations: string[]; preview: string; summary: string | null; summaryModel: string | null; isDemo: boolean; conflictCount: number; updateCount: number; }
export interface Claim { id: string; subject: string; subjectKey: string; type: 'deadline'; value: string; excerpt: string; isExplicitUpdate: boolean; oldValue: string | null; ref: EvidenceRef; sourceTitle: string; kind: DocumentKind; publishedAt: string | null; }
export interface Conflict { id: string; subject: string; status: 'resolved_update' | 'unresolved'; explanation: string; applicable: Claim[]; competing: Claim[]; }
export interface HistoryEntry { versionId: string; capturedAt: string; publishedAt: string | null; hash: string; extractionRevisionId: string; outcome: Outcome; isCurrent: boolean; observationCount: number; }
export interface DocumentDetail { document: Material; content: string; passages: Passage[]; history: HistoryEntry[]; conflicts: Conflict[]; original: { url: string; mime: string; name: string; size: number }; }
export interface SearchRequest { courseId: string; query?: string; sourceType?: string; folder?: string; from?: string; to?: string; versionId?: string; view?: 'all' | 'updates' | 'issues'; limit?: number; }
export interface SearchResponse { items: Material[]; counts: { all: number; updates: number; issues: number }; retrievalMode: 'lexical' | 'hybrid'; semanticStatus: string; }
export interface ExtractionResult { text: string; outcome: Outcome; limitations: string[]; segments: Array<{text: string; location: string}>; adapter: string; }
export interface ImportInput { courseId: string; title: string; sourceUrl?: string; sourceType?: SourceType; kind?: DocumentKind; folder?: string; tags?: string[]; publishedAt?: string; content?: string; format?: 'text' | 'html'; documentId?: string; isDemo?: boolean; }
export interface ImportResult { document: Material; disposition: 'new_document' | 'new_version' | 'unchanged'; }
export interface Capability { available: boolean; detail: string; model?: string; }
export interface Capabilities { generation: Capability; embeddings: Capability; ocr: Capability; transcription: Capability; jev: Capability; }
export interface ReadLibrary { listCourses(): Course[]; search(request: SearchRequest): Promise<SearchResponse>; getDocument(courseId: string, documentId: string, versionId?: string, extractionRevisionId?: string): DocumentDetail; fetchPassages(courseId: string, refs: EvidenceRef[]): Passage[]; getHistory(courseId: string, documentId: string): HistoryEntry[]; getConflicts(courseId: string, documentId?: string): Conflict[]; readOriginal(courseId: string, documentId: string, versionId: string): { bytes: Buffer; mime: string; name: string }; close(): void; }
