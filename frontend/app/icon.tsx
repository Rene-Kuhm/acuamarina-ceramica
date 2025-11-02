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
        {/* Expert design: Stylized wave + geometric mosaic tiles */}

        {/* Background circle with gradient */}
        <div style={{
          position: 'absolute',
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Stylized wave pattern (top part) */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '6px',
            width: '20px',
            height: '6px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '0 0 10px 10px',
            display: 'flex',
          }} />

          {/* Second wave layer */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '4px',
            width: '24px',
            height: '6px',
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '0 0 12px 12px',
            display: 'flex',
          }} />

          {/* Geometric mosaic tiles at bottom */}
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: '8px',
            display: 'flex',
            gap: '2px',
          }}>
            {/* Three small tiles */}
            <div style={{
              width: '4px',
              height: '4px',
              background: '#5eead4',
              borderRadius: '1px',
            }} />
            <div style={{
              width: '4px',
              height: '4px',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '1px',
            }} />
            <div style={{
              width: '4px',
              height: '4px',
              background: '#5eead4',
              borderRadius: '1px',
            }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
