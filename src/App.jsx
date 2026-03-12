import { useState } from 'react'

const FPL_2024 = { 1: 15060, 2: 20440, 3: 25820, 4: 31200 }

const STEPS = [
  { id: 'medicare', question: 'Is the beneficiary enrolled in Medicare?', field: 'hasMedicare' },
  { id: 'age', question: 'Is the beneficiary 65 or older?', field: 'isOver65' },
  { id: 'income', question: 'What is their income level?', field: 'incomeLevel', type: 'income' },
]

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [income, setIncome] = useState('')
  const [household, setHousehold] = useState(1)

  const handleAnswer = (value) => {
    const step = STEPS[currentStep]
    const newAnswers = { ...answers, [step.field]: value }
    setAnswers(newAnswers)

    // Check for early termination
    if (step.field === 'hasMedicare' && !value) {
      setResult({ eligible: false, reason: 'Must be enrolled in Medicare' })
      return
    }
    if (step.field === 'isOver65' && !value) {
      setResult({ eligible: false, reason: 'Must be 65 or older (or disabled)' })
      return
    }

    // Move to next step or calculate result
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const calculateIncome = () => {
    const annualIncome = parseFloat(income) * 12
    const fpl = FPL_2024[household]
    const percent = (annualIncome / fpl) * 100

    let program = null
    let eligible = false

    if (percent <= 100) {
      program = 'QMB'
      eligible = true
    } else if (percent <= 120) {
      program = 'SLMB'
      eligible = true
    } else if (percent <= 135) {
      program = 'QI'
      eligible = true
    }

    setResult({
      eligible,
      program,
      percent: Math.round(percent),
      reason: eligible ? `Income at ${Math.round(percent)}% FPL qualifies for ${program}` : 'Income exceeds 135% FPL'
    })
  }

  const reset = () => {
    setCurrentStep(0)
    setAnswers({})
    setResult(null)
    setIncome('')
    setHousehold(1)
  }

  const step = STEPS[currentStep]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'var(--primary)', color: 'white', padding: '1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>MSP Eligibility Checker</h1>
        <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Interactive Decision Tree</p>
        <span style={{ 
          display: 'inline-block', 
          background: 'var(--secondary)', 
          color: 'var(--primary)',
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          marginTop: '0.5rem'
        }}>
          Vendor Beta — Decision Tree
        </span>
      </header>

      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Decision Tree Visualization */}
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '1rem' }}>Decision Path</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Medicare Node */}
            <Node 
              label="Medicare?" 
              status={answers.hasMedicare === undefined ? (currentStep === 0 ? 'current' : 'inactive') : (answers.hasMedicare ? 'yes' : 'no')}
            />
            <Arrow />
            
            {/* Age Node */}
            <Node 
              label="Age 65+?" 
              status={answers.isOver65 === undefined ? (currentStep === 1 ? 'current' : 'inactive') : (answers.isOver65 ? 'yes' : 'no')}
            />
            <Arrow />
            
            {/* Income Node */}
            <Node 
              label="Income?" 
              status={result ? (result.eligible ? 'yes' : 'no') : (currentStep === 2 ? 'current' : 'inactive')}
            />
            <Arrow />
            
            {/* Result Node */}
            <Node 
              label={result ? (result.eligible ? result.program : 'Not Eligible') : '?'} 
              status={result ? (result.eligible ? 'yes' : 'no') : 'inactive'}
              isResult
            />
          </div>
        </div>

        {/* Question Card */}
        {!result && (
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '1rem' }}>
              Step {currentStep + 1} of {STEPS.length}
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{step.question}</p>
            
            {step.type === 'income' ? (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.25rem' }}>
                    Monthly Income ($)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="1200"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.25rem' }}>
                    Household Size
                  </label>
                  <select
                    value={household}
                    onChange={(e) => setHousehold(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value={1}>1 person</option>
                    <option value={2}>2 people</option>
                    <option value={3}>3 people</option>
                    <option value={4}>4 people</option>
                  </select>
                </div>
                <button
                  onClick={calculateIncome}
                  disabled={!income}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: income ? 'var(--primary)' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: income ? 'pointer' : 'not-allowed'
                  }}
                >
                  Calculate Eligibility
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => handleAnswer(true)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'var(--success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${result.eligible ? 'var(--success)' : 'var(--error)'}`
          }}>
            <h2 style={{ 
              color: result.eligible ? 'var(--success)' : 'var(--error)', 
              fontSize: '1.5rem', 
              marginBottom: '0.5rem' 
            }}>
              {result.eligible ? `Likely Eligible: ${result.program}` : 'Not Eligible'}
            </h2>
            <p style={{ marginBottom: '1rem' }}>{result.reason}</p>
            {result.percent && (
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                Income at {result.percent}% of Federal Poverty Level
              </p>
            )}
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Start Over
            </button>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
        <p>
          <strong>Demo Only</strong> — Not for actual eligibility determinations<br />
          Part of the <a href="https://github.com/mes-bakeoff-demo" style={{ color: 'var(--primary)' }}>MN Bake-Off Demo</a>
        </p>
      </footer>
    </div>
  )
}

function Node({ label, status, isResult }) {
  const colors = {
    inactive: { bg: '#e0e0e0', border: '#bdbdbd', text: '#757575' },
    current: { bg: '#bbdefb', border: '#2196f3', text: '#1565c0' },
    yes: { bg: '#c8e6c9', border: '#4caf50', text: '#2e7d32' },
    no: { bg: '#ffcdd2', border: '#f44336', text: '#c62828' },
  }
  
  const c = colors[status] || colors.inactive
  
  return (
    <div style={{
      padding: isResult ? '0.75rem 1.25rem' : '0.5rem 1rem',
      background: c.bg,
      border: `2px solid ${c.border}`,
      borderRadius: isResult ? '8px' : '20px',
      color: c.text,
      fontWeight: 600,
      fontSize: isResult ? '1rem' : '0.85rem',
      whiteSpace: 'nowrap'
    }}>
      {label}
    </div>
  )
}

function Arrow() {
  return (
    <div style={{ color: '#bdbdbd', fontSize: '1.25rem' }}>→</div>
  )
}

export default App
