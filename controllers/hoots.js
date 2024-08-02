const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const Hoot = require('../models/hoot.js')
const router = express.Router()

// * ========== Public Routes ===========

// * ========= Protected Routes =========

router.use(verifyToken)


// * ========== HOOTS ===========

// * CREATE
router.post('/', async (req, res) => {
  try {
    req.body.author = req.user._id
    const hoot = await Hoot.create(req.body)
    hoot._doc.author = req.user
    return res.status(201).json(hoot)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})


// * INDEX
router.get('/', async (req, res) => {
  try {
    const hoots = await Hoot.find().populate('author')
    return res.json(hoots)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
})


// * SHOW
router.get('/:hootId', async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId)
      .populate('author')
      .populate('comments.author')
      
    if (!hoot){
      res.status(404)
      throw new Error('Hoot not found!')
    }
    return res.json(hoot)
  } catch (error) {
    console.error(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})


// * UPDATE
router.put('/:hootId', async (req, res) => {
  const { hootId } = req.params
  try {
    const hoot = await Hoot.findById(hootId)

    // Send 404 if not found
    if (!hoot){
      res.status(404)
      throw new Error('Hoot not found!')
    }

    // Check user is authorized to update document (is document author)
    if (!hoot.author.equals(req.user._id)){
      res.status(403)
      throw new Error('Forbidden')
    }

    // Updating the document
    const updatedHoot = await Hoot.findByIdAndUpdate(hootId, req.body, { new: true })

    updatedHoot._doc.author = req.user

    return res.json(updatedHoot)

  } catch (error) {
    console.error(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})


// * DELETE
router.delete('/:hootId', async (req, res) => {
  const { hootId } = req.params
  try {
    const hoot = await Hoot.findById(hootId)

    // Send 404 if not found
    if (!hoot){
      res.status(404)
      throw new Error('Hoot not found!')
    }

    // Check user is authorized to update document (is document author)
    if (!hoot.author.equals(req.user._id)){
      res.status(403)
      throw new Error('Forbidden')
    }

    const deletedHoot = await Hoot.findByIdAndDelete(hootId)

    return res.json(deletedHoot)
  } catch (error) {
    console.error(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})



// * ========== COMMENTS ===========

router.post('/:hootId/comments', async (req, res) => {
  const { hootId } = req.params
  try {
    // Add author key to req.body based on authenticated user _id
    req.body.author = req.user._id
    
    // Search for the parent hoot (that the comment should be added to)
    const hoot = await Hoot.findById(hootId)

    // Send 404 if not found
    if (!hoot){
      res.status(404)
      throw new Error('Hoot not found!')
    }

    // Add the comment to the comments array
    hoot.comments.push(req.body)

    // Save the parent document to persist to the database
    await hoot.save()

    // Find newly added comment (last index of hoot.comments array)
    const newComment = hoot.comments[hoot.comments.length - 1]

    // Add req.user to author field
    newComment._doc.author = req.user

    // Send new comment in 201 response
    return res.status(201).json(newComment)
  } catch (error) {
    console.error(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})


module.exports = router