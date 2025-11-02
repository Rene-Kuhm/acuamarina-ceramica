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
        {/* Aguamarina Mosaicos Logo - Full detail for large icon */}

        {/* Outer circle border - enhanced teal color */}
        <div style={{
          position: 'absolute',
          width: '170px',
          height: '170px',
          borderRadius: '50%',
          border: '4px solid #0d7f73',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(13, 127, 115, 0.15)',
        }}>
          {/* Dog illustration - centered */}
          <div style={{
            position: 'absolute',
            top: '45px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* Dog ears */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '-5px',
            }}>
              <div style={{
                width: '15px',
                height: '20px',
                background: '#ffffff',
                border: '3px solid #2d3748',
                borderRadius: '8px 8px 0 0',
                transform: 'rotate(-15deg)',
              }} />
              <div style={{
                width: '15px',
                height: '20px',
                background: '#ffffff',
                border: '3px solid #2d3748',
                borderRadius: '8px 8px 0 0',
                transform: 'rotate(15deg)',
              }} />
            </div>

            {/* Dog head */}
            <div style={{
              width: '50px',
              height: '45px',
              background: '#ffffff',
              border: '3px solid #2d3748',
              borderRadius: '25px 25px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Eyes */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '8px',
              }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  background: '#2d3748',
                  borderRadius: '50%',
                }} />
                <div style={{
                  width: '5px',
                  height: '5px',
                  background: '#2d3748',
                  borderRadius: '50%',
                }} />
              </div>

              {/* Nose */}
              <div style={{
                width: '6px',
                height: '6px',
                background: '#14b8a6',
                borderRadius: '50%',
                marginTop: '4px',
              }} />

              {/* Mouth */}
              <div style={{
                width: '15px',
                height: '8px',
                border: '2px solid #2d3748',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                marginTop: '2px',
              }} />
            </div>

            {/* Dog body */}
            <div style={{
              width: '45px',
              height: '30px',
              background: '#ffffff',
              border: '3px solid #2d3748',
              borderRadius: '15px',
              marginTop: '-5px',
            }} />
          </div>

          {/* Line art faces (simplified) - left side */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '50px',
            width: '30px',
            height: '50px',
            border: '2px solid #8b9297',
            borderRadius: '15px 15px 10px 10px',
            opacity: 0.4,
          }} />

          {/* Line art faces - right side */}
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '60px',
            width: '28px',
            height: '45px',
            border: '2px solid #8b9297',
            borderRadius: '14px 14px 10px 10px',
            opacity: 0.4,
          }} />

          {/* Decorative mosaic elements - enhanced colors */}
          {/* Top left cluster */}
          <div style={{
            position: 'absolute',
            top: '25px',
            left: '30px',
            display: 'flex',
            gap: '4px',
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#14b8a6',
              borderRadius: '3px',
            }} />
            <div style={{
              width: '10px',
              height: '10px',
              background: '#7dd3c0',
              borderRadius: '50%',
            }} />
          </div>

          {/* Top right cluster */}
          <div style={{
            position: 'absolute',
            top: '30px',
            right: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
            <div style={{
              width: '11px',
              height: '11px',
              background: '#d4a574',
              borderRadius: '3px',
            }} />
            <div style={{
              width: '9px',
              height: '9px',
              background: '#c9986a',
              borderRadius: '50%',
            }} />
          </div>

          {/* Bottom left cluster */}
          <div style={{
            position: 'absolute',
            bottom: '35px',
            left: '28px',
            display: 'flex',
            gap: '4px',
          }}>
            <div style={{
              width: '13px',
              height: '13px',
              background: '#0d7f73',
              borderRadius: '3px',
            }} />
            <div style={{
              width: '10px',
              height: '10px',
              background: '#14b8a6',
              borderRadius: '50%',
            }} />
          </div>

          {/* Bottom right cluster */}
          <div style={{
            position: 'absolute',
            bottom: '32px',
            right: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}>
            <div style={{
              width: '11px',
              height: '11px',
              background: '#7dd3c0',
              borderRadius: '3px',
            }} />
            <div style={{
              width: '12px',
              height: '12px',
              background: '#5eead4',
              borderRadius: '3px',
              transform: 'rotate(45deg)',
            }} />
          </div>

          {/* Text "Aguamarina Mosaicos" curved on right side */}
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '55px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#2d3748',
            transform: 'rotate(90deg)',
            transformOrigin: 'center',
            letterSpacing: '1px',
          }}>
            Aguamarina
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
