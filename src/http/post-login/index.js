let arc = require('@architect/functions'),
  authenticatePerson = require('./authenticate-person.js'),
  url = arc.http.helpers.url

require('@architect/shared/globals')

exports.handler = async function http(request) {
  let session = await arc.http.session.read(request)

  let person = await authenticatePerson(request.body.email, request.body.password)

  const location = person ? url('/notes') : url('/login')

  session.attemptedEmail = person ? null : request.body.email

  session.person = person

  let cookie = await arc.http.session.write(session)
  return {
    cookie,
    status: MOVED_TEMPORARILY,
    location
  }
}
