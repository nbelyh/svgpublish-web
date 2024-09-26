import React from 'react'
import { SvgPublishComponent } from '../lib/SvgPublishComponent'

function App() {

  return (
    <SvgPublishComponent
      url="/assets/connected-highlight.svg"
      enablePan enableZoom enableFollowHyperlinks
    />
  )
}

export default App
