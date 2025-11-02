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
        }}
      >
        {/* Expert design: Stylized wave + geometric mosaic tiles (scaled for 180x180) */}

        {/* Background circle with gradient */}
        <div style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
        }}>
          {/* First wave layer */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '30px',
            width: '100px',
            height: '30px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '0 0 50px 50px',
            display: 'flex',
          }} />

          {/* Second wave layer */}
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '20px',
            width: '120px',
            height: '30px',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '0 0 60px 60px',
            display: 'flex',
          }} />

          {/* Third wave layer (subtle) */}
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '25px',
            width: '110px',
            height: '20px',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '0 0 55px 55px',
            display: 'flex',
          }} />

          {/* Geometric mosaic tiles at bottom - row of 5 tiles */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '35px',
            display: 'flex',
            gap: '6px',
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: '#5eead4',
              borderRadius: '3px',
            }} />
            <div style={{
              width: '16px',
              height: '16px',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '3px',
            }} />
            <div style={{
              width: '16px',
              height: '16px',
              background: '#2dd4bf',
              borderRadius: '3px',
            }} />
            <div style={{
              width: '16px',
              height: '16px',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '3px',
            }} />
            <div style={{
              width: '16px',
              height: '16px',
              background: '#5eead4',
              borderRadius: '3px',
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
