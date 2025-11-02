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
            fontSize: '110px',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-4px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.15)',
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
