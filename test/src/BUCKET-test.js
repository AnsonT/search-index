import si from '../../dist/search-index.esm.js'
import test from 'tape'

const sandbox = 'test/sandbox/'
const indexName = sandbox + 'BUCKET'

test('create a search index', t => {
  t.plan(1)
  si({ name: indexName }).then(db => {
    global[indexName] = db    
    t.pass('ok')
  })
})

test('can add data', t => {
  const data = [
    {
      "_id": 0,
      "make": "Tesla",
      "manufacturer": "Volvo",
      "brand": "Volvo"
    },
    {
      "_id": 1,
      "make": "BMW",
      "manufacturer": "Volvo",
      "brand": "Volvo"
    },
    {
      "_id": 2,
      "make": "Tesla",
      "manufacturer": "Tesla",
      "brand": "Volvo"
    },
    {
      "_id": 3,
      "make": "Tesla",
      "manufacturer": "Volvo",
      "brand": "BMW"
    },
    {
      "_id": 4,
      "make": "Volvo",
      "manufacturer": "Volvo",
      "brand": "Volvo"
    },
    {
      "_id": 5,
      "make": "Volvo",
      "manufacturer": "Tesla",
      "brand": "Volvo"
    },
    {
      "_id": 6,
      "make": "Tesla",
      "manufacturer": "Tesla",
      "brand": "BMW"
    },
    {
      "_id": 7,
      "make": "BMW",
      "manufacturer": "Tesla",
      "brand": "Tesla"
    },
    {
      "_id": 8,
      "make": "Volvo",
      "manufacturer": "BMW",
      "brand": "Tesla"
    },
    {
      "_id": 9,
      "make": "BMW",
      "manufacturer": "Tesla",
      "brand": "Volvo"
    }
  ]

  t.plan(1)
  global[indexName].PUT(data).then(t.pass)
})


test('simple BUCKET', t => {
  const { BUCKET } = global[indexName]
  t.plan(1)
  BUCKET(
    'make:volvo',
  ).then(res => {
    t.looseEqual(res, {
      field: [ 'make' ], value: { gte: 'volvo', lte: 'volvo' }, _id: [ '4', '5', '8' ]
    })
  })
})

test('simple BUCKET with a range', t => {
  const { BUCKET } = global[indexName]
  t.plan(1)
  BUCKET({
    field: 'make',
    value: {
      gte: 'a',
      lte: 'u'
    }
  }).then(res => {
    t.looseEqual(res, {
      field: 'make', value: { gte: 'a', lte: 'u' }, _id: [ '0', '1', '2', '3', '6', '7', '9' ] 
    })
  })
})

test('simple BUCKET (JSON)', t => {
  const { QUERY } = global[indexName]
  t.plan(1)
  QUERY({
    BUCKET: 'make:volvo'
  }).then(res => {
    t.looseEqual(res, {
      field: [ 'make' ], value: { gte: 'volvo', lte: 'volvo' }, _id: [ '4', '5', '8' ]
    })
  })
})


test('simple BUCKET with a range (JSON)', t => {
  const { QUERY } = global[indexName]
  t.plan(1)
  QUERY({
    BUCKET: {
      field: 'make',
      value: {
        gte: 'a',
        lte: 'u'
      }
    }
  }).then(res => {
    t.looseEqual(res, {
      field: 'make', value: { gte: 'a', lte: 'u' }, _id: [ '0', '1', '2', '3', '6', '7', '9' ] 
    })
  })
})

