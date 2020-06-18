curl --request GET 'http://localhost:3000/api/v1/user' \
--header 'Content-Type: application/json'

curl --request POST 'http://localhost:3000/api/v1/user' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email": "lieu.vu@zervant.com",
	"password": "lieu.vu@zervant.com"
}'

curl --request PUT 'http://localhost:3000/api/v1/user' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email": "lieu.vu@zervant.com",
	"password": "lieu.vu@zervant.com"
}'
curl --request DELETE 'http://localhost:3000/api/v1/user' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email": "lieu.vu@zervant.com",
	"password": "lieu.vu@zervant.com"
}'