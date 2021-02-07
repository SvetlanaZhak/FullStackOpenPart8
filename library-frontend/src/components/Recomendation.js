import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Recommendation = (props) => {
    const result = useQuery(ALL_BOOKS)
    const books = result.data.allBooks 

    if (!props.show) {
        return null
      }
    
    if (props.user) {

    let recommendations = (books.filter(book =>
      book.genres.find(genre => genre === props.user.favoriteGenre)));
    
      return (
        <div>
          <h2>recommendations</h2>
          <p>books in your favourite genre <b>{props.user.favoriteGenre}</b></p>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {recommendations.map(a => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} else {
          return null
      }
    }

    export default Recommendation;