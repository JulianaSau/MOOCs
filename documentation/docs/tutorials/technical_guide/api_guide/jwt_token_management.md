### JWT Token Management

This tutorial explains how to manage JWT tokens in our MOOCs platform API. We use the `jsonwebtoken` package to generate and verify JWT tokens. This tutorial also includes other useful information relating to JWT token management.

#### JWT Tokens

JSON Web Tokens (JWTs) are a stateless way to authenticate users, which means that the server does not need to store any user data in memory or a database. Instead, the server sends the user a token upon successful authentication, and the user includes that token in subsequent requests to the server. The server then verifies the token to ensure that the user is authorized to access the requested resource.

There are two major types of JWT tokens used in this API: access tokens and refresh tokens. Access tokens are short-lived tokens that are used to authenticate a user and grant access to protected resources. Refresh tokens are long-lived tokens that are used to request new access tokens when the original access token expires.

#### Access Tokens

Access tokens are short-lived tokens that are used to authenticate a user and grant access to protected resources. Access tokens are generated using the `jsonwebtoken` package and are signed with a secret key. The secret key is stored in the `.env` file and should be kept secret. The access token payload contains the user's ID and role. The access token is valid for 15 minutes.

#### Refresh Tokens

Refresh tokens are long-lived tokens that are used to request new access tokens when the original access token expires. Refresh tokens are generated using the `jsonwebtoken` package and are signed with a secret key. The secret key is stored in the `.env` file and should be kept secret. The refresh token payload contains the user's ID and role. The refresh token is valid for 30 days.

Once the refresh token expires, the user must log in again to get a new refresh token.

Other than the expiration time, the access token and refresh token payloads are identical. This means that the user's ID and role are the same for both tokens. This is useful because we can use the same refresh token to request a new access token for the same user.

There are other token types such as the verification token, password reset token, superadmin activation and superadmin deactivation. These tokens are generated using the `jsonwebtoken` package and are signed with different secret keys. The secret key is stored in the `.env` file and should be kept secret. The verification token payload contains the user's ID and role. The verification token is valid for 24 hours. The password reset token payload contains the user's ID and role. The password reset token is valid for 15 minutes. The email change token payload contains the user's ID and role.

### Signing and Verifying JWT Tokens

In our API, we use the jsonwebtoken library to sign JWT tokens. The jwt.sign() function takes in a payload object, a secret, and some options. The payload object contains any data that needs to be transmitted in the token. The secret is a key used to sign the token, and options can be used to set the token's expiration time.

Here's an example of how we sign a JWT token:

```javascript
const jwt = require('jsonwebtoken');

const payload = {
  id: '63d4889852d1f1ff958237a4',
  email: 'moocssuperadmin@oscsa.com',
  role: 'SuperAdmin',
  status: {
    _id: '63d4889952d1f1ff958237a9',
    user: '63d4889852d1f1ff958237a4',
    isActive: true,
    isVerified: true,
    __v: 0
  },
  iat: 1680566033,
  exp: 1680587633
}

const secret = process.env.JWT_ACCESS_SECRET;

const token = jwt.sign(payload, secret, { expiresIn: '15m' });
```

The jwt.sign() function takes in a payload object, a secret, and some options. The payload object contains any data that needs to be transmitted in the token. The secret is a key used to sign the token, and options can be used to set the token's expiration time. The function returns a signed JWT token.


The jwt.verify() function takes in a token and a secret. The secret is the same secret that was used to sign the token. The function verifies that the token is valid and has not been tampered with. If the token is valid, the function returns the payload object that was used to sign the token. If the token is invalid, the function throws an error.

### Other types of JWT Tokens
The JWT tokens generated by the getAuthTokens function contain some important information about the user. The data object that is passed to the jwt.sign function contains the id of the user, their email, their role, and their status.

The id and email fields are pretty self-explanatory. The role field indicates what role the user has in the system. This can be something like "user", "admin", or "superadmin", depending on the level of access they have. The status field indicates the status of the user's account, which can be something like "active", "suspended", or "deleted".

In addition to the access and refresh tokens generated by the getAuthTokens function, there are several other types of JWT tokens that are used in the API. These include:

- password_reset - This token is generated when a user requests to reset their password. It is used to verify that the user who requested the password reset is the same user who is resetting their password.

- verification - This token is used to verify a user's email address. It is generated when a user signs up for the system, and contains a link that the user can click to verify their email address.

- su_activation - This token is generated when a superadmin activates an account that has been suspended or deleted. It is used to verify that the person requesting the activation is actually a superadmin.

- su_deactivation - This token is generated when a superadmin deactivates an account. It is used to verify that the person requesting the deactivation is actually a superadmin.

Each of these token types has its own secret and expiry time, which are stored in the config file. The getRequiredConfigVars function is used to retrieve the secret and expiry time for a given token type.


### Conclusion
In conclusion, JWT tokens are a secure and efficient way to manage user authentication and authorization in APIs. They provide a way to securely transmit user information between the client and server without the need for session management or server-side storage.

In this tutorial, we covered the basics of JWT tokens, including how they are structured, how they work, and how to use them in an API. We also covered the different types of JWT tokens used in our example API, including access tokens, refresh tokens, password reset tokens, email verification tokens, and super admin activation and deactivation tokens.

We also looked at the functions used to sign the JWT tokens and how to specify the type of token to generate. It's important to note that different types of tokens may require different secret keys and expiration times, so it's important to keep this in mind when implementing JWT tokens in your API.

Overall, JWT tokens provide a secure and efficient way to manage user authentication and authorization in APIs, and they are widely used in modern web development. By understanding the basics of JWT tokens, you can create a more secure and efficient API for your users.