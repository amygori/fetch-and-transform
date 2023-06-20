import URI from 'urijs'

// /records endpoint
window.path = 'http://localhost:3000/records'

// helper functions
const isPrimary = (color) => {
  return ['red', 'blue', 'yellow'].includes(color)
}

const transformData = (data) => {
  const transformedData = {}
  //hardcode pagination values for now
  transformedData.previousPage = null
  transformedData.nextPage = 2
  transformedData.ids = data.map((obj) => obj.id)
  transformedData.open = data
    .filter((obj) => obj.disposition === 'open')
    .map((obj) => ({ ...obj, isPrimary: isPrimary(obj.color) }))
  transformedData.closedPrimaryCount = data.reduce(
    (acc, obj) =>
      obj.disposition === 'closed' && isPrimary(obj.color) ? (acc += 1) : acc,
    0
  )
  return transformedData
}

// requests
const fetchData = async () => {
  return fetch(URI(window.path).search({ limit: 10 }))
    .then((res) => res.json())
    .then((data) => data)
}

// main function
// return value for retrieve() looks like
// const expected = {
//   previousPage: null,
//   nextPage: 2,
//   ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//   open: [
//     { id: 2, color: 'yellow', disposition: 'open', isPrimary: true },
//     { id: 4, color: 'brown', disposition: 'open', isPrimary: false },
//     { id: 6, color: 'blue', disposition: 'open', isPrimary: true },
//     { id: 8, color: 'green', disposition: 'open', isPrimary: false },
//     { id: 10, color: 'red', disposition: 'open', isPrimary: true },
//   ],
//   closedPrimaryCount: 1,
// }
const retrieve = async () => {
  const data = await fetchData()
  const results = transformData(data)
  return Promise.resolve(results)
}

export default retrieve
