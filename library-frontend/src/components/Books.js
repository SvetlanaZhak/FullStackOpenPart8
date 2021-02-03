import React from 'react'
import { ALL_BOOKS } from '../queries'
import { useQuery, useMutation, useSubscription } from '@apollo/client'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  console.log(result, "response")
  if (!props.show) {
    return null
  }
  console.log(result, "che")
  const books = result.data.allBooks 
  console.log(result.data, "che")

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books