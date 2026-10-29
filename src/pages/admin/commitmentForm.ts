import type {
  AdminCommitmentDetail,
  CommitmentSource,
  CreateCommitmentPayload,
  UpdateCommitmentPayload,
} from '../../services/types';

export interface SourceFormState {
  name: string;
  url: string;
  page: string;
  kind: CommitmentSource['kind'];
}

/** Estado do formulário de edição: tudo texto, como nos campos. Listas viram uma linha por item. */
export interface CommitmentFormState {
  areaCode: string;
  originCode: string;
  title: string;
  shortDescription: string;
  description: string;
  howItWillBeDone: string;
  hasPlanDetail: boolean;
  date: string;
  dateKind: string;
  deadlineText: string;
  deadlineDate: string;
  goalOrCondition: string;
  planPage: string;
  classification: string;
  evidence: string;
  sources: SourceFormState[];
}

export const emptySource = (): SourceFormState => ({
  name: '',
  url: '',
  page: '',
  kind: 'primary',
});

export function toFormState(detail: AdminCommitmentDetail): CommitmentFormState {
  return {
    areaCode: detail.area.code,
    originCode: detail.origin.code,
    title: detail.title,
    shortDescription: detail.shortDescription ?? '',
    description: detail.description,
    howItWillBeDone: detail.howItWillBeDone ?? '',
    hasPlanDetail: detail.hasPlanDetail,
    date: detail.date ?? '',
    dateKind: detail.dateKind ?? '',
    deadlineText: detail.deadlineText ?? '',
    deadlineDate: detail.deadlineDate ?? '',
    goalOrCondition: detail.goalOrCondition ?? '',
    planPage: detail.planPage ?? '',
    classification: detail.classification.join('\n'),
    evidence: detail.evidence.join('\n'),
    sources: detail.sources.map((s) => ({
      name: s.name,
      url: s.url,
      page: s.page ?? '',
      kind: s.kind,
    })),
  };
}

const orNull = (value: string): string | null => (value.trim() === '' ? null : value.trim());

export function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

export function emptyFormState(areaCode: string, originCode: string): CommitmentFormState {
  return {
    areaCode,
    originCode,
    title: '',
    shortDescription: '',
    description: '',
    howItWillBeDone: '',
    hasPlanDetail: false,
    date: '',
    dateKind: '',
    deadlineText: '',
    deadlineDate: '',
    goalOrCondition: '',
    planPage: '',
    classification: '',
    evidence: '',
    sources: [emptySource()],
  };
}

/** Corpo comum à edição e à criação (a edição acrescenta versão e motivo). */
function contentOf(form: CommitmentFormState) {
  return {
    areaCode: form.areaCode,
    originCode: form.originCode,
    title: form.title.trim(),
    description: form.description.trim(),
    shortDescription: orNull(form.shortDescription),
    howItWillBeDone: orNull(form.howItWillBeDone),
    hasPlanDetail: form.hasPlanDetail,
    date: orNull(form.date),
    dateKind: orNull(form.dateKind),
    deadlineText: orNull(form.deadlineText),
    deadlineDate: orNull(form.deadlineDate),
    goalOrCondition: orNull(form.goalOrCondition),
    classification: splitLines(form.classification),
    evidence: splitLines(form.evidence),
    planPage: orNull(form.planPage),
    sources: form.sources.map((s) => ({
      name: s.name.trim(),
      url: s.url.trim(),
      page: orNull(s.page),
      kind: s.kind,
    })),
  };
}

export function toCreatePayload(
  form: CommitmentFormState,
  slug: string,
  publish: boolean,
): CreateCommitmentPayload {
  return { ...contentOf(form), slug: orNull(slug), publish };
}

export function toPayload(
  form: CommitmentFormState,
  expectedVersion: number,
  reason: string,
): UpdateCommitmentPayload {
  return { ...contentOf(form), expectedVersion, reason: reason.trim() };
}

export interface FormErrors {
  title?: string;
  description?: string;
  reason?: string;
  sources?: string;
}

/** Conferências básicas antes de enviar. As regras de verdade são da API; aqui só evitamos idas e voltas óbvias. */
/** `reason` é nulo na criação, que não pede motivo. */
export function validateForm(form: CommitmentFormState, reason: string | null): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'O título é obrigatório.';
  if (!form.description.trim()) errors.description = 'A descrição é obrigatória.';
  if (reason !== null && !reason.trim())
    errors.reason = 'Explique o motivo da edição: ele fica no histórico de revisões.';
  if (form.sources.length === 0) errors.sources = 'Todo compromisso precisa de ao menos uma fonte.';
  else if (form.sources.some((s) => !s.name.trim() || !/^https?:\/\/\S+$/i.test(s.url.trim())))
    errors.sources = 'Toda fonte precisa de nome e de uma URL http ou https válida.';
  return errors;
}

/** Verdadeiro se alguma coisa mudou em relação ao compromisso carregado. */
export function isDirty(form: CommitmentFormState, detail: AdminCommitmentDetail): boolean {
  return JSON.stringify(form) !== JSON.stringify(toFormState(detail));
}
