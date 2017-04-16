# Message Board
A web-server (with HTTP APIs) that acts as a public message board.

-----
# Steps to run:
1. Install Node.js version ```6.9.1```
2. Install MongoDB Community Server edition version ```3.4.3```.
3. On command line type ```mongod``` and hit enter. (Will run Mongo on its default port ```27017```)
4. Go to root directory of *MessageBoard* project.
5. On command line type ```npm install``` and hit enter.
6. On command line type ```npm start``` and hit enter.
- Yahoo your server is up and running on default port ```5000```.
- Go through below docs, to understand the ```Entities``` and supported ```API```'s.
- Optional: You can also run test cases by ```npm test```.
-----
# Entity
- Currently there is just one **Message** Entity. Below is the structure shown:
    ```sh
    {
      "id": String,
      "text": String,
      "meta": {
        "source": String,
        "time": Number,
        "boardType": String
      }
    }
    
    Example:
    {
      "id": "58f2e4e7b010414bd5af8207",
      "text": "Hello world",
      "meta": {
        "source": "127.0.0.1",
        "time": 1492244186051,
        "boardType": "public"
       }
    }
    
    id              : Server generated unqiue identifier.        
    text            : Message board text
    meta.source     : IP of the user who created this message entity
    meta.time       : Timestamp in UTC. (Specifies timestamp in ms)
    meta.boardType  : Specifies the board type. Currently just "public" board is supported
    ```

- Currently we have **boardType** field set to default **public** value. As there is no concept of private or any other boards right now. But in future we can make few changes and enable any **boardType** as per our use case as our DB schema already supports it. 
- We have **indexed meta.time field**. As per our use case its obvious that we need to index on *meta.time* as the GET query demands sorted/range query on basis of timestamp.
- Why **id** field is **String** data type instead of **Number** data type? --> Because in JS (as most of our web clients would be in JS) the Number cannot go beyond *9007199254740991*. So we don't want to limit the number of records in our table by mere language's data type limitation! That's why **id** is choosen to be of *String* data type.

-----
# API
- Follows REST convention
    ```sh
    BASE_URL has pattern /{project_name}/api/{api_version}/{board_type}/messages
    
    Description of above variable fields:
    project_name    : Has static value "message-board"
	api_version     : Current version is "v1".
	board_type      : Currently just "public" board type is supported.
    
    - BASE_URL: /message-board/api/v1/public/messages
    ```
- For above mentioned API, just **GET, POST, DELETE** are supported. Each one is described below:

-----
# HTTP GET

- API: ```localhost:5000/message-board/api/v1/public/messages```
- Lists all messages with **latest first** order.
- If no query param is provided it lists all the messages.
- Query param:
    ```sh
      pageSize      : Number of messages the client wants to get in a single HTTP call.
      timeCursor    : Timestamp (in ms) which would be acting as a cursor.
      direction     : The direction to move along from the given timeCursor.
                      Possible values "forward" / "backward"
    ```

    ```sh
    Example using cURL
    
    Get all messages:
    curl -X GET http://localhost:5000/message-board/api/v1/public/messages
    
    Get top 3 recent messages:
    curl -X GET http://localhost:5000/message-board/api/v1/public/messages?pageSize=3
    
    Get messages using pagination:
    curl -X GET http://localhost:5000/message-board/api/v1/public/messages?pageSize=5&direction=forward&timeCursor=1492313318225
    ```
- Why bother with **pagination**? --> For limited messages it would be fine. But as the messages grow on our public board, it would not make sense to send hundreds or thoudsands of messages, this would in turn **slow the response time** of our HTTP endpoint and also **consume lot of client memory**.
- Why cursor is used as **timestamp** instead of **messageId**? --> Well we could have exploited the Mongo ObjectID as it is sorted with time. But we want out application code to be agnostic with the DB which we are using. If in future, we tend to migrate to some other DB, we would get into trouble. That's why cursor is based upon **timestamp**.
- Known limitations:
    ```sh
    1. As our number of concurrent users grow, we would be having multiple concurrent messages per second.
      By case if 2 or more messages, have same timestamp then pagination results can miss some records.
      (Though we are considering 2 or messages have same timestamp, down till milliseconds,
       still it can happen in highly concurrent env!)
    
    2. Above issue can be mitigated, by providing "messageId" along with "timeCursor" to pinpoint the exact
      record from where pagination will start. Though this is not implemented in current implmentation.
    
    3. For sorting, we are relying on Mongos sort, so its not stable sort. ie. Messages with same timestamp
    (arriving at same ms) can be out of order within them.
    ```

# HTTP POST
- API: ```localhost:5000/message-board/api/v1/public/messages```
- Creates a message on message board.
- Payload Format:
    ```sh
    {
	    "message": {
		    "text": String
	    }
    }
    
    Example:
    {
    	"message": {
    		"text": "Hello world."
    	}
    }
    
    Example using cURL:
    curl -X POST http://localhost:5000/message-board/api/v1/public/messages \
    -H 'content-type: application/json' \
    -d '{
	    "message": {
		    "text": "Hello world."
	    }
    }'
    ```

# HTTP DELETE
- This API can be used only by few clients who posses the secretToken. (Value of secretToken: ```sdb~5$43@2ed*cv&4=32ew#fv```)
- Delete all messages from messageboard.
    ```sh
    - API: localhost:5000/message-board/api/v1/public/messages
    - header: 'secret-token': 'sdb~5$43@2ed*cv&4=32ew#fv'
    - Delete all messages.
    - Example using cURL:
    curl -X DELETE http://localhost:5000/message-board/api/v1/public/messages -H 'secret-token: sdb~5$43@2ed*cv&4=32ew#fv'
    ```
- Delete message with given messageId.
    ```sh
    - API: localhost:5000/message-board/api/v1/public/messages/{messageId}
    - header: 'secret-token': 'sdb~5$43@2ed*cv&4=32ew#fv'
    - Delete message with the specified messageId.
    - Example using cURL:
    curl -X DELETE http://localhost:5000/message-board/api/v1/public/messages/58f306ae33bdb54f3b3972f2 -H 'secret-token: sdb~5$43@2ed*cv&4=32ew#fv'
    ```
- Cases such as deleting message which does not exist, client who does not posses the secreToken is deleting, etc are taken care of.

-----
# Test cases

- Run **npm test** from command line at the root directory of the project to run the test cases.
- Test cases are run on seperate **test** database. As we don't want to run test cases on our actual live DB!
