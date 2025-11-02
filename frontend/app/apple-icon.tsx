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
          background: '#f8f9fa',
          position: 'relative',
        }}
      >
        {/* Aguamarina Mosaicos Logo - Exact reproduction with full detail */}

        {/* Outer circle border - dark teal/forest green */}
        <div style={{
          position: 'absolute',
          width: '168px',
          height: '168px',
          borderRadius: '50%',
          border: '4px solid #2d5651',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}>
          {/* Samoyed dog - center with detailed features */}
          <div style={{
            position: 'absolute',
            top: '42px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2,
          }}>
            {/* Dog ears - fluffy triangular */}
            <div style={{
              display: 'flex',
              gap: '22px',
              marginBottom: '-8px',
            }}>
              <div style={{
                width: '16px',
                height: '24px',
                background: '#ffffff',
                border: '2.5px solid #1a1a1a',
                borderRadius: '8px 8px 2px 2px',
                transform: 'rotate(-12deg)',
              }} />
              <div style={{
                width: '16px',
                height: '24px',
                background: '#ffffff',
                border: '2.5px solid #1a1a1a',
                borderRadius: '8px 8px 2px 2px',
                transform: 'rotate(12deg)',
              }} />
            </div>

            {/* Dog head - fluffy round */}
            <div style={{
              width: '52px',
              height: '48px',
              background: '#ffffff',
              border: '2.5px solid #1a1a1a',
              borderRadius: '26px 26px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Eyes - happy expression */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '10px',
              }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  background: '#1a1a1a',
                  borderRadius: '50%',
                }} />
                <div style={{
                  width: '5px',
                  height: '5px',
                  background: '#1a1a1a',
                  borderRadius: '50%',
                }} />
              </div>

              {/* Green nose */}
              <div style={{
                width: '7px',
                height: '7px',
                background: '#2d8b6f',
                borderRadius: '50%',
                marginTop: '5px',
              }} />

              {/* Smiling mouth/tongue */}
              <div style={{
                width: '18px',
                height: '10px',
                border: '2px solid #1a1a1a',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                marginTop: '3px',
                background: '#ffffff',
              }} />
            </div>

            {/* Dog body - fluffy round */}
            <div style={{
              width: '48px',
              height: '34px',
              background: '#ffffff',
              border: '2.5px solid #1a1a1a',
              borderRadius: '18px',
              marginTop: '-6px',
            }} />
          </div>

          {/* Line art faces - left side */}
          <div style={{
            position: 'absolute',
            left: '22px',
            top: '55px',
            width: '32px',
            height: '58px',
            border: '2px solid #7a8a8f',
            borderRadius: '16px 16px 12px 12px',
            opacity: 0.5,
            zIndex: 1,
          }}>
            {/* Face features */}
            <div style={{
              position: 'absolute',
              top: '18px',
              left: '8px',
              width: '3px',
              height: '3px',
              background: '#7a8a8f',
              borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute',
              top: '18px',
              right: '8px',
              width: '3px',
              height: '3px',
              background: '#7a8a8f',
              borderRadius: '50%',
            }} />
          </div>

          {/* Line art faces - right side */}
          <div style={{
            position: 'absolute',
            right: '24px',
            top: '65px',
            width: '30px',
            height: '52px',
            border: '2px solid #7a8a8f',
            borderRadius: '15px 15px 11px 11px',
            opacity: 0.5,
            zIndex: 1,
          }}>
            {/* Face features */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '7px',
              width: '3px',
              height: '3px',
              background: '#7a8a8f',
              borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '7px',
              width: '3px',
              height: '3px',
              background: '#7a8a8f',
              borderRadius: '50%',
            }} />
          </div>

          {/* Decorative elements - matching exact logo */}
          {/* Top left - light aquamarine organic shapes */}
          <div style={{
            position: 'absolute',
            top: '28px',
            left: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            <div style={{
              width: '20px',
              height: '24px',
              background: '#a0d9cc',
              borderRadius: '45% 55% 50% 50%',
            }} />
          </div>

          {/* Center right - beige organic shape */}
          <div style={{
            position: 'absolute',
            top: '52px',
            right: '22px',
            width: '18px',
            height: '20px',
            background: '#d4b896',
            borderRadius: '50% 45% 55% 50%',
          }} />

          {/* Bottom left - dark forest green organic shape */}
          <div style={{
            position: 'absolute',
            bottom: '38px',
            left: '18px',
            width: '22px',
            height: '24px',
            background: '#2d5651',
            borderRadius: '50% 50% 45% 55%',
          }} />

          {/* Bottom right - aquamarine mosaic tiles */}
          <div style={{
            position: 'absolute',
            bottom: '32px',
            right: '26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            transform: 'rotate(18deg)',
          }}>
            <div style={{
              display: 'flex',
              gap: '3px',
            }}>
              <div style={{
                width: '11px',
                height: '11px',
                background: '#7fc7b8',
                borderRadius: '2px',
              }} />
              <div style={{
                width: '11px',
                height: '11px',
                background: '#a0d9cc',
                borderRadius: '2px',
              }} />
            </div>
            <div style={{
              display: 'flex',
              gap: '3px',
            }}>
              <div style={{
                width: '11px',
                height: '11px',
                background: '#a0d9cc',
                borderRadius: '2px',
              }} />
            </div>
          </div>

          {/* Text "Aguamarina Mosaicos" curved along right edge */}
          <div style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1a1a1a',
            transform: 'translateY(-50%) rotate(90deg)',
            transformOrigin: 'center',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
          }}>
            Aguamarina Mosaicos
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
