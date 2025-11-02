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
          background: '#f8f9fa',
          position: 'relative',
        }}
      >
        {/* Aguamarina Mosaicos Logo - Exact reproduction */}

        {/* Outer circle border - dark teal/forest green */}
        <div style={{
          position: 'absolute',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '2px solid #2d5651',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}>
          {/* Samoyed dog - center */}
          <div style={{
            position: 'absolute',
            top: '7px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* Dog head with fluffy outline */}
            <div style={{
              width: '11px',
              height: '10px',
              background: '#ffffff',
              border: '1.5px solid #1a1a1a',
              borderRadius: '5px 5px 3px 3px',
              position: 'relative',
            }}>
              {/* Eyes */}
              <div style={{
                display: 'flex',
                gap: '3px',
                position: 'absolute',
                top: '2px',
                left: '2px',
              }}>
                <div style={{
                  width: '1.5px',
                  height: '1.5px',
                  background: '#1a1a1a',
                  borderRadius: '50%',
                }} />
                <div style={{
                  width: '1.5px',
                  height: '1.5px',
                  background: '#1a1a1a',
                  borderRadius: '50%',
                }} />
              </div>
              {/* Green nose */}
              <div style={{
                position: 'absolute',
                bottom: '1px',
                left: '4px',
                width: '2px',
                height: '2px',
                background: '#2d8b6f',
                borderRadius: '50%',
              }} />
            </div>
          </div>

          {/* Decorative elements matching exact positions */}
          {/* Top left - light aquamarine organic shape */}
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '3px',
            width: '4px',
            height: '5px',
            background: '#a0d9cc',
            borderRadius: '40%',
          }} />

          {/* Center right - beige organic shape */}
          <div style={{
            position: 'absolute',
            top: '9px',
            right: '3px',
            width: '3px',
            height: '4px',
            background: '#d4b896',
            borderRadius: '40%',
          }} />

          {/* Bottom left - dark forest green organic shape */}
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: '3px',
            width: '4px',
            height: '4px',
            background: '#2d5651',
            borderRadius: '40%',
          }} />

          {/* Bottom right - aquamarine tiles */}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            right: '4px',
            display: 'flex',
            gap: '1px',
            transform: 'rotate(15deg)',
          }}>
            <div style={{
              width: '2px',
              height: '2px',
              background: '#7fc7b8',
              borderRadius: '1px',
            }} />
            <div style={{
              width: '2px',
              height: '2px',
              background: '#a0d9cc',
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
