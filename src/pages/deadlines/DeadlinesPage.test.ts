import type { CommitmentSummary } from '../../services/types';
import { groupByDeadlineYear } from './DeadlinesPage';

const item = (id: string, deadlineText: string | null): CommitmentSummary =>
  ({ id, deadlineText }) as CommitmentSummary;

describe('groupByDeadlineYear', () => {
  it('agrupa pelo primeiro ano citado e ordena cronologicamente, com "sem ano" por último', () => {
    const groups = groupByDeadlineYear([
      item('A', '"em 2030"'),
      item('B', '"até 2027"'),
      item('C', '"no próximo período"'),
      item('D', '"2027 e 2030"'),
      item('E', '"2035"'),
    ]);

    expect(groups.map(([year, list]) => [year, list.map((i) => i.id)])).toEqual([
      [2027, ['B', 'D']],
      [2030, ['A']],
      [2035, ['E']],
      [0, ['C']],
    ]);
  });
});
