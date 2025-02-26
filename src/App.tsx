import { useRef, useState } from 'react'
import './App.css'
import { requestToGroqAI } from './utils/groq'
import {Light as SyntaxHighlighter} from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const promptRef = useRef<HTMLInputElement>(null)
  const [data, setData] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleAnalyze = async () => {
    if (!promptRef.current?.value) return;
    
    try {
      setIsLoading(true)
      setError('')
      const response = await requestToGroqAI(promptRef.current.value)
      if (response) {
        setData(response)
        promptRef.current.value = ''
      } else {
        setError('No response received from AI')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI response')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleAnalyze()
  }

  return (
   <main className="h-[80vh] flex flex-col items-center mx-auto">
    <h1 className='text-4xl text-orange-500 mt-8'>REACT | GROQ AI</h1>
    <form className="mt-8 flex gap-2 justify-center w-full" onSubmit={handleSubmit}>
      <input 
        ref={promptRef}
        className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 w-96"
        placeholder="Ask anything to AI..."
        type='text'
        disabled={isLoading}
      />
      <button 
        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
        type='submit'
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
    
    {error && (
      <div className="mt-4 text-red-500">{error}</div>
    )}
    
    {data && (
      <div className="mt-8 bg-white/10 rounded-lg w-full overflow-y-auto max-h-[50vh] p-4">
          <SyntaxHighlighter 
            language="swift" 
            style={darcula}
            wrapLongLines={true}
            customStyle={{
              background: 'transparent',
              width: '100%',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word'
            }}
          >
            {data}
          </SyntaxHighlighter>
      </div>
    )}
   </main>
  )
}

export default App
