import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default async function Icon() {
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
        }}
      >
        {/* Mosaic tile pattern - 2x2 grid with aquamarine colors */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '28px',
          height: '28px',
          gap: '2px',
        }}>
          {/* Top-left tile - Dark teal */}
          <div style={{
            width: '13px',
            height: '13px',
            background: '#0d9488',
            borderRadius: '2px',
          }} />

          {/* Top-right tile - Light aquamarine */}
          <div style={{
            width: '13px',
            height: '13px',
            background: '#5eead4',
            borderRadius: '2px',
          }} />

          {/* Bottom-left tile - Medium aquamarine */}
          <div style={{
            width: '13px',
            height: '13px',
            background: '#2dd4bf',
            borderRadius: '2px',
          }} />

          {/* Bottom-right tile - Primary teal */}
          <div style={{
            width: '13px',
            height: '13px',
            background: '#14b8a6',
            borderRadius: '2px',
          }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
