const express = require('express');

//database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

const { isValidPOST, isValidPUT } = require('./accountService.js');

router.get('/', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.status(200).json({ data: accounts })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: error.message })
        });
})

router.get('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .first()
        .then(account => {
            if (account) {
                res.status(200).json({ data: account })

            } else {
                res.status(404).json({ message: "No account by that ID." })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: error.message })
        });
})

router.post('/', (req, res) => {
    const account = req.body;

    if (isValidPOST(account)) {
        db('accounts')
            .insert(account, 'id')
            .then(ids => {
                res.status(201).json({ data: ids })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ message: error.message })
            });
    } else {
        res.status(400).json({ message: "Please provide a valid name and budget." })


    }
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    if (isValidPUT(changes)) {
        db('accounts')
            .where({ id: req.params.id })
            .update(changes)
            .then(count => {
                if (count > 0) {
                    res.status(201).json({ data: count })
                } else {
                    res.status(404).json({ message: "Account not found by that ID." })
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ message: error.message })
            })
    } else {
        res.status(400).json({ message: "Please provide a valid name or budget." })
    }
});

router.delete('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .del()
        .then(account => {
            if (account) {
                res.status(200).json({ data: account })

            } else {
                res.status(404).json({ message: "No account by that ID." })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: error.message })
        });
});

module.exports = router;