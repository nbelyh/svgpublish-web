import React from 'react'
import { SvgPublishComponent } from '../lib/SvgPublishComponent'

function App() {

  return (
    <SvgPublishComponent
      url="/assets/Links.svg"
      enablePan={false} 
      enableZoom={false} 
      enableFollowHyperlinks={false}
    />
  )
}

export default App
