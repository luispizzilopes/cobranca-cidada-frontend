export type StatusValue =
  | 'NotEvaluated'
  | 'NoEvidenceFound'
  | 'InPreparation'
  | 'InProgress'
  | 'PartiallyFulfilled'
  | 'Fulfilled'
  | 'Unfulfilled'
  | 'ChangedOrReplaced'
  | 'ImpairedOrConditioned';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'purple' | 'orange';

/** Cor de cada situação. A cor nunca é o único sinal: o rótulo em texto sempre acompanha. */
export const statusTone: Record<StatusValue, Tone> = {
  NotEvaluated: 'neutral',
  NoEvidenceFound: 'neutral',
  InPreparation: 'info',
  InProgress: 'info',
  PartiallyFulfilled: 'warning',
  Fulfilled: 'success',
  Unfulfilled: 'danger',
  ChangedOrReplaced: 'purple',
  ImpairedOrConditioned: 'orange',
};

export function toneOf(status: string): Tone {
  return statusTone[status as StatusValue] ?? 'neutral';
}
