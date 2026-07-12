import { describe, expect, it } from 'vitest'
import { evaluatePaymentConfiguration } from './paymentPolicy'

describe('payment configuration safety gate', () => {
  it('allows mock commerce only outside production', () => {
    expect(evaluatePaymentConfiguration('local', 'mock')).toEqual({
      commerceReady: true,
      configurationValid: true,
      state: 'sandbox',
    })
    expect(evaluatePaymentConfiguration('production', 'mock')).toEqual({
      commerceReady: false,
      configurationValid: false,
      state: 'unsafe_mock_production',
    })
  })

  it('treats disabled production payment as safe but non-transactional', () => {
    expect(evaluatePaymentConfiguration('production', 'disabled')).toEqual({
      commerceReady: false,
      configurationValid: true,
      state: 'disabled',
    })
  })

  it.each(['wechat', 'alipay'] as const)('blocks %s until its adapter is configured', (mode) => {
    expect(evaluatePaymentConfiguration('production', mode)).toEqual({
      commerceReady: false,
      configurationValid: false,
      state: 'adapter_required',
    })
  })
})
