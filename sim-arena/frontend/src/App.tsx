import MainDashboard from './components/layout/MainDashboard'
import BattleLayout from './components/battle/BattleLayout'
import { useMainStore } from './store/useMainStore'

function App() {
  const { appStage } = useMainStore()

  return (
    <>
      {appStage === 'PHASE_1_2_STUDIO' && <MainDashboard />}
      {appStage !== 'PHASE_1_2_STUDIO' && <BattleLayout />}
    </>
  )
}

export default App