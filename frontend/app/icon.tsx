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
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          position: 'relative',
        }}
      >
        {/* Professional monogram AM (Aguamarina Mosaicos) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-1px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            AM
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
