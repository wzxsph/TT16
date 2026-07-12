export type PaymentMode = 'mock' | 'disabled' | 'wechat' | 'alipay'

export type PaymentConfigurationState =
  | 'sandbox'
  | 'disabled'
  | 'adapter_required'
  | 'unsafe_mock_production'

export type PaymentConfiguration = {
  commerceReady: boolean
  configurationValid: boolean
  state: PaymentConfigurationState
}

export function evaluatePaymentConfiguration(
  appEnvironment: string,
  paymentMode: PaymentMode,
): PaymentConfiguration {
  if (paymentMode === 'disabled') {
    return { commerceReady: false, configurationValid: true, state: 'disabled' }
  }
  if (paymentMode === 'mock') {
    return appEnvironment === 'production'
      ? { commerceReady: false, configurationValid: false, state: 'unsafe_mock_production' }
      : { commerceReady: true, configurationValid: true, state: 'sandbox' }
  }
  return { commerceReady: false, configurationValid: false, state: 'adapter_required' }
}
