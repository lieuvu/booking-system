# ----
# User
# ----

# curl --request POST 'http://localhost:3000/api/v1/user' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"first_name": "lieu",
# 	"last_name": "vu",
# 	"email": "lieu.vu@zervant.com",
# 	"password": "lieu.vu@zervant.com"
# }'

# for i in {1..10}; do
# curl --request POST 'http://localhost:3000/api/v1/user' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"first_name": "lieu",
# 	"last_name": "vu",
# 	"email": "lieu.vu2@zervant.com",
# 	"password": "lieu.vu@zervant.com"
# }' &
# done

# wait

# curl --request GET 'http://localhost:3000/api/v1/user/1' \
# --header 'Content-Type: application/json'

# curl --request PUT 'http://localhost:3000/api/v1/user/1' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"first_name": "thanh"
# }'

# curl --request DELETE 'http://localhost:3000/api/v1/user' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"email": "lieu.vu@zervant.com",
# 	"password": "lieu.vu@zervant.com"
# }'

# ----------------
# Building Address
# ----------------

# curl --request POST 'http://localhost:3000/api/v1/building-address' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"street": "washington post",
#   "number": "3",
#   "postal_code": "00560",
#   "city": "hElsinki"
# }'

# for i in {1..10}; do
# curl --request POST 'http://localhost:3000/api/v1/user' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"first_name": "lieu",
# 	"last_name": "vu",
# 	"email": "lieu.vu2@zervant.com",
# 	"password": "lieu.vu@zervant.com"
# }' &
# done

# wait

# curl --request GET 'http://localhost:3000/api/v1/building-address/1' \
# --header 'Content-Type: application/json'

# curl --request PUT 'http://localhost:3000/api/v1/building-address/-1' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "street": "Test",
#   "number": "15"
# }'

# curl --request DELETE 'http://localhost:3000/api/v1/user' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"email": "lieu.vu@zervant.com",
# 	"password": "lieu.vu@zervant.com"
# }'

# -------
# Machine
# -------

# curl --request POST 'http://localhost:3000/api/v1/machine-type' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"type": "Washing Machine"
# }'

# curl --request POST 'http://localhost:3000/api/v1/building-address' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"street": "Intiankatu",
#   "number": "3",
#   "postal_code": "00560",
#   "city": "Helsinki"
# }'

# curl --request POST 'http://localhost:3000/api/v1/machine' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "brand": "Taplet",
#   "model": "T131",
#   "machine_type_id": 1
# }'

# curl --request POST 'http://localhost:3000/api/v1/machine' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"building_id": 1,
#   "brand": "Taplet",
#   "model": "T131",
#   "number": 1,
#   "machine_type_id": 1
# }'

# ------------
# User-Address
# ------------

# curl --request GET 'http://localhost:3000/api/v1/user-address?user_id=1&lieu=abc&test=13.5&tisValid=true' \
# --header 'Content-Type: application/json'


# ----------------
# Machine Location
# ----------------

# curl --request POST 'http://localhost:3000/api/v1/machine-type' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"type": "Washing Machine"
# }'

# curl --request POST 'http://localhost:3000/api/v1/building-address' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"street": "Intiankatu",
#   "number": "3",
#   "postal_code": "00560",
#   "city": "Helsinki"
# }'


# curl --request POST 'http://localhost:3000/api/v1/machine' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "brand": "Taplet",
#   "model": "T131",
#   "machine_type_id": 1
# }'

# curl --request POST 'http://localhost:3000/api/v1/machine-location' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "machine_id": 1,
#   "building_id": 1,
#   "status": "active"
# }'

# sleep 2

# curl --request GET 'http://localhost:3000/api/v1/machine-location/2' \
# --header 'Content-Type: application/json'

# curl --request GET 'http://localhost:3000/api/v1/machine-location?machine_id=1' \
# --header 'Content-Type: application/json'

# curl --request GET 'http://localhost:3000/api/v1/machine-location?building_id=1' \
# --header 'Content-Type: application/json'

# curl --request GET 'http://localhost:3000/api/v1/machine-location?status=active' \
# --header 'Content-Type: application/json'

# curl --request GET 'http://localhost:3000/api/v1/machine-location?machine_id=1&building_id=1&status=active' \
# --header 'Content-Type: application/json'


# -------
# Booking
# -------

# curl --request POST 'http://localhost:3000/api/v1/user' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"first_name": "lieu",
# 	"last_name": "vu",
# 	"email": "lieu.vu2@zervant.com",
# 	"password": "lieu.vu@zervant.com"
# }'

# curl --request POST 'http://localhost:3000/api/v1/building-address' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"street": "Intiankatu",
#   "number": "3",
#   "block_number": "A",
#   "postal_code": "00560",
#   "city": "Helsinki"
# }'

# curl --request POST 'http://localhost:3000/api/v1/user-address' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"user_id": 1,
#   "building_id": 1,
#   "apartment_number": "7"
# }'

# curl --request POST 'http://localhost:3000/api/v1/machine-type' \
# --header 'Content-Type: application/json' \
# --data-raw '{
# 	"type": "Washing Machine"
# }'

# curl --request POST 'http://localhost:3000/api/v1/machine' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "machine_type_id": 1,
#   "brand": "Taplet",
#   "model": "T131",
#   "description": "aplet washing machine T131"
# }'

# curl --request POST 'http://localhost:3000/api/v1/machine-location' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "machine_id": 1,
#   "building_id": 1,
#   "number": 1,
#   "status": "active"
# }'

# sleep 2

# Invalid start_time
# curl --request POST 'http://localhost:3000/api/v1/booking' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "user_id": 1,
#   "machine_id": 1,
#   "start_time": "2020-11-28T10:00+00:00",
#   "end_time": "2020-11-28T11:00:00+00:00"
# }'

# curl --request POST 'http://localhost:3000/api/v1/booking' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "user_id": 1,
#   "machine_id": 1,
#   "start_time": "2020-11-28T10:00:49.189Z",
#   "end_time": "2020-11-28T11:00:00+00:00"
# }'

# curl --request POST 'http://localhost:3000/api/v1/booking' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "user_id": 1,
#   "machine_id": 1,
#   "start_time": "2020-11-28T23:00:00+00:00",
#   "end_time": "2020-11-29T02:00:00+02:00"
# }'

# curl --request GET 'http://localhost:3000/api/v1/booking/99' \
# --header 'Content-Type: application/json'

curl --request GET 'http://localhost:3000/api/v1/booking?user_id=1&start_period=2020-11-28&end_period=2020-11-29' \
--header 'Content-Type: application/json'

# curl --request DELETE 'http://localhost:3000/api/v1/booking/1' \
# --header 'Content-Type: application/json'
