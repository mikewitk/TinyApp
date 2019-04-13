# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to short long URLs and store (while the session exists - logged in) for future use or modification.
Passwords and cookies are stored using cryptography.

## Final Product

!["Shortning URL"](https://github.com/mikewitk/TinyApp/blob/master/docs/url_creating.png?raw=true)
!["User page showing personal created links"](https://github.com/mikewitk/TinyApp/blob/master/docs/urls_links.png?raw=true)
!["Page to display short URL details and long URL update option"](https://github.com/mikewitk/TinyApp/blob/master/docs/urls_updating.png?raw=true)
!["New page showing updated long URL keeping same **shortned url**"](https://github.com/mikewitk/TinyApp/blob/master/docs/urls_updated.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- bodey-parser
- cookie-session

## Getting Started

- Install all dependencies (usng the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Usefull links

- `http://localhost:8080/register`: to create an account
- `http://localhost:8080/urls/new`: to create shortned URLs
- `http://localhost:8080/urls`: to display shortned URLs
- `http://localhost:8080/login`: to login
- `http://localhost:8080/u/<ShortURL>`: substitute *ShortURL* with your code to create a redirection link