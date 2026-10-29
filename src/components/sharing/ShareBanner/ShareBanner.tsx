import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Download, Share2 } from 'lucide-react';
import styled from 'styled-components';
import { Button, Select, useToast } from '../../common';
import { Panel, SectionTitle } from '../../layout/Page/Page';
import {
  bannerAltText,
  bannerFormats,
  bannerHeadline,
  bannerTemplates,
  canvasToBlob,
  drawBanner,
  loadBannerFonts,
  type BannerData,
  type BannerPlan,
  type BannerFormat,
  type BannerTemplate,
} from '../../../utils/banner';
import { downloadBlob } from '../../../utils/download';
import { formatNumber } from '../../../utils/numbers';

const Formats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;

  button {
    padding: 6px 12px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    background: var(--surface);
    font-weight: 600;
  }
  button[aria-pressed='true'] {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--on-primary);
  }
  small {
    display: block;
    font-weight: 400;
  }
`;

const Preview = styled.canvas`
  display: block;
  width: 100%;
  max-height: 480px;
  object-fit: contain;
  margin-bottom: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
`;

const Actions = styled.div`
  display: grid;
  gap: 8px;
`;

interface Props {
  charges: number;
  title: string;
  commitmentId: string;
  description: string;
  plan?: BannerPlan;
}

/** Gera, no navegador, um banner PNG pronto para redes sociais com a contagem de cobranças vinda da API. */
export function ShareBanner({ charges, title, commitmentId, description, plan }: Props) {
  const toast = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<BannerFormat>('square');
  const [template, setTemplate] = useState<BannerTemplate>('classic');
  const [busy, setBusy] = useState(false);

  const planPage = plan?.page;
  const link = `${window.location.origin}/compromissos/${encodeURIComponent(commitmentId)}`;
  const data = useMemo<BannerData>(
    () => ({
      charges,
      title,
      commitmentId,
      description,
      plan: planPage === undefined ? undefined : { page: planPage },
      url: link.replace(/^https?:\/\//, ''),
    }),
    [charges, title, commitmentId, description, planPage, link],
  );
  const alt = bannerAltText(data);
  const message = `${bannerHeadline(charges)} ${formatNumber(charges)} ${charges === 1 ? 'pessoa cobra' : 'pessoas cobram'} o governo: “${title}”. Cobre também: ${link}`;

  useEffect(() => {
    let cancelled = false;
    loadBannerFonts().then(() => {
      if (!cancelled && canvasRef.current) drawBanner(canvasRef.current, format, data, template);
    });
    return () => {
      cancelled = true;
    };
  }, [format, template, data]);

  const makeFile = async () => {
    const blob = await canvasToBlob(canvasRef.current!);
    return new File([blob], `cobranca-${commitmentId}-${format}-${template}.png`, {
      type: 'image/png',
    });
  };

  const download = async () => {
    setBusy(true);
    try {
      const file = await makeFile();
      downloadBlob(file.name, file);
    } catch {
      toast.error('Não foi possível gerar a imagem.');
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    setBusy(true);
    try {
      const file = await makeFile();
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: message });
      } else if (navigator.share) {
        await navigator.share({ text: message, url: link });
      } else {
        downloadBlob(file.name, file);
        toast.info('Seu navegador não compartilha direto. A imagem foi baixada.');
      }
    } catch (err) {
      if ((err as DOMException).name !== 'AbortError')
        toast.error('Não foi possível compartilhar.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success('Texto copiado.');
    } catch {
      toast.error('Não foi possível copiar o texto.');
    }
  };

  return (
    <Panel style={{ marginBottom: 16 }}>
      <SectionTitle as="h2">Divulgue esta cobrança</SectionTitle>
      <p style={{ marginTop: 0 }}>
        Este compromisso já tem {formatNumber(charges)} cobranças. Baixe um banner e ajude a
        pressionar o governo a entregar o que prometeu.
      </p>
      <Formats role="group" aria-label="Formato do banner">
        {(Object.keys(bannerFormats) as BannerFormat[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={format === key}
            onClick={() => setFormat(key)}
          >
            {bannerFormats[key].label}
            <small>{bannerFormats[key].hint}</small>
          </button>
        ))}
      </Formats>
      <div style={{ marginBottom: 12 }}>
        <Select
          id="banner-template"
          label="Modelo do banner"
          value={template}
          onChange={(e) => setTemplate(e.target.value as BannerTemplate)}
          options={(Object.keys(bannerTemplates) as BannerTemplate[]).map((key) => ({
            value: key,
            label: bannerTemplates[key].label,
          }))}
        />
      </div>
      <Preview ref={canvasRef} role="img" aria-label={alt} />
      <Actions>
        <Button onClick={download} loading={busy} fullWidth>
          <Download size={16} aria-hidden="true" /> Baixar imagem
        </Button>
        <Button variant="secondary" onClick={share} disabled={busy} fullWidth>
          <Share2 size={16} aria-hidden="true" /> Compartilhar
        </Button>
        <Button variant="secondary" onClick={copy} fullWidth>
          <Copy size={16} aria-hidden="true" /> Copiar texto com link
        </Button>
      </Actions>
    </Panel>
  );
}
