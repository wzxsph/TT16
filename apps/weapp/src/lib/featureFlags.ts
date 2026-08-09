export const ADS_ENABLED = false
export const AD_PLACEMENTS = ['atlas_mid', 'type_detail_end', 'compare_end', 'tool_end'] as const
export type AdPlacement = (typeof AD_PLACEMENTS)[number]
