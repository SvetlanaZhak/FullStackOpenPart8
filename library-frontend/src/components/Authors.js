  
import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_YEAR } from '../queries'
import { useQuery, useMutation} from '@apollo/client'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  console.log(result, "response")

  const [setAuthorBirthYear] = useMutation(EDIT_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error)
    }
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }
  const authors = result.data.allAuthors 
  const setBirtyearForm= (event) => {
    event.preventDefault()

    // if (!event.target.year.value) {
    //   props.setError("You didn't add year")
    //   return
    // }

    setAuthorBirthYear({ variables: { name: event.target.selector.value, born: parseInt(event.target.year.value) } })
    event.target.year.value = null
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <form onSubmit={setBirtyearForm}>
        <h2>Set birthyear</h2>
        <select name="selector" >
          {authors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
        </select>
        <div>born <input name="year" type="number"></input></div>
        <button type="submit">update author</button>
      </form>

    </div>
  )
}

export default Authors
