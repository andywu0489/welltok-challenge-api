const express = require('express')
const passport = require('passport')

const Article = require('../models/article')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/my-articles', requireToken, (req, res, next) => {
  Article.find({'owner': req.user.id})
    .then(articles => {
      return articles.map(article => article.toObject())
    })
    .then(articles => res.status(200).json({ articles: articles }))
    .catch(next)
})

router.get('/all-articles', (req, res, next) => {
  Article.find()
    .then(articles => {
      return articles.map(article => article.toObject())
    })
    .then(articles => res.status(200).json({ articles: articles }))
    .catch(next)
})

router.get('/articles/:id', requireToken, (req, res, next) => {
  Article.findById(req.params.id)
    .then(handle404)
    .then(article => res.status(200).json({ article: article.toObject() }))
    .catch(next)
})

router.post('/articles', requireToken, (req, res, next) => {
  req.body.article.owner = req.user.id

  Article.create(req.body.article)
    .then(article => {
      res.status(201).json({ article: article.toObject() })
    })
    .catch(next)
})

router.patch('/articles/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.article.owner

  Article.findById(req.params.id)
    .then(handle404)
    .then(article => {
      requireOwnership(req, article)

      return article.update(req.body.article)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.delete('/articles/:id', requireToken, (req, res, next) => {
  Article.findById(req.params.id)
    .then(handle404)
    .then(article => {
      requireOwnership(req, article)
      article.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
