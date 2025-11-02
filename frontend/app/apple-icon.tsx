import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          position: 'relative',
          borderRadius: '22.5%',
        }}
      >
        {/* Mosaic tile pattern - 3x3 grid with aquamarine colors */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '150px',
          height: '150px',
          gap: '6px',
        }}>
          {/* Row 1 */}
          <div style={{
            width: '46px',
            height: '46px',
            background: '#0d9488',
            borderRadius: '6px',
          }} />
          <div style={{
            width: '46px',
            height: '46px',
            background: '#5eead4',
            borderRadius: '6px',
          }} />
          <div style={{
            width: '46px',
            height: '46px',
            background: '#14b8a6',
            borderRadius: '6px',
          }} />

          {/* Row 2 */}
          <div style={{
            width: '46px',
            height: '46px',
            background: '#2dd4bf',
            borderRadius: '6px',
          }} />
          <div style={{
            width: '46px',
            height: '46px',
            background: '#14b8a6',
            borderRadius: '6px',
          }} />
          <div style={{
            width: '46px',
            height: '46px',
            background: '#0d9488',
            borderRadius: '6px',
          }} />

          {/* Row 3 */}
          <div style={{
            width: '46px',
            height: '46px',
            background: '#14b8a6',
            borderRadius: '6px',
          }} />
          <div style={{
            width: '46px',
            height: '46px',
            background: '#0d9488',
            borderRadius: '6px',
          }} />
          <div style={{
            width: '46px',
            height: '46px',
            background: '#2dd4bf',
            borderRadius: '6px',
          }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
