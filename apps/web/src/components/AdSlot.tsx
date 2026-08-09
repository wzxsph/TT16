export type AdPlacement = 'atlas_mid' | 'type_detail_end' | 'compare_end' | 'tool_end'

const ADS_ENABLED = import.meta.env.TT16_ADS_ENABLED === 'true'

export function AdSlot({ placement }: { placement: AdPlacement }) {
  if (!ADS_ENABLED) {
    return <div data-ad-slot={placement} data-ad-enabled="false" hidden />
  }

  return (
    <aside className="ad-slot" data-ad-slot={placement} data-ad-enabled="true" aria-label="广告">
      <small>广告</small>
      <div data-ad-provider-slot={placement} />
    </aside>
  )
}
