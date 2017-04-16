## Message Board

Build a web-server (with HTTP APIs) that acts as a public message board.
Any client can post messages to it, and it can also see all messages posted by other clients.
Some clients possess a secret token, which can be used to perform destructive actions on the message board.

---

### The message board needs to perform the following functions.

1. Accept a `message` from a client.
  A message containts `text`, and some other derived information.
  - `source` of the message (this can be the IP address of the client the request came from)
  - `time` of the message (time at which the message was created/stored/accepted on the server)
2. List all messages ever received (from all clients) in a specified order
  - A client should be able to retrieve the list of messages in the order in which they were received on the message board (latest first or oldest first, either works).
3. Delete message(s).
  - Clients who possess the secret token must be able to delete a single message, or all messages on the message board.
