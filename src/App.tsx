import { SvgPublishComponent } from '../lib/SvgPublishComponent'

function App() {

  return (
    <SvgPublishComponent
      url="/connected-highlight.svg"
      enablePan enableZoom enableFollowHyperlinks
    />
  )
}

export default App
