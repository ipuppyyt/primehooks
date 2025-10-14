import React from 'react'

interface CodeRunnerProps {
    children: React.ReactNode
}

export const CodeRunner = ({ children }: CodeRunnerProps) => {
  return (
      <div className='rounded-xl border border-zinc-400 dark:border-zinc-800'>{children}</div>
  )
}
