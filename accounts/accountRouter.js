const express = require('express');

//database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

const { isValidPOST, isValidPUT, isValidQuery } = require('./accountService.js');

// with query stretch added
router.get('/', (req, res) => {
    // console.log(req)
    const query = req.query;
    if (Object.keys(query).length === 0){
        db('accounts')
            .then(accounts => {
                res.status(200).json({ data: accounts })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ message: error.message })
            });
    }
    else if (isValidQuery(query)) {
    db('accounts')
        .limit(query.limit)
        .orderBy(query.sortby, query.sortdir)
        .then(accounts => {
            res.status(200).json({ data: accounts })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: error.message })
        });
    } else {
        res.status(400).json({ message: "Please provide a valid query." })
    }
})
/*
limit — .limit(value)

Adds a limit clause to the query.

knex.select('*').from('users').limit(10).offset(30)
Outputs:
select * from `users` limit 10 offset 30
*/

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