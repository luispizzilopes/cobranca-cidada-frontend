import type { AdminCommitmentDetail } from '../../services/types';
import {
  emptyFormState,
  emptySource,
  isDirty,
  splitLines,
  toCreatePayload,
  toFormState,
  toPayload,
  validateForm,
} from './commitmentForm';

const detail: AdminCommitmentDetail = {
  id: 'ECON-006',
  externalId: 'LULA26-ECON-006',
  title: 'Isentar quem ganha até R$ 5 mil',
  description: 'Ampliar a faixa de isenção do imposto de renda.',
  shortDescription: null,
  howItWillBeDone: null,
  hasPlanDetail: true,
  area: { code: 'ECON', name: 'Economia' },
  origin: { code: 'plano-de-governo', name: 'Plano de governo' },
  date: null,
  dateKind: null,
  deadlineText: 'Até 2027',
  deadlineDate: '2027-12-31',
  goalOrCondition: null,
  classification: ['tributário', 'renda'],
  evidence: ['Plano, p. 12'],
  planPage: '12',
  sources: [
    { name: 'Plano', url: 'https://example.gov.br/plano.pdf', page: '12', kind: 'primary' },
  ],
  status: { value: 'NotEvaluated', label: 'Não avaliado' },
  statusDate: null,
  statusHistory: [],
  revisions: [],
  isPublished: true,
  publishedAtUtc: null,
  version: 3,
  updatedAtUtc: '2027-01-01T00:00:00Z',
};

describe('formulário de edição de compromisso', () => {
  it('converte o compromisso em estado de formulário e volta, sem perder nada', () => {
    const form = toFormState(detail);
    expect(form.classification).toBe('tributário\nrenda');

    const payload = toPayload(form, detail.version, 'Revisão');
    expect(payload).toMatchObject({
      expectedVersion: 3,
      reason: 'Revisão',
      areaCode: 'ECON',
      originCode: 'plano-de-governo',
      deadlineDate: '2027-12-31',
      deadlineText: 'Até 2027',
      classification: ['tributário', 'renda'],
      evidence: ['Plano, p. 12'],
      shortDescription: null,
      sources: detail.sources,
    });
  });

  it('campos vazios viram nulo e espaços são aparados', () => {
    const form = {
      ...toFormState(detail),
      title: '  Novo título  ',
      deadlineDate: '',
      deadlineText: '   ',
      planPage: '',
      classification: ' a \n\n  \n b ',
    };
    const payload = toPayload(form, 3, '  motivo  ');

    expect(payload.title).toBe('Novo título');
    expect(payload.reason).toBe('motivo');
    expect(payload.deadlineDate).toBeNull();
    expect(payload.deadlineText).toBeNull();
    expect(payload.planPage).toBeNull();
    expect(payload.classification).toEqual(['a', 'b']);
  });

  it('splitLines ignora linhas em branco', () => {
    expect(splitLines('\n a\n\n b \n')).toEqual(['a', 'b']);
    expect(splitLines('')).toEqual([]);
  });

  it('exige título, descrição, motivo e ao menos uma fonte válida', () => {
    const ok = toFormState(detail);
    expect(validateForm(ok, 'motivo')).toEqual({});

    expect(validateForm({ ...ok, title: ' ' }, 'motivo').title).toBeDefined();
    expect(validateForm({ ...ok, description: '' }, 'motivo').description).toBeDefined();
    expect(validateForm(ok, '  ').reason).toBeDefined();
    expect(validateForm({ ...ok, sources: [] }, 'motivo').sources).toBeDefined();
    expect(
      validateForm({ ...ok, sources: [{ ...emptySource(), name: 'X', url: 'ftp://x' }] }, 'motivo')
        .sources,
    ).toBeDefined();
    expect(
      validateForm(
        { ...ok, sources: [{ ...emptySource(), name: '', url: 'https://x.gov.br' }] },
        'motivo',
      ).sources,
    ).toBeDefined();
  });

  it('só considera alterado o que mudou em relação ao carregado', () => {
    const form = toFormState(detail);
    expect(isDirty(form, detail)).toBe(false);
    expect(isDirty({ ...form, deadlineDate: '2028-01-01' }, detail)).toBe(true);
    expect(isDirty({ ...form, sources: [...form.sources, emptySource()] }, detail)).toBe(true);
  });
});

describe('criação de compromisso', () => {
  it('formulário novo começa com área, origem e uma fonte em branco, e não pede motivo', () => {
    const form = emptyFormState('ECON', 'plano-de-governo');
    expect(form.sources).toHaveLength(1);
    expect(validateForm(form, null).reason).toBeUndefined();
    expect(validateForm(form, null).title).toBeDefined();
    expect(validateForm(form, '').reason).toBeDefined();
  });

  it('monta o corpo da criação com identificador opcional e publicação', () => {
    const form = { ...toFormState(detail), deadlineText: '' };
    const payload = toCreatePayload(form, '  ', false);
    expect(payload.slug).toBeNull();
    expect(payload.publish).toBe(false);
    expect(payload.deadlineText).toBeNull();
    expect(payload).not.toHaveProperty('expectedVersion');
    expect(payload).not.toHaveProperty('reason');

    expect(toCreatePayload(form, ' ECON-050 ', true)).toMatchObject({
      slug: 'ECON-050',
      publish: true,
    });
  });
});
