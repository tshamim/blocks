/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import prettier from 'prettier/standalone'
import parserJS from 'prettier/parser-babylon'

import { useEditor } from './editor-context'
import InlineRender from './inline-render'
import { PreviewArea, Device } from './device-preview'

import { Clipboard, Check } from 'react-feather'
import { IconButton } from './ui'
import useCopyToClipboard from './use-copy-to-clipboard'

const Wrap = props => (
  <div
    sx={{
      position: 'relative',
      width: '60%',
      backgroundColor: 'white',
      height: 'calc(100vh - 43px)',
      overflow: 'auto'
    }}
    {...props}
  />
)

const Copy = ({ toCopy }) => {
  const { hasCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <IconButton
      onClick={() => copyToClipboard(toCopy)}
      sx={{ position: 'absolute', right: '-4px' }}
    >
      {hasCopied ? (
        <Check sx={{ color: 'green' }} aria-label="Copied" />
      ) : (
        <Clipboard size={16} aria-label="Copy" />
      )}
    </IconButton>
  )
}

const devices = [
  { name: 'Mobile', width: 380 },
  { name: 'Tablet', width: 720 },
  { name: 'Desktop', width: 1200 }
]

export default ({ code, transformedCode, scope, theme }) => {
  const { mode } = useEditor()
  const formattedCode = prettier.format(code, {
    parser: 'babel',
    plugins: [parserJS]
  })

  if (mode === 'code') {
    return (
      <Wrap>
        <Copy toCopy={formattedCode} />
        <Styled.pre
          language="js"
          sx={{
            mt: 0,
            backgroundColor: 'white',
            color: 'black'
          }}
        >
          {formattedCode}
        </Styled.pre>
      </Wrap>
    )
  }

  if (mode === 'viewports') {
    return (
      <PreviewArea>
        {devices.map(device => (
          <Device
            key={device.name}
            name={device.name}
            width={device.width}
            height={500}
          >
            <InlineRender scope={scope} code={transformedCode} theme={theme} />
          </Device>
        ))}
      </PreviewArea>
    )
  }

  return (
    <Wrap>
      <InlineRender scope={scope} code={transformedCode} theme={theme} />
    </Wrap>
  )
}
