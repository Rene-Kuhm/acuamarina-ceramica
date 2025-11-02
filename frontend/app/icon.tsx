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
        {/* Aguamarina Mosaicos Logo - Optimized for favicon */}

        {/* Outer circle border - enhanced teal color */}
        <div style={{
          position: 'absolute',
          width: '31px',
          height: '31px',
          borderRadius: '50%',
          border: '2px solid #0d7f73',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}>
          {/* Dog silhouette - simplified for small size */}
          <div style={{
            position: 'absolute',
            top: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* Dog head/ears */}
            <div style={{
              width: '12px',
              height: '8px',
              background: '#ffffff',
              border: '1.5px solid #2d3748',
              borderRadius: '6px 6px 2px 2px',
            }} />
            {/* Dog body */}
            <div style={{
              width: '10px',
              height: '6px',
              background: '#ffffff',
              border: '1.5px solid #2d3748',
              borderRadius: '2px',
              marginTop: '-2px',
            }} />
          </div>

          {/* Decorative mosaic dots - enhanced colors */}
          {/* Top left - aquamarine */}
          <div style={{
            position: 'absolute',
            top: '6px',
            left: '4px',
            width: '3px',
            height: '3px',
            background: '#14b8a6',
            borderRadius: '50%',
          }} />

          {/* Top right - beige/tan */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '5px',
            width: '2.5px',
            height: '2.5px',
            background: '#d4a574',
            borderRadius: '50%',
          }} />

          {/* Bottom left - dark teal */}
          <div style={{
            position: 'absolute',
            bottom: '7px',
            left: '5px',
            width: '3px',
            height: '3px',
            background: '#0d7f73',
            borderRadius: '50%',
          }} />

          {/* Bottom right - light aqua */}
          <div style={{
            position: 'absolute',
            bottom: '9px',
            right: '6px',
            width: '2.5px',
            height: '2.5px',
            background: '#7dd3c0',
            borderRadius: '50%',
          }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
