import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import {
  Alert,
  Button,
  Checkbox,
  FormError,
  Input,
  Select,
  Textarea,
} from '../../components/common';
import type { Catalog } from '../../services/types';
import { emptySource, type CommitmentFormState, type FormErrors } from './commitmentForm';
import { Fieldset, SourceCard, TwoColumns } from './CommitmentFields.styles';

interface Props {
  form: CommitmentFormState;
  setForm: (update: (current: CommitmentFormState) => CommitmentFormState) => void;
  catalog: Catalog;
  errors: FormErrors;
}
/** Campos de conteúdo de um compromisso, compartilhados pela edição e pela criação. */
export function CommitmentFields({ form, setForm, catalog, errors }: Props) {
  function set<K extends keyof CommitmentFormState>(key: K, value: CommitmentFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setSource(index: number, changes: Partial<CommitmentFormState['sources'][number]>) {
    setForm((current) => ({
      ...current,
      sources: current.sources.map((s, i) => (i === index ? { ...s, ...changes } : s)),
    }));
  }

  function moveSource(index: number, offset: -1 | 1) {
    setForm((current) => {
      const sources = [...current.sources];
      const target = index + offset;
      if (target < 0 || target >= sources.length) return current;
      [sources[index], sources[target]] = [sources[target], sources[index]];
      return { ...current, sources };
    });
  }

  return (
    <>
      <Fieldset>
        <legend>Identificação</legend>
        <TwoColumns>
          <Select
            id="ed-area"
            label="Área"
            options={catalog.areas.map((a) => ({ value: a.code, label: a.name }))}
            value={form.areaCode}
            onChange={(v) => set('areaCode', v)}
          />
          <Select
            id="ed-origem"
            label="Origem"
            options={catalog.origins.map((o) => ({ value: o.code, label: o.name }))}
            value={form.originCode}
            onChange={(v) => set('originCode', v)}
          />
        </TwoColumns>
        <Input
          id="ed-titulo"
          label="Título"
          maxLength={300}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
        />
        <Textarea
          id="ed-resumo"
          label="Resumo (opcional)"
          value={form.shortDescription}
          onChange={(e) => set('shortDescription', e.target.value)}
        />
        <Textarea
          id="ed-descricao"
          label="Descrição"
          rows={5}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          error={errors.description}
        />
        <Textarea
          id="ed-como"
          label="Como será feito (opcional)"
          value={form.howItWillBeDone}
          onChange={(e) => set('howItWillBeDone', e.target.value)}
        />
      </Fieldset>

      <Fieldset>
        <legend>Prazo e meta</legend>
        <Alert tone="info">
          <p>
            O <strong>prazo estruturado</strong> é a data que vale para a regra “nunca Descumprido
            antes do prazo”. O texto do prazo é só o que aparece para o público. Deixe o prazo
            estruturado vazio se o compromisso não tem data definida.
          </p>
        </Alert>
        <TwoColumns>
          <Input
            id="ed-prazo-data"
            label="Prazo estruturado"
            type="date"
            value={form.deadlineDate}
            onChange={(e) => set('deadlineDate', e.target.value)}
          />
          <Input
            id="ed-prazo-texto"
            label="Texto do prazo"
            maxLength={300}
            hint="Ex.: Até o fim de 2027. Deixe vazio se não há prazo."
            value={form.deadlineText}
            onChange={(e) => set('deadlineText', e.target.value)}
          />
        </TwoColumns>
        <Textarea
          id="ed-meta"
          label="Meta ou condição (opcional)"
          value={form.goalOrCondition}
          onChange={(e) => set('goalOrCondition', e.target.value)}
        />
        <TwoColumns>
          <Input
            id="ed-data"
            label="Data da promessa (opcional)"
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
          <Input
            id="ed-data-tipo"
            label="Tipo da data (opcional)"
            maxLength={100}
            value={form.dateKind}
            onChange={(e) => set('dateKind', e.target.value)}
          />
        </TwoColumns>
      </Fieldset>

      <Fieldset>
        <legend>Plano de governo e classificação</legend>
        <TwoColumns>
          <Input
            id="ed-pagina"
            label="Página no plano (opcional)"
            maxLength={50}
            value={form.planPage}
            onChange={(e) => set('planPage', e.target.value)}
          />
          <Checkbox
            id="ed-detalhe"
            label="O plano detalha o compromisso"
            checked={form.hasPlanDetail}
            onChange={(e) => set('hasPlanDetail', e.target.checked)}
          />
        </TwoColumns>
        <Textarea
          id="ed-classificacao"
          label="Classificação (uma por linha)"
          value={form.classification}
          onChange={(e) => set('classification', e.target.value)}
        />
        <Textarea
          id="ed-evidencia"
          label="Evidências (uma por linha)"
          value={form.evidence}
          onChange={(e) => set('evidence', e.target.value)}
        />
      </Fieldset>

      <Fieldset>
        <legend>Fontes</legend>
        <FormError message={errors.sources} />
        {form.sources.map((source, index) => (
          <SourceCard key={index} role="group" aria-label={`Fonte ${index + 1}`}>
            <TwoColumns>
              <Input
                id={`fonte-nome-${index}`}
                label="Nome"
                value={source.name}
                onChange={(e) => setSource(index, { name: e.target.value })}
              />
              <Select
                id={`fonte-tipo-${index}`}
                label="Tipo"
                options={[
                  { value: 'primary', label: 'Primária (documento oficial)' },
                  { value: 'press', label: 'Imprensa' },
                ]}
                value={source.kind}
                onChange={(v) => setSource(index, { kind: v as 'primary' | 'press' })}
              />
            </TwoColumns>
            <Input
              id={`fonte-url-${index}`}
              label="URL"
              type="url"
              value={source.url}
              onChange={(e) => setSource(index, { url: e.target.value })}
            />
            <Input
              id={`fonte-pagina-${index}`}
              label="Página (opcional)"
              value={source.page}
              onChange={(e) => setSource(index, { page: e.target.value })}
            />
            <div className="actions">
              <Button
                variant="ghost"
                size="sm"
                disabled={index === 0}
                onClick={() => moveSource(index, -1)}
                aria-label={`Subir fonte ${index + 1}`}
              >
                <ArrowUp size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={index === form.sources.length - 1}
                onClick={() => moveSource(index, 1)}
                aria-label={`Descer fonte ${index + 1}`}
              >
                <ArrowDown size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  set(
                    'sources',
                    form.sources.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 size={16} aria-hidden="true" />
                Remover fonte {index + 1}
              </Button>
            </div>
          </SourceCard>
        ))}
        <p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => set('sources', [...form.sources, emptySource()])}
          >
            <Plus size={16} aria-hidden="true" />
            Adicionar fonte
          </Button>
        </p>
      </Fieldset>
    </>
  );
}
