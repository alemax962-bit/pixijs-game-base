import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import type { CostEstimate } from './costs.ts';
import { formatCostReport } from './costs.ts';

export interface ApprovalRequest {
  estimate: CostEstimate;
  purpose: string;
  /** When true (e.g. CI), never auto-approve — require explicit --yes after human review. */
  forceYes?: boolean;
}

/**
 * ALWAYS call this before any paid Replicate prediction.
 * Agents must present the printed report to the user and wait for approval.
 */
export async function requestRunApproval(req: ApprovalRequest): Promise<boolean> {
  const report = formatCostReport(req.estimate, req.purpose);
  console.log(report);

  if (req.forceYes) {
    console.log('Approved via --yes flag (user already confirmed cost).');
    return true;
  }

  if (!process.stdin.isTTY) {
    console.error(
      '\nNon-interactive shell: re-run with --yes ONLY after the user explicitly approved the cost above.',
    );
    return false;
  }

  const rl = readline.createInterface({ input, output });
  try {
    const answer = await rl.question(
      `Type "yes" to spend ~$${req.estimate.approxUsdTotal.toFixed(4)} USD, or anything else to cancel: `,
    );
    return answer.trim().toLowerCase() === 'yes';
  } finally {
    rl.close();
  }
}
