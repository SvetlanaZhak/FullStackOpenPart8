const { ApolloServer,  UserInputError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
]

/*
 * It would be more sensible to assosiate book and the author by saving 
 * the author id instead of the name to the book.
 * For simplicity we however save the author name.
*/

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'The Demon',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    },
]

const typeDefs = gql`
 
  type Book {
    title: String!,
    published: Int!,
    author: String!,
    id: ID!,
    genres: [String],
  }
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Query {
    hello: String!
    authorCount: Int!
    bookCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
   
  }
  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int,
      genres: [String],
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`


const resolvers = {
    Author:{
        bookCount: (root) => books.filter(book=> book.author ===root.name).length
    },
    Query: {
    hello: () => { return "world" },
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allAuthors: () => authors,
    allBooks: (root, args) => {
        const filteredBooks = args.author ? books.filter(book => book.author === args.author) : books;
        return args.genre ? filteredBooks.filter(book => book.genres.includes(args.genre)) : filteredBooks;

    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
        if (books.find(p => p.title === args.title)) {
            throw new UserInputError('Book must be unique', {
              invalidArgs: args.title,
            })
          }
    
          const book = { ...args, id: uuid() }
          books = books.concat(book)
        
          if(!authors.find(author => author.name === book.author)) {
              const newAuthor={
                  name: book.author,
                  id: uuid()
              }
              authors= authors.concat(newAuthor)
          }
          return book
      
      },

    editAuthor: (root, args) => {
  
        const author = authors.find(author => author.name === args.name)
            if(!author){
                return null
            }
            const updatedAuthor = {
                ...author, born: args.setBornTo }
            authors = authors.map(author => author.name === args.name ? updatedAuthor : author)
            return updatedAuthor
            }
        }
    } 
  


const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})