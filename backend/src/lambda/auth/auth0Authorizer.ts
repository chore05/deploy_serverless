import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-asnmx32hhv3f8foe.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  const response = await Axios.get(jwksUrl)
  /* const publicKey = `-----BEGIN CERTIFICATE-----
${data.keys[0].x5c[0]}
-----END CERTIFICATE-----`
  const verifiedToken = verify(token, publicKey, {algorithms: [jwt.header.alg]})
  return verifiedToken as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}*/
  const keys = response.data.keys
  logger.info(`Getting certificate from ${jwksUrl}`)
  var certificate = ""

  const kID = jwt.header.kid

  for (let key of keys) {    
    // Get the right certificate by matching jwt header kID with jwtsURL kid from Auth0
    if (key.kid === kID) {
      certificate = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----\n`
      logger.info('Correct certificate found', certificate)
      break
    }
  }

  const verifiedToken = verify(token, certificate, { algorithms: ['RS256'] })
  logger.info(`Token verified`)
  return verifiedToken as JwtPayload

}

function getToken(authHeader: string): string {
if (!authHeader) throw new Error('No authentication header')

if (!authHeader.toLowerCase().startsWith('bearer '))
  throw new Error('Invalid authentication header')

const split = authHeader.split(' ')
const token = split[1]

return token
}
