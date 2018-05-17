const should = require('should')
const add = require('../lib/add')

describe('#add', () => {
    // 測試算出來的平均是不是 2.5
    it('should return the num+1', done => {
      var result = add(-10)
      result.should.equal(-9)
      done()
    })
    // 測試有沒有回傳 NaN
    it('should return NaN when the number is not natural', done => {
      var result = add(10.5)
      result.should.equal(11)
      done()
    })
  })