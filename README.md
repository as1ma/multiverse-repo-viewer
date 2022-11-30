# Repo Viewer

This is a dummy application that will teach you how to integrate with an API that uses OAuth.

## Instructions

1. [Create a new OAuth App](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app). The "Application name" should be `Repo Viewer`. The "Homepage URL" should be `http://localhost:3000`. The "Authorization callback URL" should be `http://localhost:3000/callback`. Leave "Enable Device Flow" **unchecked**.
2. [Create a new repository from this template](https://github.com/MultiverseLearningProducts/repo-viewer-template/generate), clone it, and run `npm install` in your shell.
3. Create a `.env` file with `CLIENT_ID`, `CLIENT_SECRET` and `SESSION_SECRET` environment variables. GitHub will have given you a client ID and client secret. You can run `node -e "console.log(crypto.randomBytes(32).toString('hex'))"` in your shell to generate a session secret.
4. Implement the routes listed below.

## Routes

### `/`

A home page with a link for the user to sign in via the <b>authorization server</b> (GitHub).

### `/login`

When the user activates the sign-in link, you should redirect them to the <b>authorization server</b> (GitHub) to request their <b>consent</b> for the `"repo"` <b>scope</b>.

### `/callback`

The <b>authorization server</b> (GitHub) will redirect the user to this <b>redirect URI</b> with a temporary <b>authorization code</b> once they grant their <b>consent</b>. You should exchange the temporary <b>authorization code</b> for an <b>access token</b>.

### `/repos`

Using the <b>access token</b>, you should make a request to the <b>resource server</b> (the GitHub REST API).

### `/logout`

You should clear the user's current session and log them out.
