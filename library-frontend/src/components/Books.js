import React , { useState, useEffect }from 'react'
import { ALL_BOOKS } from '../queries'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import Select from 'react-select'

const Books = (props) => {
  console.log(props, "props")
  const result = useQuery(ALL_BOOKS)
  const [filteredGenre, setFilteredGenre] = useState("");
  console.log(result, "response")
  if (!props.show) {
    return null
  }

  const books = result.data.allBooks 
  const uniqueGenres = [
    ...new Set(books.map(book => book.genres).reduce((a, b) => a.concat(b)))
  ];
  const allGenres = uniqueGenres.map((str, index) => ({ value: str }));

  const options = allGenres.map(genre => {
    return { value: genre.value, label: genre.value };
  });

  let filteredBooks =
  filteredGenre !== ""
      ? books.filter(book =>
          book.genres.find(genre => genre === filteredGenre.value)
        )
      : books;



  const select = async selectedGenre => {
    setFilteredGenre(selectedGenre);
  };

// if (props.user) {

//     let recommendations = (books.filter(book =>
//       book.genres.find(genre => genre === props.user.favoriteGenre)));
    
//       return (
//         <div>
//           <h2>recommendations</h2>
//           <p>books in your favourite genre <b>{props.user.favoriteGenre}</b></p>
//           <table>
//             <tbody>
//               <tr>
//                 <th></th>
//                 <th>author</th>
//                 <th>published</th>
//               </tr>
//               {recommendations.map(a => (
//                 <tr key={a.title}>
//                   <td>{a.title}</td>
//                   <td>{a.author.name}</td>
//                   <td>{a.published}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//   } else {
    return(  <div>
    
      <h2>Books</h2>
      <div style={{ width: "200px" }}>
          <Select
            value={filteredGenre}
            onChange={select}
            options={options}
            placeholder="Filter by genre"
          />
  </div>
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
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    
    </div>)
  
  }


export default Books