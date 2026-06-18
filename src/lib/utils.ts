import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BodyMetrics, BMIResult } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function generateRefNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const part1 = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `GYM-${part1}-${part2}`
}

export function calculateBMI(metrics: BodyMetrics): BMIResult {
  const heightM = metrics.heightCm / 100
  const bmi = metrics.weightKg / (heightM * heightM)
  const roundedBMI = Math.round(bmi * 10) / 10

  // Ideal weight using BMI 18.5–24.9 range
  const idealWeightMin = Math.round(18.5 * heightM * heightM * 10) / 10
  const idealWeightMax = Math.round(24.9 * heightM * heightM * 10) / 10
  const idealWeightMid = Math.round(((idealWeightMin + idealWeightMax) / 2) * 10) / 10
  const difference = Math.round((metrics.weightKg - idealWeightMid) * 10) / 10

  let category = ''
  let status: BMIResult['status'] = 'normal'
  let recommendation = ''

  if (bmi < 18.5) {
    category = 'Berat Badan Kurang'
    status = 'underweight'
    recommendation = `Anda perlu menaikkan berat badan sekitar ${Math.abs(difference)} kg untuk mencapai berat ideal. Fokus pada latihan strength training dan konsumsi protein yang cukup.`
  } else if (bmi < 25) {
    category = 'Berat Badan Normal'
    status = 'normal'
    recommendation = 'Berat badan Anda sudah ideal! Pertahankan dengan kombinasi latihan kardio dan kekuatan, serta pola makan seimbang.'
  } else if (bmi < 30) {
    category = 'Berat Badan Berlebih'
    status = 'overweight'
    recommendation = `Anda perlu menurunkan sekitar ${Math.abs(difference)} kg untuk mencapai berat ideal. Kombinasikan kardio dan strength training, serta perhatikan pola makan.`
  } else {
    category = 'Obesitas'
    status = 'obese'
    recommendation = `Anda perlu menurunkan sekitar ${Math.abs(difference)} kg. Sangat disarankan berkonsultasi dengan personal trainer dan ahli gizi kami untuk program yang tepat.`
  }

  return {
    bmi: roundedBMI,
    category,
    idealWeightMin,
    idealWeightMax,
    difference,
    status,
    recommendation,
  }
}
