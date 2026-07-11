export type IllustrationGroup = 'RH' | 'RT' | 'SH' | 'ST'

type ClassNameProps = {
  className?: string
}

type GroupIllustrationProps = ClassNameProps & {
  group: IllustrationGroup
}

type GroupPalette = {
  primary: string
  deep: string
  mid: string
  pale: string
  accent: string
}

const paletteByGroup: Record<IllustrationGroup, GroupPalette> = {
  RH: {
    primary: '#725A9F',
    deep: '#493C69',
    mid: '#B8A5D2',
    pale: '#EEE9F7',
    accent: '#E7A15B',
  },
  RT: {
    primary: '#BD6756',
    deep: '#7D4238',
    mid: '#E2A391',
    pale: '#FAEAE4',
    accent: '#E7A84B',
  },
  SH: {
    primary: '#3D8877',
    deep: '#255B51',
    mid: '#8FC5B5',
    pale: '#E4F2ED',
    accent: '#EEB95B',
  },
  ST: {
    primary: '#C08A2F',
    deep: '#76531D',
    mid: '#E7C278',
    pale: '#FAEFCF',
    accent: '#D86E55',
  },
}

const responsiveStyle = {
  display: 'block',
  width: '100%',
  height: 'auto',
} as const

const paper = '#FFF9EC'
const paperShade = '#E8DDC9'
const ink = '#29383D'
const skin = '#D99A73'
const skinShade = '#B97157'

export function BrandMark({ size = 42 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flex: '0 0 auto' }}
    >
      <circle cx="28" cy="29.5" r="24" fill="#D9CDBA" opacity="0.55" />
      <circle cx="28" cy="27.5" r="24" fill={paper} stroke="#E6DCCA" />
      <path d="M27.7 7.2 28 26.8 11.4 18.9 17.1 11.5Z" fill="#725A9F" />
      <path d="m48.9 18.7-19.7 8.4 7.1-18 8.1 3.8Z" fill="#BD6756" />
      <path d="m17.4 46.1 10.3-17.4-19.4 6.1 2.5 8.4Z" fill="#3D8877" />
      <path d="M44.2 43.2 29.5 28.8 49.8 34l.3 6.5Z" fill="#C08A2F" />
      <path d="m28.2 20.6 7.5 7.3-7.6 7.6-7.7-7.4Z" fill={paper} stroke={ink} strokeWidth="1.6" />
      <circle cx="28.1" cy="28" r="2.6" fill={ink} />
    </svg>
  )
}

export function HeroIllustration({ className }: ClassNameProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox="0 0 720 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={responsiveStyle}
    >
      <path
        d="M63 385c-20-96 15-198 91-269C234 41 363 20 479 57c106 34 177 126 169 229-8 100-91 177-204 200-100 21-241 9-315-28-37-19-57-43-66-73Z"
        fill="#F1E8D8"
      />
      <path d="M108 348 258 118l111 231Z" fill="#E4D8C6" opacity="0.58" />
      <path d="m238 348 153-236 171 236Z" fill="#F8F1E6" opacity="0.9" />
      <circle cx="542" cy="116" r="47" fill="#F3C98F" opacity="0.72" />
      <path d="M36 438c91-45 191-59 295-41 102 18 206 16 354-24v97H36Z" fill="#D8CDBA" />
      <path d="M36 425c118-37 216-43 307-20 92 24 201 17 342-27v75H36Z" fill="#FFF9EC" />

      <g style={{ filter: 'drop-shadow(0 8px 9px rgba(41,56,61,.10))' }}>
        <path d="M102 121h116l17 18v101H102Z" fill={paper} stroke="#D7CBB9" strokeWidth="2" />
        <path d="M218 121v20h17" fill="#EADCC6" />
        <path d="M127 154h55M127 174h74M127 194h62" stroke="#725A9F" strokeWidth="8" strokeLinecap="round" opacity="0.72" />
        <path d="m188 213 16-14 12 8" stroke="#3D8877" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g style={{ filter: 'drop-shadow(0 8px 9px rgba(41,56,61,.10))' }}>
        <path d="m516 143 89-28 31 97-89 28Z" fill={paper} stroke="#D7CBB9" strokeWidth="2" />
        <path d="m543 196 16-26 18 8 16-31 19 10" stroke="#BD6756" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="558" cy="170" r="6" fill="#C08A2F" />
        <circle cx="593" cy="147" r="6" fill="#3D8877" />
      </g>

      <g>
        <path d="M105 378h76l-9 58h-57Z" fill="#BD6756" />
        <path d="M114 388h58l-6 39h-46Z" fill="#9D5043" opacity="0.58" />
        <path d="M141 375c-2-59 2-101 17-132" stroke="#3D8877" strokeWidth="8" strokeLinecap="round" />
        <path d="M148 304c-30-31-64-23-67 5 29 14 51 11 67-5Z" fill="#66A58F" />
        <path d="M151 280c20-39 56-45 70-17-18 28-41 33-70 17Z" fill="#3D8877" />
        <path d="M142 339c-24-24-50-16-55 8 21 14 40 11 55-8Z" fill="#90C3AF" />
        <path d="M151 254c-12-31 6-57 32-52 5 29-4 46-32 52Z" fill="#725A9F" />
      </g>

      <g style={{ filter: 'drop-shadow(0 12px 12px rgba(41,56,61,.13))' }}>
        <path d="M275 346 363 266l91 80-89 88Z" fill={paperShade} />
        <path d="m363 267 1 79-89 .3Z" fill="#B8A5D2" />
        <path d="m454 346-90 .3-.8-79.3Z" fill="#E2A391" />
        <path d="m365 434-.7-86.5L454 346Z" fill="#E7C278" />
        <path d="m275 346 88.2 1.5 1.8 86.5Z" fill="#8FC5B5" />
        <circle cx="364" cy="347" r="27" fill={paper} stroke={ink} strokeWidth="3" />
        <circle cx="364" cy="347" r="7" fill={ink} />
      </g>

      <g>
        <path d="M449 432h31l9 37h-42Z" fill={ink} />
        <path d="m539 425 30-3 17 43h-42Z" fill={ink} />
        <path d="M445 292c0-49 28-77 72-77 47 0 75 30 72 81l-13 127H465Z" fill="#356F68" />
        <path d="m514 218 37 12-1 181-42-43Z" fill="#2B625D" />
        <path d="m462 276 49 28-24 74-53-43Z" fill="#3D8877" />
        <path d="M497 216h31v38h-31Z" fill={skinShade} />
        <path d="M472 171c0-33 22-58 52-58 35 0 57 24 55 59-2 36-26 61-57 60-31-1-50-25-50-61Z" fill={skin} />
        <path d="M477 157c8-39 36-58 67-45 18 7 28 23 31 43-25 2-50-8-72-29-4 14-13 25-26 31Z" fill={ink} />
        <path d="M570 162c12 0 18 8 15 19-3 12-12 18-23 15Z" fill={skin} />
        <path d="M523 178c7 4 13 4 19-1" stroke="#854D42" strokeWidth="3" strokeLinecap="round" />
        <circle cx="505" cy="164" r="3" fill={ink} />
        <circle cx="548" cy="164" r="3" fill={ink} />
        <path d="m476 272-72 67 20 25 85-56Z" fill="#356F68" />
        <path d="M405 337c-10 2-20 10-25 22 10 12 25 14 43 5l2-19Z" fill={skin} />
        <path d="m572 278 48 47-15 22-58-36Z" fill="#2B625D" />
        <path d="M603 324c12-2 26 4 35 15-5 13-18 20-36 11l-8-16Z" fill={skin} />
        <path d="m501 238 15 24 17-24 13 31-31 20-29-21Z" fill="#F1C36D" />
      </g>

      <g>
        <path d="M559 384h94v24h-94Z" fill="#E7A15B" />
        <path d="M578 360h75v24h-75Z" fill="#BD6756" />
        <path d="M599 336h54v24h-54Z" fill="#725A9F" />
        <path d="M624 336V266" stroke={ink} strokeWidth="6" strokeLinecap="round" />
        <path d="m628 270 53 17-53 19Z" fill="#3D8877" />
      </g>

      <path d="m65 265 15-8 7-18 8 18 17 8-17 8-8 18-7-18Z" fill="#E7A15B" />
      <path d="m660 251 10-5 5-11 5 11 11 5-11 5-5 11-5-11Z" fill="#725A9F" />
    </svg>
  )
}

function ResultBackdrop({ palette }: { palette: GroupPalette }) {
  return (
    <>
      <path
        d="M44 301C17 226 35 139 98 80 162 20 266 9 352 48c79 36 115 116 90 193-26 79-113 133-220 136-87 2-155-25-178-76Z"
        fill={palette.pale}
      />
      <circle cx="379" cy="79" r="34" fill={palette.accent} opacity="0.6" />
      <path d="M38 337c113-32 245-29 404 8v30H38Z" fill="#E3D8C5" />
      <path d="M38 326c126-26 259-20 404 18v21H38Z" fill={paper} />
      <path d="m78 102 9 19 20 8-20 8-9 20-8-20-20-8 20-8Z" fill={palette.primary} opacity="0.55" />
    </>
  )
}

function RHResultScene({ palette }: { palette: GroupPalette }) {
  return (
    <>
      <path d="M97 280h96l-10 73h-76Z" fill={palette.primary} />
      <path d="M109 291h70l-8 50h-54Z" fill={palette.deep} opacity="0.34" />
      <path d="M144 281c-3-83 6-140 29-181" stroke={palette.deep} strokeWidth="8" strokeLinecap="round" />
      <path d="M155 213c-36-37-74-27-78 5 31 19 57 17 78-5Z" fill={palette.mid} />
      <path d="M160 176c23-43 63-47 78-14-23 30-49 35-78 14Z" fill={palette.primary} />
      <path d="M145 249c-28-26-57-17-62 9 24 15 45 12 62-9Z" fill="#79AA83" />
      <path d="M168 133c-14-37 7-66 36-59 4 34-7 53-36 59Z" fill={palette.accent} />

      <g style={{ filter: 'drop-shadow(0 10px 10px rgba(41,56,61,.12))' }}>
        <path d="M244 218c0-43 27-71 66-71 42 0 70 31 67 77l-8 122H250Z" fill={palette.primary} />
        <path d="m312 151 34 12-1 173-40-47Z" fill={palette.deep} opacity="0.46" />
        <path d="M286 144h29v35h-29Z" fill={skinShade} />
        <path d="M263 102c0-31 20-53 49-53 32 0 52 23 51 54-1 32-22 55-51 55-29 0-49-23-49-56Z" fill={skin} />
        <path d="M267 91c8-35 34-52 61-40 16 7 25 22 27 39-23 1-45-8-64-26-4 12-12 21-24 27Z" fill={ink} />
        <circle cx="297" cy="101" r="3" fill={ink} />
        <circle cx="336" cy="101" r="3" fill={ink} />
        <path d="M310 119c7 3 13 3 18-2" stroke="#81483D" strokeWidth="3" strokeLinecap="round" />
        <path d="m259 215-58 46 14 23 67-37Z" fill={palette.primary} />
        <path d="M200 259c-13 2-22 10-27 21 10 11 24 12 42 4l2-17Z" fill={skin} />
        <path d="m355 215 33 58-23 11-46-46Z" fill={palette.deep} />
        <path d="M379 269c13-1 24 5 31 17-7 12-21 15-42 1l-1-15Z" fill={skin} />
        <path d="M219 283h107l11 61H230Z" fill={paper} stroke={paperShade} strokeWidth="3" />
        <path d="M239 300h59M239 316h44" stroke={palette.deep} strokeWidth="6" strokeLinecap="round" opacity="0.65" />
      </g>
    </>
  )
}

function RTResultScene({ palette }: { palette: GroupPalette }) {
  return (
    <>
      <g opacity="0.72">
        <circle cx="143" cy="165" r="77" stroke={palette.mid} strokeWidth="3" />
        <circle cx="143" cy="165" r="52" stroke={palette.mid} strokeWidth="3" />
        <circle cx="143" cy="165" r="26" fill={palette.primary} opacity="0.2" />
        <path d="m143 165 69-55" stroke={palette.primary} strokeWidth="5" strokeLinecap="round" />
        <circle cx="143" cy="165" r="7" fill={palette.primary} />
      </g>

      <g style={{ filter: 'drop-shadow(0 10px 10px rgba(41,56,61,.12))' }}>
        <path d="m139 185 99-44 13 29-99 44Z" fill={palette.deep} />
        <path d="m125 188 39-17 13 29-39 18Z" fill={palette.primary} />
        <circle cx="230" cy="155" r="25" fill={paper} stroke={palette.deep} strokeWidth="6" />
        <path d="m190 193 39 137M190 193l-52 137M190 193l-5 137" stroke={ink} strokeWidth="7" strokeLinecap="round" />
      </g>

      <g>
        <path d="M266 223c6-41 35-65 73-58 40 7 62 39 54 83l-26 103-119-22Z" fill={palette.primary} />
        <path d="m334 169 31 16-20 155-35-55Z" fill={palette.deep} opacity="0.48" />
        <path d="m307 158 28 5-6 36-28-5Z" fill={skinShade} />
        <path d="M286 111c6-31 30-49 59-43 32 7 48 32 41 64-7 32-32 51-60 45-29-7-46-34-40-66Z" fill={skin} />
        <path d="M294 100c15-34 43-46 69-28 14 10 20 26 19 44-22-4-42-17-56-39-7 11-18 19-32 23Z" fill={ink} />
        <circle cx="324" cy="116" r="3" fill={ink} />
        <circle cx="361" cy="124" r="3" fill={ink} />
        <path d="M335 141c7 4 13 5 19 1" stroke="#81483D" strokeWidth="3" strokeLinecap="round" />
        <path d="m277 224-60-42-17 23 63 63Z" fill={palette.primary} />
        <path d="M218 181c-10-8-23-9-36-3-1 14 8 24 27 31l13-14Z" fill={skin} />
        <path d="m382 221 41 50-20 17-53-38Z" fill={palette.deep} />
        <path d="M416 266c12 1 22 9 28 21-8 11-22 13-40-1l-3-15Z" fill={skin} />
      </g>
      <path d="m393 98 13 12 17-8-8 17 12 14-19-2-10 16-4-19-18-4 16-10Z" fill={palette.accent} />
    </>
  )
}

function SHResultScene({ palette }: { palette: GroupPalette }) {
  return (
    <>
      <path d="M42 310 178 153l93 98 57-74 116 133Z" fill={palette.mid} opacity="0.6" />
      <path d="m128 310 113-129 121 129Z" fill={palette.primary} opacity="0.35" />
      <path d="M65 329c96-12 186-8 270 12 40 10 75 12 109 8v27H65Z" fill={palette.deep} />
      <path d="M83 334c67 4 122 15 164 33H83Z" fill={palette.primary} />

      <g style={{ filter: 'drop-shadow(0 10px 10px rgba(41,56,61,.12))' }}>
        <path d="M252 212c0-44 26-70 65-70 42 0 69 29 68 74l-8 122H258Z" fill={palette.primary} />
        <path d="m317 146 34 13-1 171-42-47Z" fill={palette.deep} opacity="0.42" />
        <path d="M291 140h29v36h-29Z" fill={skinShade} />
        <path d="M270 96c0-31 20-53 49-53 32 0 52 22 51 54-1 32-22 55-51 55-29 0-49-23-49-56Z" fill={skin} />
        <path d="M274 85c9-34 34-51 62-39 16 7 25 22 27 39-22 2-44-7-64-25-4 12-12 21-25 25Z" fill={ink} />
        <circle cx="305" cy="96" r="3" fill={ink} />
        <circle cx="344" cy="96" r="3" fill={ink} />
        <path d="M316 115c7 3 13 3 19-2" stroke="#81483D" strokeWidth="3" strokeLinecap="round" />
        <path d="m270 208-57 63 20 18 69-52Z" fill={palette.primary} />
        <path d="M213 267c-12 4-20 13-23 25 11 10 25 8 41-2l-1-17Z" fill={skin} />
        <path d="m369 208 42 42-18 20-54-30Z" fill={palette.deep} />
        <path d="M403 247c12-3 24 1 34 11-4 14-17 19-37 13l-8-14Z" fill={skin} />
      </g>

      <path d="M196 274V91" stroke={ink} strokeWidth="7" strokeLinecap="round" />
      <path d="m200 96 105 34-105 39Z" fill={palette.accent} />
      <path d="m207 106 68 23-68 24Z" fill={paper} opacity="0.34" />
      <path d="m82 222 22-11 12-24 11 24 24 11-24 11-11 24-12-24Z" fill={palette.accent} opacity="0.8" />
    </>
  )
}

function STResultScene({ palette }: { palette: GroupPalette }) {
  return (
    <>
      <path d="M56 147h91M34 184h125M70 220h76" stroke={palette.mid} strokeWidth="9" strokeLinecap="round" opacity="0.7" />
      <path d="M69 292c108 8 207 27 297 58H69Z" fill={palette.mid} />
      <path d="m83 301 126-65 170 118H158Z" fill={palette.primary} opacity="0.36" />

      <g style={{ filter: 'drop-shadow(0 12px 11px rgba(41,56,61,.14))' }}>
        <path d="M113 277c69-88 145-139 228-154-12 84-67 158-164 220Z" fill={paper} stroke={palette.deep} strokeWidth="4" />
        <path d="M177 343c44-80 99-143 164-220-12 84-67 158-164 220Z" fill={palette.primary} opacity="0.85" />
        <path d="m113 277-45-9 31 49Z" fill={palette.accent} />
        <path d="m177 343-5 38-38-24Z" fill={palette.accent} />
        <circle cx="254" cy="224" r="26" fill={palette.pale} stroke={palette.deep} strokeWidth="7" />
        <circle cx="254" cy="224" r="11" fill={palette.accent} />
      </g>

      <g>
        <path d="M244 162c10-41 42-62 80-51 40 12 58 48 45 91l-38 106-113-35Z" fill={palette.deep} />
        <path d="m311 116 30 19-37 154-28-59Z" fill={palette.primary} />
        <path d="m286 102 27 8-10 34-27-8Z" fill={skinShade} />
        <path d="M272 55c9-30 35-45 63-36 31 10 44 37 34 68-10 31-37 47-64 38-28-10-42-40-33-70Z" fill={skin} />
        <path d="M282 45c18-32 47-40 70-19 13 11 17 28 13 45-21-7-39-22-50-46-8 10-19 16-33 20Z" fill={ink} />
        <circle cx="309" cy="62" r="3" fill={ink} />
        <circle cx="345" cy="73" r="3" fill={ink} />
        <path d="M319 89c6 5 12 6 18 3" stroke="#81483D" strokeWidth="3" strokeLinecap="round" />
        <path d="m252 162-57 61 20 18 68-49Z" fill={palette.deep} />
        <path d="M196 218c-12 3-21 12-24 24 11 10 25 9 42-1v-17Z" fill={skin} />
        <path d="m354 166 43 45-19 19-54-33Z" fill={palette.primary} />
        <path d="M390 207c12-2 24 3 33 14-5 13-19 18-38 9l-7-14Z" fill={skin} />
      </g>
      <path d="m395 102 12 8 14-5-5 14 9 12-15-1-8 13-4-15-15-4 13-9Z" fill={palette.accent} />
    </>
  )
}

export function ResultIllustration({ group, className }: GroupIllustrationProps) {
  const palette = paletteByGroup[group]

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox="0 0 480 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={responsiveStyle}
    >
      <ResultBackdrop palette={palette} />
      {group === 'RH' && <RHResultScene palette={palette} />}
      {group === 'RT' && <RTResultScene palette={palette} />}
      {group === 'SH' && <SHResultScene palette={palette} />}
      {group === 'ST' && <STResultScene palette={palette} />}
    </svg>
  )
}

function RHMiniScene({ palette }: { palette: GroupPalette }) {
  return (
    <>
      <path d="M42 119h91l-9 37H52Z" fill={palette.deep} opacity="0.22" />
      <path d="M66 100h52l-6 49H72Z" fill={palette.primary} />
      <path d="M92 101c-1-48 8-73 25-87" stroke={palette.deep} strokeWidth="5" strokeLinecap="round" />
      <path d="M99 68c-25-20-47-10-46 12 21 9 36 5 46-12Z" fill={palette.mid} />
      <path d="M104 45c15-27 39-26 47-4-16 17-31 19-47 4Z" fill={palette.primary} />
      <path d="M94 89c-20-13-35-4-34 13 15 6 27 2 34-13Z" fill="#77A87E" />
      <circle cx="120" cy="19" r="8" fill={palette.accent} />
      <path d="M147 111h53v37h-53Z" fill={paper} stroke={paperShade} strokeWidth="2" />
      <path d="M157 122h32M157 134h21" stroke={palette.deep} strokeWidth="4" strokeLinecap="round" />
    </>
  )
}

function RTMiniScene({ palette }: { palette: GroupPalette }) {
  return (
    <>
      <circle cx="83" cy="77" r="53" stroke={palette.mid} strokeWidth="3" />
      <circle cx="83" cy="77" r="34" stroke={palette.mid} strokeWidth="3" />
      <path d="m83 77 45-34" stroke={palette.primary} strokeWidth="5" strokeLinecap="round" />
      <circle cx="83" cy="77" r="7" fill={palette.primary} />
      <path d="m116 97 64-28 10 23-64 28Z" fill={palette.deep} />
      <circle cx="178" cy="79" r="19" fill={paper} stroke={palette.primary} strokeWidth="5" />
      <path d="m146 108 25 45M146 108l-14 45M146 108l5 45" stroke={palette.deep} strokeWidth="5" strokeLinecap="round" />
      <path d="m198 35 7 8 11-2-5 10 6 9-11-2-7 8-1-11-10-4 10-4Z" fill={palette.accent} />
    </>
  )
}

function SHMiniScene({ palette }: { palette: GroupPalette }) {
  return (
    <>
      <path d="m19 136 69-83 50 54 30-39 57 68Z" fill={palette.mid} opacity="0.58" />
      <path d="m60 136 78-90 87 90Z" fill={palette.primary} opacity="0.34" />
      <path d="M99 137V26" stroke={palette.deep} strokeWidth="6" strokeLinecap="round" />
      <path d="m103 31 72 23-72 29Z" fill={palette.accent} />
      <path d="m110 40 43 14-43 17Z" fill={paper} opacity="0.35" />
      <path d="M18 137c63-10 132-7 207 9v11H18Z" fill={palette.deep} />
      <path d="m190 36 7-15 7 15 15 7-15 7-7 16-7-16-16-7Z" fill={palette.primary} opacity="0.7" />
    </>
  )
}

function STMiniScene({ palette }: { palette: GroupPalette }) {
  return (
    <>
      <path d="M19 54h52M10 79h71M29 104h43" stroke={palette.mid} strokeWidth="7" strokeLinecap="round" />
      <path d="M69 128c44-58 92-90 145-96-8 53-43 99-106 130Z" fill={paper} stroke={palette.deep} strokeWidth="3" />
      <path d="M108 162c29-52 64-95 106-130-8 53-43 99-106 130Z" fill={palette.primary} />
      <path d="m70 128-35-5 26 35Z" fill={palette.accent} />
      <circle cx="157" cy="91" r="18" fill={palette.pale} stroke={palette.deep} strokeWidth="5" />
      <circle cx="157" cy="91" r="7" fill={palette.accent} />
      <path d="m207 20 6 6 9-3-3 9 5 7-9-1-5 8-3-9-9-2 8-6Z" fill={palette.accent} />
    </>
  )
}

export function MiniScene({ group, className }: GroupIllustrationProps) {
  const palette = paletteByGroup[group]

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox="0 0 240 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={responsiveStyle}
    >
      <path
        d="M15 139C2 94 18 47 58 20c43-29 105-25 144 9 36 31 43 80 15 113-28 33-80 34-127 29-39-4-67-10-75-32Z"
        fill={palette.pale}
      />
      {group === 'RH' && <RHMiniScene palette={palette} />}
      {group === 'RT' && <RTMiniScene palette={palette} />}
      {group === 'SH' && <SHMiniScene palette={palette} />}
      {group === 'ST' && <STMiniScene palette={palette} />}
    </svg>
  )
}
