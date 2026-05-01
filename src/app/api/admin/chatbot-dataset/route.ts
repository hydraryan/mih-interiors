import { NextRequest, NextResponse } from 'next/server'
import {
  generateSyntheticEvalDataset,
  generateSyntheticTrainDataset,
  toJsonl,
} from '@/lib/chatbot/syntheticDataset'

type DatasetSplit = 'train' | 'eval'
type DatasetFormat = 'json' | 'jsonl'

const parseSplit = (value: string | null): DatasetSplit => (value === 'eval' ? 'eval' : 'train')
const parseFormat = (value: string | null): DatasetFormat => (value === 'jsonl' ? 'jsonl' : 'json')

export async function GET(req: NextRequest) {
  const split = parseSplit(req.nextUrl.searchParams.get('split'))
  const format = parseFormat(req.nextUrl.searchParams.get('format'))

  const examples = split === 'eval' ? generateSyntheticEvalDataset() : generateSyntheticTrainDataset()

  if (format === 'jsonl') {
    const data = toJsonl(examples)
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Content-Disposition': `inline; filename="mih-chatbot-${split}.jsonl"`,
      },
    })
  }

  return NextResponse.json({
    success: true,
    split,
    count: examples.length,
    generatedAt: new Date().toISOString(),
    examples,
  })
}
