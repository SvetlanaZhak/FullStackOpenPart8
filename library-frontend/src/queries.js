import { gql  } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      id
      born
      bookCount
    }
  }
`


export const ALL_BOOKS = gql`
  query {
    allBooks  {
        title
        author
        published
    }
  }
`


// const BOOK_DETAILS = gql`
//   fragment BookDetails on Book {
//     title
//     published
//     author {
//       name
//       born
//       bookCount
//     }
//     id
//     genres
//   }
// `


// const BOOK_DETAILS = gql`
//   fragment BookDetails on Book {
//     title
//     published
//     author 
//     id
//     genres
//   }
//   `

// const BOOK_DETAILS= qql ``
// fragment BookDetailson CreateBook {
//     title: String!,
//     published: Int!,
//     author: String!,
//     id: ID!,
//     genres: [String]
//   }
//   ` 
  
export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int, $genres: [String]) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
      ){
        title
        author
        published
      }
    }
    `
    export const EDIT_YEAR = gql`
    mutation editAuthor($name: String!, $born: Int!) {
      editAuthor(
        name: $name,
        setBornTo: $born
      ) {
        name
        born
        bookCount
      }
    }
  `