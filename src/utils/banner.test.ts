import { bannerHeadline, chargesPhrase, pickBannerDescription, wrapText } from './banner';

const measure = (t: string) => t.length * 10;

describe('wrapText', () => {
  it('quebra por palavras dentro da largura', () => {
    expect(wrapText(measure, 'aaa bbb ccc ddd', 70, 5)).toEqual(['aaa bbb', 'ccc ddd']);
  });

  it('corta com reticências ao passar do máximo de linhas', () => {
    const lines = wrapText(measure, 'aaa bbb ccc ddd eee', 70, 2);
    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith('…')).toBe(true);
    expect(measure(lines[1])).toBeLessThanOrEqual(70);
  });

  it('devolve vazio para texto vazio', () => {
    expect(wrapText(measure, '   ', 70, 3)).toEqual([]);
  });
});

describe('chargesPhrase', () => {
  it('concorda no singular e no plural', () => {
    expect(chargesPhrase(1)).toBe('pessoa cobra');
    expect(chargesPhrase(12)).toBe('pessoas cobram');
  });
});

describe('pickBannerDescription', () => {
  const title =
    'Apoiar estados e municípios no cumprimento de 45% de compras da agricultura familiar';
  const full =
    'Compromisso de apoiar estados e municípios a cumprirem as metas da alimentação escolar. Como o plano prevê fazer: Com apoio técnico (p.59).';

  it('ignora o resumo quando ele repete o título e usa a descrição sem o "como o plano prevê fazer"', () => {
    expect(pickBannerDescription(title, title, full)).toBe(
      'Compromisso de apoiar estados e municípios a cumprirem as metas da alimentação escolar.',
    );
  });

  it('usa o resumo quando ele traz algo além do título', () => {
    expect(pickBannerDescription(title, 'Eleva o teto do MEI.', full)).toBe('Eleva o teto do MEI.');
  });

  it('devolve vazio quando não há nada além do título', () => {
    expect(pickBannerDescription(title, null, title)).toBe('');
  });
});

describe('bannerHeadline', () => {
  it('muda a cada ordem de grandeza e para na última faixa', () => {
    const faixas = [10, 99, 100, 999, 1000, 10000, 100000, 5000000].map(bannerHeadline);
    expect(faixas[0]).toBe(faixas[1]);
    expect(faixas[2]).toBe(faixas[3]);
    expect(new Set(faixas.slice(0, 7)).size).toBe(5);
    expect(faixas[6]).toBe(faixas[7]);
  });
});
