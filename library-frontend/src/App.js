import React, { useState } from 'react'
import { useApolloClient} from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {useQuery } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

// const Notify = ({ errorMessage }) => {
//   if ( !errorMessage ) {
//     return null
//   }

//   return (
//     <div style={{color: 'red'}}>
//       {errorMessage}
//     </div>
//   )
// }

const App = () => {
  // const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_BOOKS)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  if (result.loading)  {
    return <div>loading...</div>
  }
  // const notify = (message) => {
  //   setErrorMessage(message)
  //   setTimeout(() => {
  //     setErrorMessage(null)
  //   }, 10000)
  // }

  return (
    <div>

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      {/* <Notify errorMessage={errorMessage} /> */}
      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App