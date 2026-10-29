/** Contratos da API (JSON em camelCase). */

export interface PaginedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface Lookup {
  code: string;
  name: string;
}

export interface StatusInfo {
  value: string;
  label: string;
}

export interface VoteSummary {
  charges: number | null;
  chargesHidden: boolean;
  good: number | null;
  bad: number | null;
  ratingsHidden: boolean;
}

export type Rating = 'boa' | 'ma' | null;

export interface MyVote {
  rating: Rating;
  charge: boolean;
}

export interface CommitmentSummary {
  id: string;
  title: string;
  shortDescription: string | null;
  area: Lookup;
  origin: Lookup;
  status: StatusInfo;
  statusDate: string | null;
  date: string | null;
  dateKind: string | null;
  deadlineText: string | null;
  goalOrCondition: string | null;
  classification: string[];
  evidence: string[];
  planPage: string | null;
  hasPlanDetail: boolean;
  votes: VoteSummary;
  myVote: MyVote | null;
}

export interface CommitmentSource {
  name: string;
  url: string;
  page: string | null;
  kind: 'primary' | 'press';
}

export interface StatusEntry {
  status: StatusInfo;
  referenceDate: string;
  sourceUrl: string | null;
  note: string | null;
  recordedAtUtc: string;
}

export interface CommitmentDetail extends Omit<CommitmentSummary, 'shortDescription'> {
  externalId: string | null;
  description: string;
  shortDescription: string | null;
  howItWillBeDone: string | null;
  deadlineDate: string | null;
  sources: CommitmentSource[];
  statusHistory: StatusEntry[];
  version: number;
  updatedAtUtc: string;
}

export interface Catalog {
  areas: Lookup[];
  origins: Lookup[];
  statuses: StatusInfo[];
  voting: { minimumPublicVotes: number; disclaimer: string };
}

export interface VoteState {
  commitmentId: string;
  myVote: MyVote | null;
  votes: VoteSummary;
}

export interface MyVoteItem {
  commitmentId: string;
  title: string;
  rating: Rating;
  charge: boolean;
  updatedAtUtc: string;
}

export interface Profile {
  userId: string;
  email: string | null;
  name: string;
  roles: string[];
  consentVersion: string | null;
  consentAcceptedAtUtc: string | null;
  /** Falso para quem criou a conta pelo Google e nunca definiu uma senha. */
  hasPassword: boolean;
  googleLinked: boolean;
}

/** Painel de administração. */

export interface AdminCommitmentSummary {
  id: string;
  title: string;
  area: Lookup;
  origin: Lookup;
  status: StatusInfo;
  statusDate: string | null;
  deadlineText: string | null;
  deadlineDate: string | null;
  isPublished: boolean;
  version: number;
  updatedAtUtc: string;
}

export interface AdminStatusEntry {
  status: StatusInfo;
  referenceDate: string;
  sourceUrl: string | null;
  note: string | null;
  isFormalAct: boolean;
  author: string;
  recordedAtUtc: string;
}

export interface Revision {
  version: number;
  reason: string;
  author: string;
  createdAtUtc: string;
}

export interface AdminCommitmentDetail {
  id: string;
  externalId: string | null;
  title: string;
  description: string;
  shortDescription: string | null;
  howItWillBeDone: string | null;
  hasPlanDetail: boolean;
  area: Lookup;
  origin: Lookup;
  date: string | null;
  dateKind: string | null;
  deadlineText: string | null;
  deadlineDate: string | null;
  goalOrCondition: string | null;
  classification: string[];
  evidence: string[];
  planPage: string | null;
  sources: CommitmentSource[];
  status: StatusInfo;
  statusDate: string | null;
  statusHistory: AdminStatusEntry[];
  revisions: Revision[];
  isPublished: boolean;
  publishedAtUtc: string | null;
  version: number;
  updatedAtUtc: string;
}

export interface UpdateCommitmentPayload {
  expectedVersion: number;
  reason: string;
  areaCode: string;
  originCode: string;
  title: string;
  description: string;
  shortDescription: string | null;
  howItWillBeDone: string | null;
  hasPlanDetail: boolean;
  date: string | null;
  dateKind: string | null;
  deadlineText: string | null;
  deadlineDate: string | null;
  goalOrCondition: string | null;
  classification: string[];
  evidence: string[];
  planPage: string | null;
  sources: CommitmentSource[];
}

export interface RegisterStatusPayload {
  status: string;
  referenceDate: string;
  sourceUrl: string | null;
  note: string | null;
  isFormalAct: boolean;
}

export interface CreateCommitmentPayload extends Omit<
  UpdateCommitmentPayload,
  'expectedVersion' | 'reason'
> {
  /** Identificador público (ex.: ECON-050). Nulo gera o próximo da área. */
  slug: string | null;
  publish: boolean;
}

/** Comentário raiz em destaque na tela inicial, com o compromisso ao qual pertence. */
export interface RecentComment {
  id: string;
  text: string;
  createdAtUtc: string;
  commitmentId: string;
  commitmentTitle: string;
}

export interface CommitmentComment {
  id: string;
  text: string;
  createdAtUtc: string;
  isMine: boolean;
  parentId: string | null;
  /** Só nos comentários raiz; as respostas ficam em um único nível. */
  replies: CommitmentComment[];
}
