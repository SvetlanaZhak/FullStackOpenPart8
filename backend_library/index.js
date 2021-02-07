const { ApolloServer,  UserInputError,AuthenticationError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('apollo-server')
const config = require('./utils/config')
const pubsub = new PubSub()

const MONGODB_URI = config.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })
// let authors = [
//     {
//         name: 'Robert Martin',
//         id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//         born: 1952,
//     },
//     {
//         name: 'Martin Fowler',
//         id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//         born: 1963
//     },
//     {
//         name: 'Fyodor Dostoevsky',
//         id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//         born: 1821
//     },
//     {
//         name: 'Joshua Kerievsky', // birthyear not known
//         id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//     },
//     {
//         name: 'Sandi Metz', // birthyear not known
//         id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//     },
// ]


// let books = [
//     {
//         title: 'Clean Code',
//         published: 2008,
//         author: 'Robert Martin',
//         id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Agile software development',
//         published: 2002,
//         author: 'Robert Martin',
//         id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//         genres: ['agile', 'patterns', 'design']
//     },
//     {
//         title: 'Refactoring, edition 2',
//         published: 2018,
//         author: 'Martin Fowler',
//         id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Refactoring to patterns',
//         published: 2008,
//         author: 'Joshua Kerievsky',
//         id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'patterns']
//     },
//     {
//         title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//         published: 2012,
//         author: 'Sandi Metz',
//         id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'design']
//     },
//     {
//         title: 'Crime and punishment',
//         published: 1866,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'crime']
//     },
//     {
//         title: 'The Demon',
//         published: 1872,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'revolution']
//     },
// ]

const typeDefs = gql`
    type User {
        username: String!
        id: ID!
        favoriteGenre: String!
    }
    type Token {
        value: String!
    }
 
 
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }
  type Book {
    title: String!,
    published: Int!,
    author: Author!,
    id: ID!,
    genres: [String],
  }
  type Query {
    hello: String!
    authorCount: Int!
    bookCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    me: User
   
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

    createUser(
        username: String!
        favoriteGenre: String!
    ): User
    login(
        username: String!
        password: String!
    ): Token 
  }
  type Subscription {
    bookAdded: Book!
  } 
`


const resolvers = {
    // Author:{
    //     bookCount: (root) => books.filter(book=> book.author ===root.name).length
    // },
    Query: {
 
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    //part A
//     allAuthors: () =>  {

//     const authors = await Author.find({})
 
//     const allAuthors = authors.map(author => {
//       return {
//         name: author.name,
//         born: author.born, 
//         id: author.id,
//         bookCount: author.books.length,
//       }
//     })

//     return allAuthors
// },
    allAuthors: () => Author.find({}),  
    allBooks: async (root, args) => {
      if (args.author) {
        const authors = await Author.findOne({ name: args.author })
        return Book.find({ author: authors }).populate('author')
      }
      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
      }
     
      if (args.genre && args.author) {
        const filteredAuthor = await Author.findOne({ name: args.author })
        return Book.find({ author: filteredAuthor, genres: { $in: [args.genre] } }).populate('author')
      }
    

      return Book.find({}).populate('author')
      },
      
//part a    
//     allBooks: (root, args) => {
//         const filteredBooks = args.author ? books.filter(book => book.author === args.author) : books;
//         return args.genre ? filteredBooks.filter(book => book.genres.includes(args.genre)) : filteredBooks;

//     }
    me: (root, args, context) => {
        return context.currentUser
    }
  },
   Author: {
    bookCount: (root) => Book.find({ author: root }).countDocuments()
  },

  Mutation: {
    addBook: async (root, args, context) => {

        const currentUser = context.currentUser
        if (!currentUser) {
            throw new AuthenticationError("not authenticated")
          }
  
      const author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({
          name: args.author,
          born: null
        })
        try {
          await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, { invalidArgs: args })
        }

        const book = new Book({ ...args, author: newAuthor })
        try {
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, { invalidArgs: args })
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      }
      
      const book = new Book({ ...args, author: author })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
      
      },

    editAuthor: async (root, args, context) => {

        const currentUser = context.currentUser
        if (!currentUser) {
            throw new AuthenticationError("not authenticated")
          }
          const author = await Author.findOne({ name: args.name })
          author.born = args.setBornTo
    
          try {
            await author.save()
          } catch (err) {
            throw new UserInputError(err.message, {
              invalidArgs: args,
            })
          }
          return author
  
        },

    createUser: (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
        
            return user.save()
              .catch(error => {
                throw new UserInputError(error.message, {
                  invalidArgs: args,
                })
              })
          }, 
    login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
        
            if ( !user || args.password !== 'secret' ) {
              throw new UserInputError("wrong credentials")
            }
        
            const userForToken = {
              username: user.username,
              id: user._id,
            }
        
            return { value: jwt.sign(userForToken, JWT_SECRET) }
          },
     
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
      },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7), JWT_SECRET
          )
    
          const currentUser = await User
            .findById(decodedToken.id)
    
          return { currentUser }
        }
      }  
    })


server.listen().then(({ url, subscriptionsUrl}) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscription ready at ${subscriptionsUrl}`)
})